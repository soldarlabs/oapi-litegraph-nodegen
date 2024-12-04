/**
 * @file Global type extensions for the demo.
 */

// Extend the Window interface to include LGraph.
declare global {
  interface Window {
    LGraph: typeof LGraph;
  }
}

export {};
