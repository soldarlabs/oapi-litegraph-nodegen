/**
 * @file Contains widget mappings and utilities for OpenAPI node inputs.
 */
import { IWidget } from "litegraph.js";

// These are the widget types supported by LiteGraph.js.
export type WidgetType =
  | "number"
  | "slider"
  | "combo"
  | "text"
  | "toggle"
  | "file";

export interface WidgetConfig {
  type: WidgetType;
  options?: any;
}

/**
 * Maps OpenAPI types and formats to appropriate LiteGraph widgets.
 */
export function getWidgetForParameter(schema: any): WidgetConfig {
  const type = schema.type;
  const format = schema.format;

  // Handle combined schemas first.
  if (schema.allOf || schema.oneOf) {
    const enumValues: Array<string | number | boolean> = [];

    // Handle allOf.
    if (schema.allOf) {
      schema.allOf.forEach((subSchema: any) => {
        if (subSchema.enum) {
          enumValues.push(...subSchema.enum);
        }
      });
    }

    // Handle oneOf.
    if (schema.oneOf) {
      schema.oneOf.forEach((subSchema: any) => {
        if (subSchema.enum) {
          enumValues.push(...subSchema.enum);
        }
      });
    }

    // If we found any enum values, return a combo widget.
    if (enumValues.length > 0) {
      return { type: "combo", options: { values: enumValues } };
    }
  }

  // Default to text widget with title if no type is specified.
  if (!type) {
    return {
      type: "text",
      options: schema.title ? { name: schema.title } : undefined,
    };
  }

  // Handle binary format with file upload widget.
  if (format === "binary") {
    return {
      type: "file",
      options: {
        accept: schema.contentMediaType || "*/*", // Use specified media type if available.
        callback: (file: File) => {
          return file; // Return the file object.
        },
      },
    };
  }

  // Handle string types.
  if (type === "string") {
    switch (format) {
      case "date":
        return { type: "text", options: { placeholder: "YYYY-MM-DD" } };
      case "date-time":
        return {
          type: "text",
          options: { placeholder: "YYYY-MM-DDTHH:mm:ssZ" },
        };
      case "email":
        return { type: "text", options: { placeholder: "email@example.com" } };
      case "password":
        return { type: "text", options: { password: true } };
      case "uri":
        return {
          type: "text",
          options: { placeholder: "https://example.com" },
        };
      case "enum":
      case null:
        if (schema.enum) {
          return { type: "combo", options: { values: schema.enum } };
        }
        return { type: "text" };
      default:
        if (schema.enum) {
          return { type: "combo", options: { values: schema.enum } };
        }
        return { type: "text" };
    }
  }

  // Handle number types.
  if (type === "number" || type === "integer") {
    const options: any = {
      min:
        schema.minimum !== undefined ? schema.minimum : Number.MIN_SAFE_INTEGER,
      max:
        schema.maximum !== undefined ? schema.maximum : Number.MAX_SAFE_INTEGER,
      step: type === "integer" ? 1 : schema.multipleOf || 0.1,
      precision: type === "integer" ? 0 : 3,
    };

    // Use slider if we have both min and max defined within a reasonable range.
    if (
      schema.minimum !== undefined &&
      schema.maximum !== undefined &&
      schema.maximum - schema.minimum <= 100
    ) {
      return { type: "slider", options };
    }

    return { type: "number", options };
  }

  // Handle boolean.
  if (type === "boolean") {
    return { type: "toggle" };
  }

  // Handle arrays.
  if (type === "array") {
    if (schema.items && schema.items.enum) {
      return {
        type: "combo",
        options: {
          values: schema.items.enum,
          multiple: true,
        },
      };
    }
    return { type: "text", options: { placeholder: "comma,separated,values" } };
  }

  // Handle objects.
  if (type === "object") {
    return { type: "text", options: { placeholder: '{"key": "value"}' } };
  }

  // Handle null type.
  if (type === "null") {
    return { type: "text", options: { disabled: true } };
  }

  // Default to text widget.
  return { type: "text" };
}
