import "./style.css";
import { LGraph, LiteGraph } from "litegraph.js";
import { NodeGenerator, setLogLevel } from "../dist/index.js";
import { CanvasWrapper } from "../dist/utils/canvasWrapper.js";
import { patchContextMenu } from "../dist/utils/contextMenu.js";

// Expose LGraph globally for audio nodes
if (typeof window !== "undefined") {
  window.LGraph = LGraph;
}

/**
 * Generate a graph using the NodeGenerator class and display it in the browser.
 */
async function generateGraph() {
  setLogLevel("debug");

  // Configure LiteGraph to use passive event listeners and pointer events.
  LiteGraph.pointerevents_method = "pointer"; // Use pointer events instead of mouse events.
  // Prevent zoom on wheel by default, but make it passive.
  Object.assign(LiteGraph, {
    prevent_zoom_default: false,
    ctrl_shift_zoom_default: true,
  });

  // Patch the context menu to use passive event listeners.
  patchContextMenu();

  const generator = new NodeGenerator();
  // Point to the correct OpenAPI file in the demo directory
  await generator.addSpec("example-demo", "./openapi.yaml");
  generator.registerNodes();

  const canvas = document.querySelector("#mycanvas");
  if (!canvas) {
    console.error("Canvas element not found!");
    return;
  }

  const graph = new LGraph();

  // Use our optimized canvas wrapper.
  new CanvasWrapper(canvas, graph, {
    passive: true,
    preventDefaultOnWheel: false,
  });

  graph.start();
}

generateGraph().catch((err) => {
  console.error("Failed to generate graph:", err);
});
