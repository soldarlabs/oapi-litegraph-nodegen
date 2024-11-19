// run.ts
import { NodeGenerator } from './nodeGenerator.js';
import { LiteGraph, LGraph } from 'litegraph.js';

async function main() {
  // Create an instance of NodeGenerator
  const nodeGenerator = new NodeGenerator();

  // Add an OpenAPI specification (replace with your actual spec path or URL)
  const specPath = '../test/assets/openapi.yaml';
  await nodeGenerator.addSpec('exampleSpec', specPath);

  // Register nodes from the specification
  nodeGenerator.registerNodes('exampleSpec');

  // Create a graph
  const graph = new LGraph();

  // Create a node from the registered type and add it to the graph
  const nodeType = 'oapi/exampleSpec/post/image-to-text'; // Replace with your actual node type
  const node = LiteGraph.createNode(nodeType);
  if (node) {
    graph.add(node);
    console.log(`Node of type ${nodeType} added to the graph.`);
  } else {
    console.error(`Failed to create node of type ${nodeType}.`);
  }

  // Start the graph (optional, depending on your use case)
  graph.start();
}

main().catch(console.error);
