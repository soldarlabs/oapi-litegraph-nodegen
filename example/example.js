import { NodeGenerator, setLogLevel } from "../src";
import { LGraph, LiteGraph } from "litegraph.js";
import { CanvasWrapper } from "../src/utils/canvasWrapper.js";
import { patchContextMenu } from "../src/utils/contextMenu.js";

/**
 * Generate a graph using the NodeGenerator class and display it in the browser.
 */
async function generateGraph() {
  setLogLevel("debug");

  // Wait for DOM to be ready.
  if (document.readyState === "loading") {
    await new Promise((resolve) =>
      document.addEventListener("DOMContentLoaded", resolve)
    );
  }

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
  await generator.addSpec("exampleSpec", "./openapi.yaml");
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
  console.error("Error generating graph:", err);
});
