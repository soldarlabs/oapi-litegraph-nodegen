import { NodeGenerator } from "./generator/nodeGenerator.js";

// Export library utilities.
import { setLogLevel } from "./utils/logger.js";
import {
  optimizeCanvas,
  optimizeCanvasForHighDPI,
} from "./utils/optim/canvas.js";

export { NodeGenerator, setLogLevel, optimizeCanvas, optimizeCanvasForHighDPI };
