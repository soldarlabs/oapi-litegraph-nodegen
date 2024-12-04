/**
 * @file Main entry point for the demo.
 */
import { LGraph, LGraphCanvas } from "litegraph.js";

import { NodeGenerator, setLogLevel } from "../../dist/index.js";
import {
  optimizeCanvas,
} from "../../dist/utils/optim/canvas.js";

import "./style.css";

// Expose LGraph globally for audio nodes.
if (typeof window !== "undefined") {
  window.LGraph = LGraph;
}

/**
 * Generate graph using the NodeGenerator class and display in the browser.
 */
async function generateGraph() {
  setLogLevel("debug");

  // Create a new graph.
  const graph = new LGraph();
  const canvas = new LGraphCanvas("#graphcanvas", graph);

  // Apply canvas optimizations (optional).
  optimizeCanvas(canvas, {
    pointerEvents: true,  // Enable pointer events for better performance.
  });

  // Initialize the node generator
  const generator = new NodeGenerator();
  // Point to the correct OpenAPI file in the demo directory.
  await generator.addSpec("example-demo", "./example.openapi.yaml");

  // Register nodes from the spec.
  generator.registerNodes();

  graph.start();
}

generateGraph().catch((err) => {
  console.error("Failed to generate graph:", err);
});
