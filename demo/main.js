import "./style.css";
import { LGraph, LiteGraph, LGraphCanvas } from "litegraph.js";
import { NodeGenerator, setLogLevel, CustomOutputNode } from "../dist/index.js";
import {
  optimizeCanvas,
  optimizeCanvasForHighDPI,
} from "../dist/utils/optim/canvas.js";

// Expose LGraph globally for audio nodes
if (typeof window !== "undefined") {
  window.LGraph = LGraph;
}

// Register the OAPIOutputNode
LiteGraph.registerNodeType("oapi/output", CustomOutputNode);

// Define API specifications
const API_SPECS = {
  petstore: {
    name: "Petstore API",
    url: "https://petstore3.swagger.io/api/v3/openapi.json",
  },
  github: {
    name: "demo api spec",
    url: "./openapi.yaml",
  },
  weather: {
    name: "openai api",
    url: "./openweather-api.yaml",
  },
};

/**
 * Generate a graph using the NodeGenerator class and display it in the browser.
 */
async function generateGraph() {
  setLogLevel("debug");

  // Configure LiteGraph to use passive event listeners and pointer events
  LiteGraph.pointerevents_method = "pointer";
  Object.assign(LiteGraph, {
    prevent_zoom_default: false,
    ctrl_shift_zoom_default: true,
  });

  const generator = new NodeGenerator();

  // Load all API specifications
  try {
    for (const [key, spec] of Object.entries(API_SPECS)) {
      console.log(`Loading ${spec.name}...`);
      await generator.addSpec(key, spec.url);
      console.log(`Loaded ${spec.name}`);
    }
  } catch (error) {
    console.error("Failed to load API specifications:", error);
    return;
  }

  // Register all nodes from all loaded specs
  generator.registerNodes();
  console.log("Registered all nodes");

  // Set up the canvas
  const canvas = document.querySelector("#mycanvas");
  if (!canvas) {
    console.error("Canvas element not found!");
    return;
  }

  const graph = new LGraph();
  const graphCanvas = new LGraphCanvas(canvas, graph);

  // Apply canvas optimizations
  optimizeCanvas(graphCanvas, {
    passive: true,
    preventDefaultOnWheel: false,
  });
  optimizeCanvasForHighDPI(graphCanvas);

  // Start the graph
  graph.start();
  console.log("Graph started");

  // Add some helpful information to the console
  console.log("\nAvailable APIs:");
  Object.entries(API_SPECS).forEach(([key, spec]) => {
    console.log(`- ${spec.name} (${key})`);
  });
  console.log("\nTip: Right-click on the canvas to add nodes from different APIs!");
}

// Initialize the graph when the page loads
generateGraph().catch((error) => {
  console.error("Failed to generate graph:", error);
});
