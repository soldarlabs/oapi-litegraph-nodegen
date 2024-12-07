/**
 * @file Global type extensions for the library.
 */
import { clamp, hex2num, num2hex, colorToString } from "../utils/color";

// Extend the Window interface to include LGraph.
declare global {
  interface Window {
    LGraph: typeof LGraph;

    // Add global utility functions on the window object.
    clamp: typeof clamp;
    hex2num: typeof hex2num;
    num2hex: typeof num2hex;
    colorToString: typeof colorToString;
  }
}

// Extend the LiteGraph interface to include pointerevents_method.
declare module "litegraph.js" {
  interface LiteGraph {
    pointerevents_method: string;
  }
}

export {};
