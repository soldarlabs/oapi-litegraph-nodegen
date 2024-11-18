import { NodeGenerator } from '../src/nodeGenerator';
import SwaggerParser from "@apidevtools/swagger-parser";
import path from 'path';
import fs from 'fs';
import nock from 'nock';
import { LiteGraph } from 'litegraph.js';

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

  test('should generate LiteGraph nodes from all OpenAPI specs', async () => {
    const localSpecPath1 = path.resolve(__dirname, 'assets/openapi.yaml');
    const localSpecPath2 = path.resolve(__dirname, 'assets/another.openapi.yaml');
    await generator.addSpec('localSpec1', localSpecPath1);
    await generator.addSpec('localSpec2', localSpecPath2);
    expect(() => generator.generateNodes()).not.toThrow();
  });

  test('should generate LiteGraph nodes from a specific OpenAPI spec', async () => {
    const localSpecPath1 = path.resolve(__dirname, 'assets/openapi.yaml');
    const localSpecPath2 = path.resolve(__dirname, 'assets/another.openapi.yaml');
    await generator.addSpec('localSpec1', localSpecPath1);
    await generator.addSpec('localSpec2', localSpecPath2);
    expect(() => generator.generateNodes('localSpec1')).not.toThrow();
    expect(() => generator.generateNodes('localSpec2')).not.toThrow();
  });

  test('should throw an error if no OpenAPI specs are added before generating nodes', () => {
    expect(() => generator.generateNodes()).toThrow('No OpenAPI specs have been parsed. Call addSpec() first.');
  });

  test('should throw an error if the specified OpenAPI spec key does not exist', async () => {
    const localSpecPath = path.resolve(__dirname, 'assets/openapi.yaml');
    await generator.addSpec('localSpec', localSpecPath);
    expect(() => generator.generateNodes('nonExistingSpec')).toThrow("OpenAPI spec with key 'nonExistingSpec' does not exist.");
  });

  test('should correctly use the specified OpenAPI spec in node generation', async () => {
    const localSpecPath1 = path.resolve(__dirname, 'assets/openapi.yaml');
    const localSpecPath2 = path.resolve(__dirname, 'assets/another.openapi.yaml');
    await generator.addSpec('localSpec1', localSpecPath1);
    await generator.addSpec('localSpec2', localSpecPath2);

    const spy = jest.spyOn(generator as any, 'generateNodesForSpec');

    generator.generateNodes('localSpec1');
    expect(spy).toHaveBeenCalledWith('localSpec1', expect.anything(), expect.anything(), false);

    generator.generateNodes('localSpec2');
    expect(spy).toHaveBeenCalledWith('localSpec2', expect.anything(), expect.anything(), false);

    spy.mockRestore();
  });

  test('should register nodes with LiteGraph when specified', async () => {
    const localSpecPath1 = path.resolve(__dirname, 'assets/openapi.yaml');
    const localSpecPath2 = path.resolve(__dirname, 'assets/another.openapi.yaml');
    await generator.addSpec('localSpec1', localSpecPath1);
    await generator.addSpec('localSpec2', localSpecPath2);

    const spy = jest.spyOn(LiteGraph, 'registerNodeType');

    generator.generateNodes('localSpec1', true);
    expect(spy).toHaveBeenCalled();

    generator.generateNodes('localSpec2', true);
    expect(spy).toHaveBeenCalled();

    spy.mockRestore();
  });
});
