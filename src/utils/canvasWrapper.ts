import { LGraphCanvas, LGraph } from 'litegraph.js';
import { logger } from './logger.js';

interface CanvasOptions {
    passive?: boolean;
    preventDefaultOnWheel?: boolean;
}

/**
 * Creates a wrapper around LGraphCanvas that handles passive event listeners
 * and other canvas-related optimizations.
 */
export class CanvasWrapper {
    private canvas: HTMLCanvasElement;
    private graph: LGraph;
    private graphCanvas: LGraphCanvas;
    private options: CanvasOptions;

    constructor(canvas: HTMLCanvasElement, graph: LGraph, options: CanvasOptions = {}) {
        this.canvas = canvas;
        this.graph = graph;
        this.options = {
            passive: true,
            preventDefaultOnWheel: false,
            ...options
        };

        // Create the graph canvas first
        this.graphCanvas = new LGraphCanvas(canvas, graph);

        // Setup resize handling
        this.setupResizeHandling();

        logger.debug("Canvas wrapper initialized", {
            component: "CanvasWrapper",
            canvasId: canvas.id,
            options: this.options
        });
    }

    /**
     * Sets up high-DPI aware resize handling
     */
    private setupResizeHandling() {
        const updateCanvas = () => {
            const ratio = window.devicePixelRatio || 1;
            const parent = this.canvas.parentElement;
            if (!parent) {
                logger.warn("Canvas has no parent element", {
                    component: "CanvasWrapper",
                    canvasId: this.canvas.id
                });
                return;
            }

            const rect = parent.getBoundingClientRect();
            const { width, height } = rect;
            this.canvas.width = width * ratio;
            this.canvas.height = height * ratio;
            this.canvas.style.width = width + "px";
            this.canvas.style.height = height + "px";
            
            const context = this.canvas.getContext("2d");
            if (context) {
                context.scale(ratio, ratio);
            }
            
            if (this.graphCanvas) {
                this.graphCanvas.resize();
            }
            
            logger.debug("Canvas resized", {
                component: "CanvasWrapper",
                canvasId: this.canvas.id,
                width,
                height,
                ratio
            });
        };

        // Initial update
        updateCanvas();

        // Add resize listener
        window.addEventListener('resize', updateCanvas, {
            passive: true
        });
    }

    /**
     * Gets the underlying LGraphCanvas instance
     */
    public getGraphCanvas(): LGraphCanvas {
        return this.graphCanvas;
    }

    /**
     * Gets the underlying canvas element
     */
    public getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }
}
