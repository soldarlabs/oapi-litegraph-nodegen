import { useEffect } from "react";
import { LGraph, LiteGraph, LGraphCanvas } from "litegraph.js";
import {
  NodeGenerator,
  setLogLevel,
  CanvasWrapper,
  patchContextMenu,
} from "oapi-litegraph-nodegen";

export default function Home() {
  useEffect(() => {
    /**
     * Generate the LiveGraph graph.
     */
    async function generateGraph() {
      try {
        setLogLevel("debug");

        // Wait for DOM to be ready.
        if (document.readyState === "loading") {
          await new Promise((resolve) =>
            document.addEventListener("DOMContentLoaded", resolve)
          );
        }

        // Configure LiteGraph to use passive event listeners and pointer events.
        // LiteGraph.pointerevents_method = "pointer"; // Use pointer events instead of mouse events.
        // // Prevent zoom on wheel by default, but make it passive.
        // Object.assign(LiteGraph, {
        //   prevent_zoom_default: false,
        //   ctrl_shift_zoom_default: true,
        // });

        // Patch the context menu to use passive event listeners.
        // patchContextMenu();

        const generator = new NodeGenerator();
        await generator.addSpec("exampleSpec", "/example.openapi.yaml");
        generator.registerNodes();

        const graph = new LGraph();

        // Use our optimized canvas wrapper.
        new CanvasWrapper("#mycanvas", graph, {
          passive: true,
          preventDefaultOnWheel: false,
        });

        graph.start();
      } catch (err) {
        console.error("Error generating graph:", err);
      }
    }

    generateGraph();
  }, []);

  return (
    <div id="graph-container">
      <canvas id="mycanvas"/>
    </div>
  );
}
