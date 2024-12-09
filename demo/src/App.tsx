/**
 * @file Defines the main application component.
 */
import { useEffect } from "react";
import { FloatingToolbar } from "@/components/FloatingToolbar/FloatingToolbar";
import { useLiteGraph } from "@/hooks/use-litegraph";
import "litegraph.js/css/litegraph.css";
import "@/App.css";

/**
 * Main application component.
 */
const App = () => {
  const { generator, isReady } = useLiteGraph();

  useEffect(() => {
    /**
     * Initialize the generator with the example spec.
     */
    const initializeGenerator = async () => {
      if (!isReady || !generator) return;

      // Add example spec to the generator.
      await generator.addSpec("example-demo", "./specs/example.openapi.yaml");

      // Register OpenAPI nodes.
      generator.registerNodes();
    };

    initializeGenerator().catch((err) => {
      console.error("Failed to initialize generator:", err);
    });
  }, [generator, isReady]);

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
