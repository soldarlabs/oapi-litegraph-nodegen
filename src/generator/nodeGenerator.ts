/**
 * @file Contains the main class for generating LiteGraph nodes from OpenAPI specifications.
 */
import SwaggerParser from "@apidevtools/swagger-parser";
import { LiteGraph } from "litegraph.js";
import { createOpenAPINodeClass, HttpMethod } from "../nodes/OpenAPINodeFactory.js";
import logger from "../utils/logger.js";

/**
 * NodeGenerator is responsible for creating LiteGraph nodes from OpenAPI specifications.
 * It provides functionality to load OpenAPI specs, generate corresponding nodes,
 * and register them with the LiteGraph system.
 *
 * @example
 * ```typescript
 * const generator = new NodeGenerator();
 * await generator.addSpec("petstore", "./petstore.yaml");
 * generator.registerNodes();
 * ```
 *
 * @remarks
 * The generator supports both local file paths and URLs for OpenAPI specifications.
 * Each spec is validated before being added to ensure compatibility.
 */
export class NodeGenerator {
  /**
   * Storage for loaded OpenAPI specifications.
   * Key is the identifier provided when adding the spec.
   * Value is the parsed OpenAPI specification object.
   */
  private openApiSpecs: { [key: string]: any } = {};

  /**
   * Adds an OpenAPI specification to the generator.
   * The specification can be loaded from either a local file path or a URL.
   *
   * @param key - Unique identifier for the specification.
   * @param spec - File path or URL to the OpenAPI specification.
   * @returns Promise that resolves when the spec is successfully loaded and validated.
   *
   * @throws {SwaggerParserError} If the specification is invalid or cannot be parsed.
   * @throws {NetworkError} If the specification URL cannot be accessed.
   * @throws {FileSystemError} If the specification file cannot be read.
   *
   * @example
   * ```typescript
   * // Load OpenAPI spec from file.
   * await generator.addSpec("petstore", "./petstore.yaml");
   *
   * // Load OpenAPI spec from URL.
   * await generator.addSpec("github", "https://api.github.com/openapi.yaml");
   * ```
   */
  public async addSpec(key: string, spec: string): Promise<void> {
    try {
      const parsedSpec = await SwaggerParser.validate(spec);
      this.openApiSpecs[key] = parsedSpec;
      logger.debug(`OpenAPI spec '${key}' is valid:`, { spec: parsedSpec });
    } catch (err) {
      logger.error(`Invalid OpenAPI spec '${key}':`, { error: err });
      throw err;
    }
  }

  /**
   * Removes an OpenAPI specification from the generator.
   * Note that this does not unregister any nodes that were already created from this spec.
   *
   * @param key - Identifier of the specification to remove.
   * @returns True if the specification was removed, false if it didn't exist.
   *
   * @example
   * ```typescript
   * generator.removeSpec("petstore");
   * ```
   */
  public removeSpec(key: string): boolean {
    if (this.openApiSpecs[key]) {
      delete this.openApiSpecs[key];
      logger.debug(`OpenAPI spec '${key}' has been removed.`, {
        operation: "removeSpec",
        key,
      });
      return true;
    } else {
      logger.warn(`OpenAPI spec '${key}' does not exist.`, {
        operation: "removeSpec",
        key,
      });
      return false;
    }
  }

  /**
   * Removes all OpenAPI specifications from the generator.
   * This does not unregister any nodes that were already created from these specs.
   *
   * @example
   * ```typescript
   * generator.clearSpecs();
   * ```
   */
  public clearSpecs(): void {
    this.openApiSpecs = {};
    logger.debug("All OpenAPI specs have been removed.", {
      operation: "clearSpecs",
    });
  }

  /**
   * Registers LiteGraph nodes for all loaded OpenAPI specifications.
   * This creates node classes for each operation in the specifications
   * and registers them with the LiteGraph system.
   *
   * @example
   * ```typescript
   * generator.registerNodes();
   * ```
   *
   * @see {@link registerNodesForSpec} to register nodes for a specific spec.
   */
  public registerNodes(key?: string): void {
    if (Object.keys(this.openApiSpecs).length === 0) {
      throw new Error(
        "No OpenAPI specs have been parsed. Call addSpec() first.",
      );
    }

    if (key) {
      if (!this.openApiSpecs[key]) {
        throw new Error(`OpenAPI spec with key '${key}' does not exist.`);
      }
      this.registerNodesForSpec(key, this.openApiSpecs[key]);
    } else {
      logger.debug("Registering LiteGraph nodes from all OpenAPI specs...");
      for (const key in this.openApiSpecs) {
        this.registerNodesForSpec(key, this.openApiSpecs[key]);
      }
    }
  }

  /**
   * Registers LiteGraph nodes for a specific OpenAPI specification.
   *
   * @param key - Identifier of the specification to register nodes for.
   * @param spec - The OpenAPI specification.
   *
   * @throws {Error} If the specification identifier is not found.
   *
   * @example
   * ```typescript
   * generator.registerNodesForSpec("petstore");
   * ```
   */
  private registerNodesForSpec(key: string, spec: any): void {
    logger.debug(`Registering nodes for OpenAPI spec '${key}'...`);

    // Extract server URLs from the spec
    const servers = spec.servers || [];
    const serverUrl = servers.length > 0 ? servers[0].url : "";

    for (const path in spec.paths) {
      for (const method in spec.paths[path]) {
        const operation = spec.paths[path][method];
        const normalizedPath = path.startsWith("/") ? path : `/${path}`;

        // Get operation-specific server if defined, otherwise use global server
        const operationServers = operation.servers || [];
        const operationServerUrl =
          operationServers.length > 0 ? operationServers[0].url : serverUrl;

        const nodeType = `oapi/${key}/${method.toLowerCase()}${normalizedPath}`;
        const NodeClass = createOpenAPINodeClass({
          method: method.toLowerCase() as HttpMethod,
          path: normalizedPath,
          operation,
          serverUrl: operationServerUrl,
        });

        LiteGraph.registerNodeType(nodeType, NodeClass);
        logger.debug(
          `Registered node for ${method.toUpperCase()} ${normalizedPath}: ${operation.summary}`,
          {
            serverUrl: operationServerUrl,
            operation: operation.operationId || `${method} ${normalizedPath}`,
          },
        );
      }
    }
  }

  /**
   * Unregisters LiteGraph nodes for a specific OpenAPI specification or all specifications.
   *
   * @param key - Optional key to unregister nodes for a specific spec.
   *
   * @throws {Error} If the specified key does not exist.
   *
   * @example
   * ```typescript
   * generator.unregisterNodes("petstore");
   * ```
   */
  public unregisterNodes(key?: string): void {
    if (key) {
      if (!this.openApiSpecs[key]) {
        throw new Error(`OpenAPI spec with key '${key}' does not exist.`);
      }
      this.unregisterNodesForSpec(key, this.openApiSpecs[key]);
    } else {
      logger.debug("Unregistering LiteGraph nodes from all OpenAPI specs...");
      for (const key in this.openApiSpecs) {
        this.unregisterNodesForSpec(key, this.openApiSpecs[key]);
      }
    }
  }

  /**
   * Unregisters LiteGraph nodes for a specific OpenAPI specification.
   *
   * @param key - Identifier of the specification to unregister nodes for.
   * @param spec - The OpenAPI specification.
   */
  private unregisterNodesForSpec(key: string, spec: any): void {
    logger.debug(`Unregistering nodes for OpenAPI spec '${key}'...`);
    for (const path in spec.paths) {
      for (const method in spec.paths[path]) {
        const normalizedPath = path.startsWith("/") ? path : `/${path}`;
        const nodeType = `oapi/${key}/${method.toLowerCase()}${normalizedPath}`;
        LiteGraph.unregisterNodeType(nodeType);
        logger.debug(`Unregistered node type: ${nodeType}`);
      }
    }
  }
}
