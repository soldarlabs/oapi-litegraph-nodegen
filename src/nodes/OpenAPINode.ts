/**
 * @file Contains the class definition for the OpenAPI nodes.
 */
import {
  LGraphNode,
  IWidget,
  LiteGraph,
  LLink,
  INodeInputSlot,
  INodeOutputSlot,
} from "litegraph.js";
import { getWidgetConfigForParameter } from "./widgets/utils.js";
import {
  addAlignedWidget,
  customizeNodeAppearance,
  calculateNodeSize,
} from "./widgets/visual.js";
import { logger } from "../utils/logger.js";
import { ApiClient } from "../services/ApiClient.js";

/**
 * Interface defining the structure of input data.
 */
export interface InputData {
  /**
   * Value of the input data.
   */
  value: any;
  /**
   * Type of the input data.
   */
  type: string;
}

/**
 * Class for OpenAPI nodes. It creates inputs/outputs and other node properties based
 * on the OpenAPI operation.
 */
export class OpenAPINode extends LGraphNode {
  // TODO: Make properties private/protected if https://github.com/microsoft/TypeScript/issues/35822 is resolved.
  /**
   * Map of input widgets.
   */
  public inputWidgets: Map<string, IWidget> = new Map();
  /**
   * Map of input values.
   */
  public inputValues: Map<string, InputData> = new Map();
  /**
   * Index of the current input.
   */
  public inputIndex: number = 0;
  /**
   * Unique identifier for the node.
   */
  public nodeId: string;

  public apiClient: ApiClient;
  public method: string = "";
  public path: string = "";
  public operationId?: string;
  public requestContentType: string = "application/json";
  public responseContentType: string = "application/json";

  constructor(title: string, operation: any, serverUrl?: string) {
    super(title);
    this.nodeId = `${this.type || "node"}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Use the first server URL from the OpenAPI spec if no serverUrl provided
    const defaultServer = operation.servers?.[0]?.url || serverUrl || "";
    this.apiClient = new ApiClient(defaultServer);

    logger.info("Node created", {
      component: "OpenAPINode",
      nodeId: this.nodeId,
      type: this.type,
      serverUrl: defaultServer,
    });

    // Apply visual customizations.
    customizeNodeAppearance(this);

    // Create inputs based on operation parameters.
    if (operation.parameters) {
      operation.parameters.forEach((param: any) => {
        const schema = param.schema || { type: "string" };
        const paramType = schema.type;

        // Add input slot first.
        this.addInput(param.name, paramType);

        // Add widget based on parameter type and format.
        const widgetConfig = getWidgetConfigForParameter(schema);
        const widget = addAlignedWidget(
          this,
          this.inputIndex++,
          widgetConfig,
          param.name,
          param.default || "",
          (v: any) => {
            // When widget value changes, store it.
            // If it's a file widget, ensure we store it with the correct type
            const valueType = v instanceof File ? "file" : paramType;
            this.inputValues.set(param.name, { value: v, type: valueType });
          },
        );

        this.inputWidgets.set(param.name, widget);
        if (param.default !== undefined) {
          this.inputValues.set(param.name, {
            value: param.default,
            type: paramType,
          });
        }
      });
    }

    // Create inputs based on operation request body.
    if (operation.requestBody && operation.requestBody.content) {
      const content = operation.requestBody.content;
      for (const contentType in content) {
        const schema = content[contentType].schema;
        if (schema && schema.properties) {
          // Store content type for request
          this.requestContentType = contentType;

          for (const propName in schema.properties) {
            const propSchema = schema.properties[propName];
            const propType = propSchema.type || "string";

            // Add input slot first.
            this.addInput(propName, propType);

            // Add widget based on property type and format, passing the content type
            const widgetConfig = getWidgetConfigForParameter(
              propSchema,
              contentType,
            );
            const widget = addAlignedWidget(
              this,
              this.inputIndex++,
              widgetConfig,
              propName,
              propSchema.default || "",
              (v: any) => {
                // When widget value changes, store it.
                const valueType = v instanceof File ? "file" : propType;
                this.inputValues.set(propName, { value: v, type: valueType });
              },
            );

            this.inputWidgets.set(propName, widget);
            if (propSchema.default !== undefined) {
              this.inputValues.set(propName, {
                value: propSchema.default,
                type: propType,
              });
            }
          }
        }
      }
    }

    // Create output based on operation response.
    const responses = operation.responses;
    if (responses && responses["200"] && responses["200"].content) {
      const content = responses["200"].content;
      for (const contentType in content) {
        // Store content type for response
        this.responseContentType = contentType;
        const responseSchema = content[contentType].schema;
        // Add output with more specific type information
        if (responseSchema.type === "object" && responseSchema.properties) {
          // For objects, show property structure
          const properties = Object.keys(responseSchema.properties).join(", ");
          this.addOutput(`Response (object: {${properties}})`, "object");
        } else if (responseSchema.type === "array" && responseSchema.items) {
          // For arrays, show item type
          const itemType = responseSchema.items.type || "any";
          this.addOutput(
            `Response (${responseSchema.type}<${itemType}>)`,
            responseSchema.type,
          );
        } else {
          // For primitive types
          this.addOutput(
            `Response (${responseSchema.type})`,
            responseSchema.type,
          );
        }
      }
    }

    // Update node size based on content.
    this.size = calculateNodeSize(
      this.inputIndex,
      this.outputs ? this.outputs.length : 0,
    );
  }

  /**
   * Handles changes in connections.
   * @param type - Type of connection (input/output).
   * @param slotIndex - Index of the slot.
   * @param isConnected - Whether the connection is established.
   * @param link - Link object.
   * @param ioSlot - Input/output slot object.
   */
  onConnectionsChange(
    type: number,
    slotIndex: number,
    isConnected: boolean,
    link: LLink,
    ioSlot: INodeInputSlot | INodeOutputSlot,
  ): void {
    try {
      logger.debug("Connection changed", {
        component: "OpenAPINode",
        nodeId: this.nodeId,
        operation: "connectionChange",
        connectionType: type === LiteGraph.INPUT ? "input" : "output",
        slot: slotIndex,
        connected: isConnected,
        linkInfo: link,
        ioSlot: ioSlot,
      });

      if (typeof super.onConnectionsChange === "function") {
        super.onConnectionsChange(type, slotIndex, isConnected, link, ioSlot);
      }
    } catch (err) {
      const error = err as Error;
      logger.error(
        "Error handling connection change",
        {
          component: "OpenAPINode",
          nodeId: this.nodeId,
          operation: "connectionChange",
          connectionType: type === LiteGraph.INPUT ? "input" : "output",
          slot: slotIndex,
          error: error.message,
        },
        error,
      );
    }
  }

  /**
   * Handles changes in properties.
   * @param name - Name of the property.
   * @param value - New value of the property.
   * @param prev_value - Previous value of the property.
   */
  onPropertyChanged(name: string, value: any, prev_value: any): void {
    try {
      logger.debug("Property changed", {
        component: "OpenAPINode",
        nodeId: this.nodeId,
        operation: "propertyChange",
        property: name,
        newValue: value,
        previousValue: prev_value,
      });

      if (typeof super.onPropertyChanged === "function") {
        super.onPropertyChanged(name, value, prev_value);
      }
    } catch (err) {
      const error = err as Error;
      logger.error(
        "Error changing property",
        {
          component: "OpenAPINode",
          nodeId: this.nodeId,
          operation: "propertyChange",
          property: name,
          error: error.message,
        },
        error,
      );
    }
  }

  /**
   * Handles changes in widgets.
   * @param widget - Widget object.
   * @param name - Name of the widget.
   * @param options - Options for the widget.
   */
  onWidgetChanged(widget: IWidget, name: string, options: any): void {
    try {
      const value = widget.value;
      const valueType = value instanceof File ? "file" : widget.type || "string";
      
      logger.debug("Widget value changed", {
        component: "OpenAPINode",
        nodeId: this.nodeId,
        operation: "widgetChange",
        widget: name,
        newValue: value,
        valueType,
        isFile: value instanceof File,
        options: options,
      });

      // Store the widget value with correct type
      if (value !== undefined && value !== null) {
        this.inputValues.set(name, {
          value: value,
          type: valueType
        });

        logger.debug("Input values after widget change:", {
          component: "OpenAPINode",
          nodeId: this.nodeId,
          operation: "widgetChange",
          inputValues: Array.from(this.inputValues.entries()).map(([key, data]) => ({
            key,
            type: data.type,
            isFile: data.value instanceof File,
            valueType: typeof data.value,
            constructor: data.value?.constructor?.name
          }))
        });
      }

      this.setDirtyCanvas(true);
    } catch (err) {
      const error = err as Error;
      logger.error(
        "Error handling widget change",
        {
          component: "OpenAPINode",
          nodeId: this.nodeId,
          operation: "widgetChange",
          widget: name,
          error: error.message,
        },
        error,
      );
    }
  }

  /**
   * Sets the dirty canvas flag.
   * @param value - Whether the canvas is dirty.
   * @param skipOutputs - Whether to skip outputs.
   */
  setDirtyCanvas(value: boolean, skipOutputs: boolean = false): void {
    if (typeof super.setDirtyCanvas === "function") {
      super.setDirtyCanvas(value, skipOutputs);
    }
  }
}
