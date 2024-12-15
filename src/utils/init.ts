/**
 * @file Initialization utilities for LiteGraph global functions
 */
import { clamp, hex2num, num2hex, colorToString } from "./color.js";
import { logger } from "./logger.js";
import { LiteGraph, LGraph, LGraphNode } from "litegraph.js";

/**
 * Initializes global utility functions required by LiteGraph
 */
export function initializeGlobalUtils(): void {
  if (typeof window === "undefined") {
    logger.warn(
      "Window object not available, skipping global utils initialization",
    );
    return;
  }

  // Initialize LiteGraph core classes globally
  const litegraphGlobals = {
    LiteGraph,
    LGraph,
    LGraphNode,
  };

  Object.entries(litegraphGlobals).forEach(([name, value]) => {
    if (!(name in window)) {
      (window as any)[name] = value;
    }
  });

  // Initialize color utilities
  const utils = {
    clamp,
    hex2num,
    num2hex,
    colorToString,
  };

  Object.entries(utils).forEach(([name, func]) => {
    if (!(name in window)) {
      (window as any)[name] = func;
    } else {
      logger.warn(
        `Global utility '${name}' already exists, skipping initialization`,
      );
    }
  });

  logger.debug("Global utilities initialized", {
    component: "GlobalUtils",
    utilities: [...Object.keys(utils), ...Object.keys(litegraphGlobals)],
  });
}
