/**
 * @file Defines the main application component.
 */
import { useEffect, useRef } from "react";
import { LGraph, LiteGraph } from "litegraph.js";
import {
  NodeGenerator,
  setLogLevel,
  optimizeCanvas,
  CustomOutputNode,
} from "oapi-litegraph-nodegen";
import { FloatingToolbar } from "@/components/FloatingToolbar/FloatingToolbar";
import "litegraph.js/css/litegraph.css";
import "@/App.css";

// Expose LGraph globally for audio nodes.
if (typeof window !== "undefined") {
  window.LGraph = LGraph;
}

/**
 * Main application component.
 */
const App = () => {
  const hasGeneratedGraph = useRef(false);

  useEffect(() => {
    /**
     * Generate the LiteGraph graph.
     */
    const generateGraph = async () => {
      console.log("Call generateGraph");

      // Set oapi-litegraph-nodegen log level to debug.
      setLogLevel("debug");

      // Create a new LiteGraph graph.
      const graph = new LGraph();

      // Apply canvas optimizations (optional).
      optimizeCanvas("#graphcanvas", graph);

      // Initialize the node generator and add the example OpenAPI spec.
      const generator = new NodeGenerator();
      await generator.addSpec("example-demo", "./specs/example.openapi.yaml");

      // Register the custom output node.
      LiteGraph.registerNodeType("oapi/custom-output", CustomOutputNode);

      // Register nodes from the spec and start the graph.
      generator.registerNodes();
      graph.start();
    };

    // Prevent double trigger due to strict mode.
    if (!hasGeneratedGraph.current) {
      generateGraph().catch((err) => {
        console.error("Failed to generate graph:", err);
      });
      hasGeneratedGraph.current = true;
    }
  }, []);

  return (
    <>
      <FloatingToolbar />
      <div id="graph-container">
        <canvas id="graphcanvas"></canvas>
      </div>
    </>
  );
};

export default App;
