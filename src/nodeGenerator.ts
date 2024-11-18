import SwaggerParser from "@apidevtools/swagger-parser";
import { LGraph, LGraphNode, LiteGraph } from "litegraph.js";

/**
 * Class to generate LiteGraph nodes from OpenAPI specifications.
 */
export class NodeGenerator {
  private openApiSpecs: { [key: string]: any } = {};

  /**
   * Adds an OpenAPI specification from a file path or URL.
   * @param key - Identifier for the OpenAPI specification.
   * @param spec - File path or URL of the OpenAPI specification.
   * @returns A promise that resolves when the spec is added.
   * @throws If the specification is invalid.
   */
  public async addSpec(key: string, spec: string): Promise<void> {
    try {
      const parsedSpec = await SwaggerParser.validate(spec);
      this.openApiSpecs[key] = parsedSpec;
      console.log(`OpenAPI spec '${key}' is valid:`, parsedSpec);
    } catch (err) {
      console.error(`Invalid OpenAPI spec '${key}':`, err);
      throw err;
    }
  }

  /**
   * Removes the OpenAPI specification identified by the given key.
   * @param key - Identifier for the OpenAPI specification.
   * @returns True if the spec was removed, false if it did not exist.
   */
  public removeSpec(key: string): boolean {
    if (this.openApiSpecs[key]) {
      delete this.openApiSpecs[key];
      console.log(`OpenAPI spec '${key}' has been removed.`);
      return true;
    } else {
      console.warn(`OpenAPI spec '${key}' does not exist.`);
      return false;
    }
  }

  /**
   * Removes all OpenAPI specifications.
   */
  public removeAllSpecs(): void {
    this.openApiSpecs = {};
    console.log("All OpenAPI specs have been removed.");
  }

  /**
   * Generates LiteGraph nodes from all or a specific OpenAPI specification.
   * @param key - Optional key to generate nodes for a specific spec.
   * @param register - Optional flag to register nodes with LiteGraph.
   * @returns The generated LGraph object.
   * @throws If no specs are parsed or the specified key does not exist.
   */
  public generateNodes(key?: string, register: boolean = false): LGraph {
    if (Object.keys(this.openApiSpecs).length === 0) {
      throw new Error(
        "No OpenAPI specs have been parsed. Call addSpec() first."
      );
    }

    const graph = new LGraph();
    if (key) {
      if (!this.openApiSpecs[key]) {
        throw new Error(`OpenAPI spec with key '${key}' does not exist.`);
      }
      this.generateNodesForSpec(key, this.openApiSpecs[key], graph, register);
    } else {
      console.log("Generating LiteGraph nodes from all OpenAPI specs...");
      for (const key in this.openApiSpecs) {
        this.generateNodesForSpec(key, this.openApiSpecs[key], graph, register);
      }
    }

    return graph;
  }

  /**
   * Generates LiteGraph nodes for a specific OpenAPI specification.
   * @param key - Identifier for the OpenAPI specification.
   * @param spec - The OpenAPI specification.
   * @param graph - The LGraph object to add nodes to.
   * @param register - Flag to register nodes with LiteGraph.
   */
  private generateNodesForSpec(
    key: string,
    spec: any,
    graph: LGraph,
    register: boolean
  ): void {
    console.log(`Generating nodes for OpenAPI spec '${key}'...`);
    for (const path in spec.paths) {
      for (const method in spec.paths[path]) {
        const operation = spec.paths[path][method];
        const node = new LGraphNode();
        node.title = `${method.toUpperCase()} ${path}`;
        // TODO: Replace with method that creates the right inputs/outputs.
        node.addOutput("Response", "string");
        node.addInput("Request", "string");
        graph.add(node);
        console.log(
          `Created node for ${method.toUpperCase()} ${path}: ${
            operation.summary
          }`
        );

        if (register) {
          LiteGraph.registerNodeType(
            `openapi/${method.toUpperCase()}_${path}`,
            LGraphNode
          );
        }
      }
    }
  }
}
