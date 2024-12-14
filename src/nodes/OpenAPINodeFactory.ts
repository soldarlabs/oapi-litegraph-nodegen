/**
 * @file Factory function for creating OpenAPI node classes.
 */
import { LiteGraph } from "litegraph.js";
import { OpenAPINode } from "./OpenAPINode.js";
import { logger } from "../utils/logger.js";
import { OpenAPIV3 } from "openapi-types";

export type HttpMethod =
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch"
  | "options"
  | "head"
  | "trace";
interface NodeConfig {
  method: HttpMethod;
  path: string;
  operation: OpenAPIV3.OperationObject | any;
  serverUrl?: string;
}

/**
 * Creates a custom node class for a specific OpenAPI operation.
 * @param config - Node configuration object
 * @returns A custom node class
 */
export function createOpenAPINodeClass({
  method,
  path,
  operation,
  serverUrl,
}: NodeConfig) {
  const title = `${method.toUpperCase()} ${path}`;

  class ApiOperationNode extends OpenAPINode {
    static title = title;

    constructor() {
      super(title, operation, serverUrl);
      this.method = method.toLowerCase();
      this.path = path;

      // Store operation details for better type handling
      this.operationId = operation.operationId;

      // Safely extract content types with fallbacks
      const requestContent = operation.requestBody?.content || {};
      const requestTypes = Object.keys(requestContent);
      this.requestContentType =
        requestTypes.length > 0
          ? (requestTypes[0] ?? "application/json")
          : "application/json";

      const responseContent = operation.responses?.["200"]?.content || {};
      const responseTypes = Object.keys(responseContent);
      this.responseContentType =
        responseTypes.length > 0
          ? (responseTypes[0] ?? "application/json")
          : "application/json";
    }

    async onExecute() {
      try {
        logger.info("Node executing", {
          component: "OpenAPINode",
          nodeId: this.nodeId,
          operation: "execute",
          inputCount: this.inputs?.length || 0,
        });

        // Set the mode to onTrigger so it doesn't execute indefinitely
        this.mode = LiteGraph.ALWAYS;

        // Initialize input data object
        const inputData: { [key: string]: any } = {};

        // Collect input data from both connected inputs and stored input values
        if (this.inputs) {
          for (let i = 0; i < this.inputs.length; i++) {
            const value = this.getInputData(i);
            const inputName = this.inputs[i]?.name;
            if (inputName) {
              // If we have a connected input, use its value
              if (value !== undefined) {
                inputData[inputName] = value;
              }
              // Otherwise use the stored input value if available
              else if (this.inputValues.has(inputName)) {
                const storedValue = this.inputValues.get(inputName);
                if (storedValue?.value !== undefined && storedValue?.value !== null) {
                  inputData[inputName] = storedValue.value;
                }
              }
            }
          }
        }

        // Process parameters based on their schema
        if (operation.parameters) {
          for (const param of operation.parameters) {
            if (
              "schema" in param &&
              param.schema &&
              inputData[param.name] !== undefined
            ) {
              const value = inputData[param.name];
              // Don't convert File objects
              if (!(value instanceof File)) {
                switch (param.schema.type) {
                  case "integer":
                  case "number":
                    inputData[param.name] = Number(value);
                    break;
                  case "boolean":
                    inputData[param.name] = Boolean(value);
                    break;
                  case "array":
                    inputData[param.name] = Array.isArray(value)
                      ? value
                      : [value];
                    break;
                }
              }
            }
          }
        }

        // Handle request body parameters
        if (operation.requestBody?.content) {
          const content =
            operation.requestBody.content[this.requestContentType];
          if (content?.schema?.properties) {
            for (const [propName, propSchema] of Object.entries(
              content.schema.properties,
            )) {
              if (
                inputData[propName] !== undefined &&
                propSchema &&
                typeof propSchema === "object" &&
                "type" in propSchema
              ) {
                const value = inputData[propName];
                // Don't convert File objects
                if (!(value instanceof File)) {
                  switch (propSchema.type) {
                    case "integer":
                    case "number":
                      inputData[propName] = Number(value);
                      break;
                    case "boolean":
                      inputData[propName] = Boolean(value);
                      break;
                    case "array":
                      inputData[propName] = Array.isArray(value)
                        ? value
                        : [value];
                      break;
                  }
                }
              }
            }
          }
        }

        // Set content type header based on request body schema
        const headers = {
          "Content-Type": this.requestContentType,
          Accept: this.responseContentType,
        };

        // Make the API call
        const response = await this.apiClient.execute(
          this.method,
          this.path,
          inputData,
          headers,
        );

        // Transform response based on OpenAPI spec
        let transformedResponse = response;
        if (operation.responses?.["200"]?.content) {
          const responseContent =
            operation.responses["200"].content[this.responseContentType];
          if (responseContent?.schema) {
            const schema = responseContent.schema;
            // Transform response based on schema type
            switch (schema.type) {
              case "array":
                transformedResponse = Array.isArray(response)
                  ? response
                  : [response];
                break;
              case "object":
                transformedResponse =
                  typeof response === "object" ? response : { value: response };
                break;
              case "string":
                transformedResponse = String(response);
                break;
              case "number":
              case "integer":
                transformedResponse = Number(response);
                break;
              case "boolean":
                transformedResponse = Boolean(response);
                break;
              default:
                transformedResponse = response;
            }
          }
        }

        // Set output data
        this.setOutputData(0, transformedResponse);

      } catch (err) {
        const error = err as Error;
        logger.error("Node execution failed", {
            component: "OpenAPINode",
            nodeId: this.nodeId,
            operation: "execute",
            error: error.message,
          stack: error.stack,
        });
        // Set error in output
        this.setOutputData(0, { error: error.message });
      }
    }
  }

  return ApiOperationNode;
}
