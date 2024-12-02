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
import { getWidgetForParameter, WidgetType } from "./widgets.js";
import {
  addAlignedWidget,
  customizeNodeAppearance,
  calculateNodeSize,
} from "./visualWidgets.js";
import { logger } from "./utils/logger.js";

/**
 * Interface defining the structure of input data.
 */
interface InputData {
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

  /**
   * Creates an instance of OpenAPINode.
   * @param title - The title of the node.
   * @param operation - The OpenAPI operation object.
   */
  constructor(title: string, operation: any) {
    super(title);
    this.nodeId = `${this.type || "node"}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    logger.info("Node created", {
      component: "OpenAPINode",
      nodeId: this.nodeId,
      type: this.type,
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
        const widgetConfig = getWidgetForParameter(schema);
        const widget = addAlignedWidget(
          this,
          this.inputIndex++,
          widgetConfig,
          param.name,
          param.default || "",
          (v: any) => {
            // When widget value changes, store it.
            this.inputValues.set(param.name, { value: v, type: paramType });
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
          for (const propName in schema.properties) {
            const propSchema = schema.properties[propName];
            const propType = propSchema.type || "string";

            // Add input slot first.
            this.addInput(propName, propType);

            // Add widget based on property type and format.
            const widgetConfig = getWidgetForParameter(propSchema);
            const widget = addAlignedWidget(
              this,
              this.inputIndex++,
              widgetConfig,
              propName,
              propSchema.default || "",
              (v: any) => {
                // When widget value changes, store it.
                this.inputValues.set(propName, { value: v, type: propType });
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
      const responseSchema =
        responses["200"].content["application/json"].schema;
      const responseType = responseSchema.type;
      this.addOutput(`Response (${responseType})`, responseType);
    } else {
      this.addOutput("Response (string)", "string");
    }

    // Update node size based on content.
    this.size = calculateNodeSize(
      this.inputIndex,
      this.outputs ? this.outputs.length : 0,
    );
  }

  /**
   * Override onExecute to ensure widget values are used when no input connections exist.
   */
  onExecute() {
    try {
      logger.debug("Node executing", {
        component: "OpenAPINode",
        nodeId: this.nodeId,
        operation: "execute",
        inputCount: this.inputs?.length || 0,
      });

      const inputData: { [key: string]: any } = {};

      // Collect input data.
      if (this.inputs) {
        for (let i = 0; i < this.inputs.length; i++) {
          const value = this.getInputData(i);
          const inputName = this.inputs[i]?.name;
          if (value !== undefined && inputName) {
            inputData[inputName] = value;
            logger.debug("Input data collected", {
              component: "OpenAPINode",
              nodeId: this.nodeId,
              operation: "execute",
              input: inputName,
              value: value,
            });
          }
        }
      }

      // Process widget values.
      this.inputWidgets.forEach((widget, name) => {
        if (widget.value !== undefined && widget.value !== null) {
          inputData[name] = widget.value;
          logger.debug("Widget value processed", {
            component: "OpenAPINode",
            nodeId: this.nodeId,
            operation: "execute",
            widget: name,
            value: widget.value,
          });
        }
      });

      // Set output data.
      this.setOutputData(0, inputData);
      logger.debug("Node execution completed", {
        component: "OpenAPINode",
        nodeId: this.nodeId,
        operation: "execute",
        outputData: inputData,
      });
    } catch (err) {
      const error = err as Error;
      logger.error(
        "Error executing node",
        {
          component: "OpenAPINode",
          nodeId: this.nodeId,
          operation: "execute",
          error: error.message,
        },
        error,
      );
      this.setOutputData(0, { error: error.message });
    }
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
      logger.debug("Widget value changed", {
        component: "OpenAPINode",
        nodeId: this.nodeId,
        operation: "widgetChange",
        widget: name,
        newValue: value,
        options: options,
      });

      // Store the widget value.
      if (value !== undefined && value !== null) {
        this.inputValues.set(name, {
          value: value,
          type: widget.type || "string",
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

/**
 * Creates a custom node class for a specific OpenAPI operation.
 * @param method - HTTP method of the operation.
 * @param path - Path of the operation.
 * @param operation - The OpenAPI operation object.
 * @returns A custom node class.
 */
export function createOpenAPINodeClass(
  method: string,
  path: string,
  operation: any,
) {
  const title = `${method.toUpperCase()} ${path}`;
  return class extends OpenAPINode {
    static title = title;
    constructor() {
      super(title, operation);
    }
  };
}
