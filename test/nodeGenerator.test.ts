import { NodeGenerator } from '../src/nodeGenerator';
import SwaggerParser from "@apidevtools/swagger-parser";
import path from 'path';
import fs from 'fs';
import nock from 'nock';
import { LiteGraph, LGraph } from 'litegraph.js';

describe('NodeGenerator', () => {
  let generator: NodeGenerator;

  beforeEach(() => {
    generator = new NodeGenerator();
    nock.cleanAll();
  });

  test('should add a local OpenAPI spec successfully', async () => {
    const localSpecPath = path.resolve(__dirname, 'assets/openapi.yaml');
    const expectedSpec = await SwaggerParser.validate(localSpecPath);

    await generator.addSpec('localSpec', localSpecPath);
    expect(generator['openApiSpecs']['localSpec']).toBeDefined();
    expect(generator['openApiSpecs']['localSpec']).toEqual(expectedSpec);
  });

  test('should add a URL OpenAPI spec successfully', async () => {
    const urlSpecPath = path.resolve(__dirname, 'assets/openapi.yaml');
    const urlSpecContent = fs.readFileSync(urlSpecPath, 'utf8');

    nock('https://example.com')
      .get('/openapi.yaml')
      .reply(200, urlSpecContent);

    const urlSpec = 'https://example.com/openapi.yaml';
    await generator.addSpec('urlSpec', urlSpec);
    expect(generator['openApiSpecs']['urlSpec']).toBeDefined();
  });

  test('should throw an error for invalid OpenAPI spec', async () => {
    const invalidSpecPath = path.resolve(__dirname, 'assets/invalid.openapi.yaml');
    await expect(generator.addSpec('invalidSpec', invalidSpecPath)).rejects.toThrow(/^Swagger schema validation failed./);
  });

  test('should remove an existing OpenAPI spec', async () => {
    const localSpecPath = path.resolve(__dirname, 'assets/openapi.yaml');
    await generator.addSpec('localSpec', localSpecPath);
    const result = generator.removeSpec('localSpec');
    expect(result).toBe(true);
    expect(generator['openApiSpecs']['localSpec']).toBeUndefined();
  });

  test('should not remove a non-existing OpenAPI spec', () => {
    const result = generator.removeSpec('nonExistingSpec');
    expect(result).toBe(false);
  });

  test('should remove all OpenAPI specs', async () => {
    const localSpecPath1 = path.resolve(__dirname, 'assets/openapi.yaml');
    const localSpecPath2 = path.resolve(__dirname, 'assets/another.openapi.yaml');
    await generator.addSpec('localSpec1', localSpecPath1);
    await generator.addSpec('localSpec2', localSpecPath2);
    generator.removeAllSpecs();
    expect(Object.keys(generator['openApiSpecs']).length).toBe(0);
  });

  test('should register LiteGraph nodes from all OpenAPI specs', async () => {
    const localSpecPath1 = path.resolve(__dirname, 'assets/openapi.yaml');
    const localSpecPath2 = path.resolve(__dirname, 'assets/another.openapi.yaml');
    await generator.addSpec('localSpec1', localSpecPath1);
    await generator.addSpec('localSpec2', localSpecPath2);

    const spy = jest.spyOn(LiteGraph, 'registerNodeType');

    generator.registerNodes();
    expect(spy).toHaveBeenCalled();

    spy.mockRestore();
  });

  test('should register LiteGraph nodes from a specific OpenAPI spec', async () => {
    const localSpecPath1 = path.resolve(__dirname, 'assets/openapi.yaml');
    const localSpecPath2 = path.resolve(__dirname, 'assets/another.openapi.yaml');
    await generator.addSpec('localSpec1', localSpecPath1);
    await generator.addSpec('localSpec2', localSpecPath2);

    const spy = jest.spyOn(LiteGraph, 'registerNodeType');

    generator.registerNodes('localSpec1');
    expect(spy).toHaveBeenCalledWith(expect.stringMatching(/^oapi\/localSpec1\//), expect.any(Function));

    generator.registerNodes('localSpec2');
    expect(spy).toHaveBeenCalledWith(expect.stringMatching(/^oapi\/localSpec2\//), expect.any(Function));

    spy.mockRestore();
  });

  test('should unregister LiteGraph nodes from all OpenAPI specs', async () => {
    const localSpecPath1 = path.resolve(__dirname, 'assets/openapi.yaml');
    const localSpecPath2 = path.resolve(__dirname, 'assets/another.openapi.yaml');
    await generator.addSpec('localSpec1', localSpecPath1);
    await generator.addSpec('localSpec2', localSpecPath2);

    generator.registerNodes();

    const spy = jest.spyOn(LiteGraph, 'unregisterNodeType');

    generator.unregisterNodes();
    expect(spy).toHaveBeenCalled();

    spy.mockRestore();
  });

  test('should unregister LiteGraph nodes from a specific OpenAPI spec', async () => {
    const localSpecPath1 = path.resolve(__dirname, 'assets/openapi.yaml');
    const localSpecPath2 = path.resolve(__dirname, 'assets/another.openapi.yaml');
    await generator.addSpec('localSpec1', localSpecPath1);
    await generator.addSpec('localSpec2', localSpecPath2);

    generator.registerNodes();

    const spy = jest.spyOn(LiteGraph, 'unregisterNodeType');

    generator.unregisterNodes('localSpec1');
    expect(spy).toHaveBeenCalledWith(expect.stringMatching(/^oapi\/localSpec1\//));

    generator.unregisterNodes('localSpec2');
    expect(spy).toHaveBeenCalledWith(expect.stringMatching(/^oapi\/localSpec2\//));

    spy.mockRestore();
  });

  test('should throw an error if no OpenAPI specs are added before registering nodes', () => {
    expect(() => generator.registerNodes()).toThrow('No OpenAPI specs have been parsed. Call addSpec() first.');
  });

  test('should throw an error if the specified OpenAPI spec key does not exist when registering nodes', async () => {
    const localSpecPath = path.resolve(__dirname, 'assets/openapi.yaml');
    await generator.addSpec('localSpec', localSpecPath);
    expect(() => generator.registerNodes('nonExistingSpec')).toThrow("OpenAPI spec with key 'nonExistingSpec' does not exist.");
  });

  test('should throw an error if the specified OpenAPI spec key does not exist when unregistering nodes', async () => {
    const localSpecPath = path.resolve(__dirname, 'assets/openapi.yaml');
    await generator.addSpec('localSpec', localSpecPath);
    expect(() => generator.unregisterNodes('nonExistingSpec')).toThrow("OpenAPI spec with key 'nonExistingSpec' does not exist.");
  });

  test('should register a custom node and add it to the graph', async () => {
    const localSpecPath = path.resolve(__dirname, 'assets/openapi.yaml');
    await generator.addSpec('localSpec', localSpecPath);
    const graph = new LGraph();

    generator.registerNodes('localSpec');

    const nodeType = 'oapi/localSpec/post/image-to-text'; // Replace with your actual node type
    const node = LiteGraph.createNode(nodeType);
    graph.add(node);

    expect(node.inputs.length).toBeGreaterThan(0);
    expect(node.outputs.length).toBeGreaterThan(0);
  });
});
