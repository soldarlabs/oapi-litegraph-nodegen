/**
 * @file Provides a hook for accessing the current LiteGraph context.
 */
import { useContext } from "react";
import { LiteGraphContext } from "@/contexts/litegraph-context";

/**
 * Hook for using the current LiteGraph context.
 * @returns The current LiteGraph context.
 * @throws Will throw an error if used outside of a LiteGraphProvider.
 */
export const useLiteGraph = () => {
  const context = useContext(LiteGraphContext);
  if (!context) {
    throw new Error("useLiteGraph must be used within a LiteGraphProvider");
  }
  return context;
};
