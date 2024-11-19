import { NodeGenerator, setLogLevel } from '../src';
import { LGraphCanvas, LGraph } from 'litegraph.js';

/**
 * Update the canvas used by the editor to match the size of the parent element.
 * @param {*} canvas the Litegraph canvas to update.
 * @param {*} graphCanvas the LGraphCanvas instance to resize.
 */
function updateEditorHiPPICanvas(canvas, graphCanvas) {
  const ratio = window.devicePixelRatio || 1;
  const rect = canvas.parentNode.getBoundingClientRect();
  const { width, height } = rect;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  const context = canvas.getContext("2d");
  context.scale(ratio, ratio);
  graphCanvas.resize();
}

/**
 * Generate a graph using the NodeGenerator class and display it in the browser.
 */
async function generateGraph() {
  setLogLevel('debug');

  const generator = new NodeGenerator();
  await generator.addSpec('exampleSpec', './openapi.yaml');
  generator.registerNodes();

  const canvas = document.querySelector("#mycanvas");
  const graph = new LGraph();
  const graphCanvas = new LGraphCanvas(canvas, graph);

  // Ensure canvas update when window is resized or browser zoom changes.
  updateEditorHiPPICanvas(canvas, graphCanvas);
  window.addEventListener('resize', () => updateEditorHiPPICanvas(canvas, graphCanvas));

  graph.start();
}

generateGraph();
