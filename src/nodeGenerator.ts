import SwaggerParser from "@apidevtools/swagger-parser";
import { LiteGraph } from "litegraph.js";
import log from "./logger.js";
import { createOpenAPINodeClass } from "./OpenAPINode.js";

/**
 * Class to generate LiteGraph nodes from OpenAPI specifications.
 */
export class NodeGenerator {
  private openApiSpecs: { [key: string]: any } = {};

  /**
   * Checks if a string is a valid URL.
   * @param str - The string to check.
   * @returns True if the string is a valid URL, false otherwise.
   */
  private isValidUrl(str: string): boolean {
    try {
      new URL(str);
      return true;
    } catch (_) {
      return false;
    }
  }

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
      log.debug(`OpenAPI spec '${key}' is valid:`, parsedSpec);
    } catch (err) {
      log.error(`Invalid OpenAPI spec '${key}':`, err);
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
   * Registers LiteGraph nodes from all or a specific OpenAPI specification.
   * @param key - Optional key to register nodes for a specific spec.
   * @throws If no specs are parsed or the specified key does not exist.
   */
  public registerNodes(key?: string): void {
    if (Object.keys(this.openApiSpecs).length === 0) {
      throw new Error(
        "No OpenAPI specs have been parsed. Call addSpec() first."
      );
    }

    if (key) {
      if (!this.openApiSpecs[key]) {
        throw new Error(`OpenAPI spec with key '${key}' does not exist.`);
      }
      this.registerNodesForSpec(key, this.openApiSpecs[key]);
    } else {
      log.debug("Registering LiteGraph nodes from all OpenAPI specs...");
      for (const key in this.openApiSpecs) {
        this.registerNodesForSpec(key, this.openApiSpecs[key]);
      }
    }
  }

  /**
   * Unregisters LiteGraph nodes for a specific OpenAPI specification or all specifications.
   * @param key - Optional key to unregister nodes for a specific spec.
   * @throws If the specified key does not exist.
   */
  public unregisterNodes(key?: string): void {
    if (key) {
      if (!this.openApiSpecs[key]) {
        throw new Error(`OpenAPI spec with key '${key}' does not exist.`);
      }
      this.unregisterNodesForSpec(key, this.openApiSpecs[key]);
    } else {
      log.debug("Unregistering LiteGraph nodes from all OpenAPI specs...");
      for (const key in this.openApiSpecs) {
        this.unregisterNodesForSpec(key, this.openApiSpecs[key]);
      }
    }
  }

  /**
   * Registers LiteGraph nodes for a specific OpenAPI specification.
   * @param key - Identifier for the OpenAPI specification.
   * @param spec - The OpenAPI specification.
   */
  private registerNodesForSpec(key: string, spec: any): void {
    log.debug(`Registering nodes for OpenAPI spec '${key}'...`);
    for (const path in spec.paths) {
      for (const method in spec.paths[path]) {
        const operation = spec.paths[path][method];
        const normalizedPath = path.startsWith('/') ? path : `/${path}`;

        const nodeType = `oapi/${key}/${method.toLowerCase()}${normalizedPath}`;
        const NodeClass = createOpenAPINodeClass(method, normalizedPath, operation);
        LiteGraph.registerNodeType(nodeType, NodeClass);
        log.debug(
          `Registered node for ${method.toUpperCase()} ${normalizedPath}: ${operation.summary}`
        );
      }
    }
  }

  /**
   * Unregisters LiteGraph nodes for a specific OpenAPI specification.
   * @param key - Identifier for the OpenAPI specification.
   * @param spec - The OpenAPI specification.
   */
  private unregisterNodesForSpec(key: string, spec: any): void {
    log.debug(`Unregistering nodes for OpenAPI spec '${key}'...`);
    for (const path in spec.paths) {
      for (const method in spec.paths[path]) {
        const normalizedPath = path.startsWith('/') ? path : `/${path}`;
        const nodeType = `oapi/${key}/${method.toLowerCase()}${normalizedPath}`;
        LiteGraph.unregisterNodeType(nodeType);
        log.debug(`Unregistered node type: ${nodeType}`);
      }
    }
  }
}
