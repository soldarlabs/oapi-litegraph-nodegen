/**
 * @file Provides the LiteGraph context for the application.
 */
import React, { useEffect, useState, useRef } from "react";
import { LiteGraphContext } from "@/contexts/litegraph-context";
import {
  NodeGenerator,
  optimizeCanvas,
  setLogLevel,
} from "oapi-litegraph-nodegen";
import { LGraph } from "litegraph.js";

/** Properties for the LiteGraph provider. */
type LiteGraphProviderProps = {
  /** Children to render. */
  children: React.ReactNode;
  /** Canvas ID for the LiteGraph graph. */
  canvasId: string;
};

/**
 * LiteGraph provider for managing the application LiteGraph context.
 * @param props The component props.
 * @returns The LiteGraph provider component.
 */
export const LiteGraphProvider = ({
  children,
  canvasId,
}: LiteGraphProviderProps) => {
  const [generator, setGenerator] = useState<NodeGenerator | null>(null);
  const [graph, setGraph] = useState<LGraph | null>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    /**
     * Initialize the LiteGraph graph and generator.
     */
    const initializeLiteGraph = async () => {
      if (hasInitialized.current) return;
      hasInitialized.current = true;

      setLogLevel("debug");

      // Create a new LiteGraph graph.
      const graphInstance = new LGraph();
      setGraph(() => graphInstance);

      // Apply canvas optimizations.
      optimizeCanvas(canvasId, graphInstance);

      // Initialize the node generator.
      const gen = new NodeGenerator();
      setGenerator(gen);
    };

    initializeLiteGraph().catch((err) => {
      console.error("Failed to initialize LiteGraph:", err);
    });
  }, [canvasId]);

  const isReady = generator !== null && graph !== null;

  return (
    <LiteGraphContext.Provider value={{ generator, graph, isReady }}>
      {children}
    </LiteGraphContext.Provider>
  );
};
