/**
 * @file Litegraph canvas optimization utilities.
 */
import { LiteGraph, LGraphCanvas } from "litegraph.js";
import { logger } from "../logger.js";

// Type declaration for LiteGraph's static properties
declare module "litegraph.js" {
  interface LiteGraph {
    pointerevents_method: string;
  }
}

/** Options for optimizing the canvas. */
interface CanvasOptions {
  /** Whether to use pointer events instead of mouse events. */
  pointerEvents?: boolean;
}

/**
 * Optimizes the canvas specifically for high-DPI displays.
 * @param graphCanvas The LiteGraph canvas to optimize.
 */
export function optimizeCanvasForHighDPI(graphCanvas: LGraphCanvas): void {
  const canvasElement = graphCanvas.canvas;

  /**
   * Resizes the canvas to match the device's pixel ratio.
   */
  const resizeCanvasForHighDPI = () => {
    const ratio = window.devicePixelRatio || 1;
    const parent = canvasElement.parentElement;
    if (!parent) {
      logger.warn("Canvas has no parent element", {
        component: "CanvasWrapper",
        canvasId: canvasElement.id,
      });
      return;
    }

    const rect = parent.getBoundingClientRect();
    const { width, height } = rect;
    canvasElement.width = width * ratio;
    canvasElement.height = height * ratio;
    canvasElement.style.width = width + "px";
    canvasElement.style.height = height + "px";

    const context = canvasElement.getContext("2d");
    if (context) {
      context.scale(ratio, ratio);
    }

    graphCanvas.resize();

    logger.debug("Canvas resized", {
      component: "CanvasWrapper",
      canvasId: canvasElement.id,
      width,
      height,
      ratio,
    });
  };

  resizeCanvasForHighDPI();

  // Add resize listener.
  window.addEventListener("resize", resizeCanvasForHighDPI, {
    passive: true,
  });

  logger.debug("Canvas optimized for high-DPI displays", {
    component: "CanvasWrapper",
    canvasId: canvasElement.id,
  });
}

/**
 * Optimizes the Litegraph canvas to apply performance optimizations.
 * @param graphCanvas The LiteGraph canvas to optimize.
 * @param options Options for optimizing the canvas.
 * @remarks
 * When pointer events are enabled, this function uses a type assertion to set
 * LiteGraph's internal pointer events method. This is necessary because the
 * property is not included in LiteGraph's TypeScript definitions but exists
 * at runtime.
 */
export function optimizeCanvas(
  graphCanvas: LGraphCanvas,
  options: CanvasOptions = {},
): void {
  const canvasElement = graphCanvas.canvas;

  options = {
    pointerEvents: true,
    ...options,
  };

  optimizeCanvasForHighDPI(graphCanvas);

  // Override LiteGraph event handling to optimize performance.
  if (options.pointerEvents) {
    (LiteGraph as any).pointerevents_method = "pointer";
  }

  logger.debug("Canvas optimized", {
    component: "CanvasWrapper",
    canvasId: canvasElement.id,
    options,
  });
}
