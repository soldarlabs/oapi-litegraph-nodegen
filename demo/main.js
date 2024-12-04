/**
 * Main entry point for the demo.
 */
import "./style.css";
import { LGraph, LiteGraph, LGraphCanvas } from "litegraph.js";
import { NodeGenerator, setLogLevel } from "../dist/index.js";
import {
  optimizeCanvas,
  optimizeCanvasForHighDPI,
} from "../dist/utils/optim/canvas.js";

// Expose LGraph globally for audio nodes.
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

  const generator = new NodeGenerator();
  // Point to the correct OpenAPI file in the demo directory
  await generator.addSpec("example-demo", "./example.openapi.yaml");
  generator.registerNodes();

  const canvas = document.querySelector("#mycanvas");
  if (!canvas) {
    console.error("Canvas element not found!");
    return;
  }

  const graph = new LGraph();

  // Optimize the canvas directly instead of using CanvasWrapper.
  const graphCanvas = new LGraphCanvas(canvas, graph);
  optimizeCanvas(graphCanvas, {
    passive: true,
    preventDefaultOnWheel: false,
  });
  optimizeCanvasForHighDPI(graphCanvas);

  graph.start();
}

generateGraph().catch((err) => {
  console.error("Failed to generate graph:", err);
});
