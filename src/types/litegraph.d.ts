/**
 * @file Type definitions for LiteGraph global extensions
 */
import { clamp, hex2num, num2hex, colorToString } from "../utils/color";

declare global {
  interface Window {
    clamp: typeof clamp;
    hex2num: typeof hex2num;
    num2hex: typeof num2hex;
    colorToString: typeof colorToString;
  }
}
