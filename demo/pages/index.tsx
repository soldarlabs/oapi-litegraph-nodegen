import { useEffect } from "react";
import { LGraph, LGraphCanvas, LiteGraph } from "litegraph.js";
import {
  NodeGenerator,
  setLogLevel,
  optimizeCanvas,
  patchContextMenu,
} from "oapi-litegraph-nodegen";

export default function Home() {
  useEffect(() => {
    /**
     * Initializes the LiteGraph graph, registers nodes, and applies optimizations.
     */
    async function initializeGraph() {
      try {
        setLogLevel("debug");

        // Wait for DOM to be ready.
        if (document.readyState === "loading") {
          await new Promise((resolve) =>
            document.addEventListener("DOMContentLoaded", resolve)
          );
        }

        // Create the LiteGraph graph and apply optimizations.
        const graph = new LGraph();
        const graphCanvas = new LGraphCanvas("#mycanvas", graph);
        optimizeCanvas(graphCanvas, { pointerEvents: false });
        patchContextMenu();

        // Register LiteGraph nodes for the OpenAPI specification.
        const generator = new NodeGenerator();
        await generator.addSpec("exampleSpec", "/example.openapi.yaml");
        generator.registerNodes();

        graph.start();
      } catch (err) {
        console.error("Error initializing graph:", err);
      }
    }

    initializeGraph();
  }, []);

  return (
    <div id="graph-container">
      <canvas id="mycanvas" />
    </div>
  );
}
