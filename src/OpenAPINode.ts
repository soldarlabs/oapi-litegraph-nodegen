/**
 * @file Contains the class definition for the OpenAPI nodes.
 */
import { LGraphNode } from "litegraph.js";

/**
 * Class for OpenAPI nodes. It creates inputs/outputs and other node properties based
 * on the OpenAPI operation.
 */
export class OpenAPINode extends LGraphNode {
  /**
   * Creates an instance of OpenAPINode.
   * @param title - The title of the node.
   * @param operation - The OpenAPI operation object.
   */
  constructor(title: string, operation: any) {
    super(title);

    // Create inputs based on operation parameters.
    if (operation.parameters) {
      operation.parameters.forEach((param: any) => {
        const paramType = param.schema ? param.schema.type : "string";
        this.addInput(`${param.name} (${paramType})`, paramType);
      });
    }

    // Create inputs based on operation request body.
    if (operation.requestBody && operation.requestBody.content) {
      const content = operation.requestBody.content;
      for (const contentType in content) {
        const schema = content[contentType].schema;
        if (schema && schema.properties) {
          for (const propName in schema.properties) {
            const propType = schema.properties[propName].type || "string";
            this.addInput(`${propName} (${propType})`, propType);
          }
        }
      }
    }

    // Create output based on operation response.
    const responses = operation.responses;
    if (responses && responses['200'] && responses['200'].content) {
      const responseType = responses['200'].content['application/json'].schema.type;
      this.addOutput("Response", responseType);
    } else {
      this.addOutput("Response", "string");
    }
  }
}

/**
 * Creates a custom node class for a specific OpenAPI operation.
 * @param method - HTTP method of the operation.
 * @param path - Path of the operation.
 * @param operation - The OpenAPI operation object.
 * @returns A custom node class.
 */
export function createOpenAPINodeClass(method: string, path: string, operation: any) {
  const title = `${method.toUpperCase()} ${path}`;
  return class extends OpenAPINode {
    static title = title;
    constructor() {
      super(title, operation);
    }
  };
}
