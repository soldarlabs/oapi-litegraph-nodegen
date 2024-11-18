/**
 * @file Example of how to generate a graph using the NodeGenerator class and a spec
 * file, and display it in the browser.
 */
import { NodeGenerator } from '../src/nodeGenerator.js';
import { LGraphCanvas } from 'litegraph.js';

async function generateGraph() {
  const generator = new NodeGenerator();
  const specPath = './openapi.yaml';
  await generator.addSpec('exampleSpec', specPath);
  const graph = generator.generateNodes('exampleSpec', true);
  console.log(graph);

  new LGraphCanvas("#mycanvas", graph);
  graph.start();
}

generateGraph();
