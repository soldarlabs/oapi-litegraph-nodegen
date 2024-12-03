import { NodeGenerator } from "./nodeGenerator.js";

// Export library utilities.
import { setLogLevel } from "./utils/logger.js";
import {
  optimizeCanvas,
  optimizeCanvasForHighDPI,
} from "./utils/optim/canvas.js";
import { patchContextMenu } from "./utils/contextMenu.js";

export {
  NodeGenerator,
  setLogLevel,
  optimizeCanvas,
  optimizeCanvasForHighDPI,
  patchContextMenu,
};
