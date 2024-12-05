/**
 * @file Global type extensions for the library.
 */

// Extend the Window interface to include LGraph.
declare global {
  interface Window {
    LGraph: typeof LGraph;
  }
}

// Extend the LiteGraph interface to include pointerevents_method.
declare module "litegraph.js" {
  interface LiteGraph {
    pointerevents_method: string;
  }
}

export {};
