/**
 * @file Contains visual customization for node widgets.
 */
import { LGraphNode, IWidget, Vector2 } from "litegraph.js";
import { WidgetConfig } from "./utils.js";

// Constants for node appearance.
const NODE_CONSTANTS = {
  INPUT_HEIGHT: 30, // Height for inputs and widgets
  HEADER_HEIGHT: 30, // Header height
  FOOTER_HEIGHT: 30, // Footer height
  WIDGET_HEIGHT: 30, // Widget height
  MARGIN_X: 10, // Left margin
  MIN_WIDTH: 250, // Minimum node width
  MIN_HEIGHT: 120, // Minimum node height
  OUTPUT_MARGIN: 15, // Output margin
  RIGHT_MARGIN: 10, // Right margin
};

/**
 * Positions for aligning widgets with node inputs.
 */
interface WidgetPosition {
  x: number;
  y: number;
  width: number;
}

/**
 * Calculate the position for a widget to align with an input.
 */
export function calculateWidgetPosition(
  node: LGraphNode,
  inputIndex: number,
): WidgetPosition {
  return {
    x: NODE_CONSTANTS.MARGIN_X,
    y:
      NODE_CONSTANTS.HEADER_HEIGHT +
      5 +
      inputIndex * NODE_CONSTANTS.INPUT_HEIGHT,
    width: node.size[0],
  };
}

/**
 * Add a widget to the node and position it to align with an input.
 */
export function addAlignedWidget(
  node: LGraphNode,
  inputIndex: number,
  config: WidgetConfig,
  paramName: string,
  defaultValue: any,
  callback: (v: any) => void,
): IWidget {
  const position = calculateWidgetPosition(node, inputIndex);
  let widget: IWidget;

  if (config.type === "file") {
    // Create a file input widget.
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = config.options?.accept || "*/*";
    fileInput.style.position = "absolute";
    fileInput.style.left = `${position.x}px`;
    fileInput.style.top = `${position.y}px`;
    fileInput.style.width = `${position.width}px`;
    fileInput.style.height = `${NODE_CONSTANTS.WIDGET_HEIGHT}px`;
    fileInput.style.opacity = "0"; // Hide the native input.

    // Create a visual button.
    widget = node.addWidget(
      "text",
      paramName,
      "Click to upload file",
      () => fileInput.click(),
      {
        ...config.options,
        x: position.x,
        y: position.y,
        width: position.width,
      },
    );

    // Handle file selection.
    fileInput.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];
        widget.value = file.name;
        if (config.options?.callback) {
          callback(config.options.callback(file));
        } else {
          callback(file);
        }
      }
    };

    document.body.appendChild(fileInput);
    node.onRemoved = () => {
      document.body.removeChild(fileInput);
    };
  } else {
    // Handle other widget types.
    widget = node.addWidget(
      config.type,
      paramName,
      defaultValue,
      (value) => {
        const processedValue =
          config.type === "number"
            ? typeof value === "string"
              ? Number(value)
              : value
            : value;
        callback(processedValue);
      },
      {
        ...config.options,
        x: position.x,
        y: position.y,
        width: position.width,
      },
    );
  }

  return widget;
}

/**
 * Calculate node size based on number of inputs and outputs.
 */
export function calculateNodeSize(
  inputCount: number,
  outputCount: number,
): [number, number] {
  const width = NODE_CONSTANTS.MIN_WIDTH;
  const height = Math.max(
    NODE_CONSTANTS.MIN_HEIGHT,
    NODE_CONSTANTS.HEADER_HEIGHT +
      inputCount * NODE_CONSTANTS.INPUT_HEIGHT +
      NODE_CONSTANTS.FOOTER_HEIGHT,
  );
  return [width, height];
}

/**
 * Style customization for the node.
 */
export function customizeNodeAppearance(node: LGraphNode) {
  // Override computeSize to ensure correct height.
  node.computeSize = function () {
    const inputCount = this.inputs ? this.inputs.length : 0;
    const outputCount = this.outputs ? this.outputs.length : 0;
    return calculateNodeSize(inputCount, outputCount);
  };

  // Override getConnectionPos for better alignment.
  node.getConnectionPos = function (
    is_input: boolean,
    slot: number | string,
    out?: Vector2,
  ): Vector2 {
    out = out || ([0, 0] as Vector2);

    if (is_input) {
      // Position inputs to align perfectly with widgets.
      const x = this.pos[0] + 6; // 6 pixels from the left edge
      const y =
        this.pos[1] +
        NODE_CONSTANTS.HEADER_HEIGHT +
        Number(slot) * NODE_CONSTANTS.INPUT_HEIGHT +
        NODE_CONSTANTS.INPUT_HEIGHT / 2;
      out[0] = x;
      out[1] = y;
      return out;
    }

    // Position outputs at the bottom right with different vertical positions.
    const x = this.pos[0] + this.size[0] - 10; // 10px from right edge
    const slotNum = Number(slot);

    // Adjust y position based on slot number.
    // Main output at bottom, trigger output slightly above.
    const y = this.pos[1] + this.size[1] - (25 + slotNum * 20);

    out[0] = x;
    out[1] = y;
    return out;
  };
}
