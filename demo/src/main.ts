/**
 * @file Main entry point for the demo.
 */
import { LGraph, LiteGraph } from "litegraph.js";

import {
  NodeGenerator,
  setLogLevel,
  optimizeCanvas,
  CustomOutputNode,
} from "oapi-litegraph-nodegen";

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

  // Register custom output node.
  LiteGraph.registerNodeType("oapi/output", CustomOutputNode);

  // Create a new graph.
  const graph = new LGraph();

  // Apply canvas optimizations (optional).
  optimizeCanvas("#graphcanvas", graph);

  // Initialize the node generator.
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
