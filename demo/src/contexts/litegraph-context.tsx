/**
 * @file Provides the LiteGraph context for the application.
 */
import { createContext } from "react";
import { LGraph } from "litegraph.js";
import { NodeGenerator } from "oapi-litegraph-nodegen";

/** State for the ThemeProvider component. */
interface LiteGraphContextState {
  /** Node generator instance. */
  generator: NodeGenerator | null;
  /** LiteGraph instance. */
  graph: LGraph | null;
  /** Flag indicating if the LiteGraph instance is ready. */
  isReady: boolean;
}

export const LiteGraphContext = createContext<
  LiteGraphContextState | undefined
>(undefined);
