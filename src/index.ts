import { NodeGenerator } from "./generator/nodeGenerator.js";
import { CustomOutputNode } from "./nodes/output/OapiOutputNode.js";

// Export library utilities
import { setLogLevel } from "./utils/logger.js";
import { initializeGlobalUtils } from "./utils/init.js";
import {
  optimizeCanvas,
  optimizeCanvasForHighDPI,
} from "./utils/optim/canvas.js";

// Initialize global utilities
initializeGlobalUtils();

export { 
  NodeGenerator, 
  CustomOutputNode, 
  setLogLevel, 
  optimizeCanvas, 
  optimizeCanvasForHighDPI,
  initializeGlobalUtils  
};
