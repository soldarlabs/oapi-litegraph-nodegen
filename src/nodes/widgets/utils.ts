/**
 * @file Contains widget mappings and utilities for OpenAPI node inputs.
 */

import type { widgetTypes } from "litegraph.js";
import { SchemaObject, ArraySubtype, NumberSubtype, IntegerSubtype } from "openapi-typescript";

// Add new widget types to the LiteGraph widgetTypes type.
type ExtendedWidgetTypes = widgetTypes | "file";

/**
 * Widget configuration object.
 */
export interface WidgetConfig {
  /** Widget type. */
  type: ExtendedWidgetTypes;
  /** Widget options. */
  options?: any;
}

/**
 * Type guard to check if an object is a SchemaObject.
 * @param obj Object to check.
 * @returns True if the object is a SchemaObject, false otherwise.
 */
function isSchemaObject(obj: any): obj is SchemaObject {
  return obj && typeof obj === "object" && !("$ref" in obj);
}

/**
 * Returns a widget configuration for array types.
 * @param schema Schema object.
 * @returns Widget configuration.
 */
function handleArrayType(schema: ArraySubtype): WidgetConfig {
  if (schema.items && isSchemaObject(schema.items) && schema.items.enum) {
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

/**
 * Returns a default text widget configuration.
 * @param schema Schema object.
 * @returns Widget configuration.
 */
function defaultTextWidget(schema: SchemaObject): WidgetConfig {
  return {
    type: "text",
    options: schema.title ? { name: schema.title } : undefined,
  };
}

/**
 * Returns a widget configuration for number types.
 * @param schema Schema object.
 * @returns Widget configuration.
 */
function handleNumberType(schema: NumberSubtype | IntegerSubtype): WidgetConfig {
  const options: any = {
    min:
      schema.minimum !== undefined ? schema.minimum : Number.MIN_SAFE_INTEGER,
    max:
      schema.maximum !== undefined ? schema.maximum : Number.MAX_SAFE_INTEGER,
    step: schema.type === "integer" ? 1 : "multipleOf" in schema ? schema.multipleOf : 0.1,
    precision: schema.type === "integer" ? 0 : 3,
  };

  if (
    schema.minimum !== undefined &&
    schema.maximum !== undefined &&
    schema.maximum - schema.minimum <= 100
  ) {
    return { type: "slider", options };
  }

  return { type: "number", options };
}

/**
 * Returns a widget configuration for string types.
 * @param schema Schema object.
 * @returns Widget configuration.
 */
function handleStringType(schema: SchemaObject): WidgetConfig {
  const format = schema.format;

  // Handle binary format with file upload widget.
  if (format === "binary") {
    return {
      type: "file",
      options: {
        accept: "contentMediaType" in schema ? schema.contentMediaType : "*/*",
        callback: (file: File) => file,
      },
    };
  }

  // Handle other string formats.
  switch (format) {
    case "date":
      return { type: "text", options: { placeholder: "YYYY-MM-DD" } };
    case "date-time":
      return { type: "text", options: { placeholder: "YYYY-MM-DDTHH:mm:ssZ" } };
    case "email":
      return { type: "text", options: { placeholder: "email@example.com" } };
    case "password":
      return { type: "text", options: { password: true } };
    case "uri":
      return { type: "text", options: { placeholder: "https://example.com" } };
    default:
      if (schema.enum) {
        return { type: "combo", options: { values: schema.enum } };
      }
      return { type: "text" };
  }
}

/**
 * Handles combined schemas (allOf, oneOf) by extracting enum values.
 * @param schema Combined schema.
 * @returns Widget configuration.
 */
function handleCombinedSchemas(schema: SchemaObject): WidgetConfig {
  const enumValues: Array<string | number | boolean> = [];

  if (schema.allOf) {
    schema.allOf.forEach((subSchema: any) => {
      if (subSchema.enum) {
        enumValues.push(...subSchema.enum);
      }
    });
  }

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

  return defaultTextWidget(schema);
}

/**
 * Maps OpenAPI types and formats to appropriate LiteGraph widget configurations.
 */
export function getWidgetConfigForParameter(
  schema: SchemaObject
): WidgetConfig {
  if (schema.allOf || schema.oneOf) {
    return handleCombinedSchemas(schema);
  }

  if (!schema.type) {
    return defaultTextWidget(schema);
  }

  // Handle other types.
  switch (schema.type) {
    case "string":
      return handleStringType(schema);
    case "number":
    case "integer":
      return handleNumberType(schema);
    case "boolean":
      return { type: "toggle" };
    case "array":
      return handleArrayType(schema);
    case "object":
      return { type: "text", options: { placeholder: '{"key": "value"}' } };
    case "null":
      return { type: "text", options: { disabled: true } };
    default:
      return defaultTextWidget(schema);
  }
}
