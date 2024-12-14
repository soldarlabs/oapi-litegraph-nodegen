// src/services/ApiClient.ts
import { logger } from "../utils/logger.js";

interface RequestOptions {
  method: string;
  headers: Record<string, string>;
  body?: string | FormData | Blob;
}

export class ApiClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(baseUrl?: string, headers: Record<string, string> = {}) {
    this.baseUrl = baseUrl || "";
    this.headers = {
      "Content-Type": "application/json",
      ...headers,
    };
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  private buildUrl(path: string, queryParams?: Record<string, any>): string {
    const url = new URL(path, this.baseUrl);

    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  private buildRequestOptions(
    method: string,
    data?: any,
    headers?: Record<string, string>,
  ): RequestOptions {
    const options: RequestOptions = {
      method: method.toUpperCase(),
      headers: {
        ...this.headers,
        ...headers,
      },
    };

    if (data && method !== "GET") {
      // Handle different content types
      const contentType = options.headers["Content-Type"];

      if (contentType?.includes("multipart/form-data") || 
          contentType?.includes("application/x-www-form-urlencoded")) {
        // Handle form data (files and form-urlencoded)
        const formData = new FormData();
        
        Object.entries(data).forEach(([key, value]) => {
          // If the value is a File object, append it directly
          if (value instanceof File) {
            formData.append(key, value);
          } else {
            // For non-file values, stringify objects and convert to string
            const processedValue = typeof value === "object" ? 
              JSON.stringify(value) : String(value);
            formData.append(key, processedValue);
          }
        });

        delete options.headers["Content-Type"]; // Let browser set this
        options.body = formData;
      } else if (contentType?.includes("application/octet-stream")) {
        // Handle binary data
        options.body = data;
      } else {
        // Default to JSON
        options.body = JSON.stringify(data);
      }
    }

    return options;
  }

  async execute(
    method: string,
    path: string,
    data?: any,
    headers?: Record<string, string>,
  ) {
    try {
      // Build URL with query params for GET requests
      const url = this.buildUrl(path, method === "GET" ? data : undefined);

      // Build request options
      const options = this.buildRequestOptions(
        method,
        method !== "GET" ? data : undefined,
        headers,
      );

      const response = await fetch(url, options);

      // Handle different response types
      let responseData;
      const contentType = response.headers.get("Content-Type");

      if (contentType?.includes("application/json")) {
        responseData = await response.json().catch(() => null);
      } else if (contentType?.includes("text/")) {
        responseData = await response.text();
      } else {
        // Binary data
        responseData = await response.blob();
      }

      if (!response.ok) {
        logger.error("API request failed:", {
          component: "ApiClient",
          status: response.status,
          statusText: response.statusText,
          url,
          method,
          requestData: data,
          responseData,
          headers: options.headers,
        });
        throw new Error(
          responseData?.message || `HTTP error! status: ${response.status}`,
        );
      }

      return responseData;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      logger.error("API call failed", {
        component: "ApiClient",
        method,
        path,
        url: this.baseUrl + path,
        requestData: data,
        error: error.message,
      });
      throw error;
    }
  }
}
