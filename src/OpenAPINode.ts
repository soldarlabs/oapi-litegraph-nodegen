/**
 * @file Contains the custom node class for the OpenAPI nodes.
 */
import { LGraphNode } from "litegraph.js";

/**
 * Custom node class for OpenAPI nodes. Sets up the node based on the OpenAPI operation.
 */
export class OpenAPINode extends LGraphNode {
  constructor(method: string, path: string, operation: any) {
    super();
    this.title = `${method.toUpperCase()} ${path}`;

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
