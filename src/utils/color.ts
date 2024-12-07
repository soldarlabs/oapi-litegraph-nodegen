/**
 * @file Color and math utility functions for LiteGraph nodes.
 */

/**
 * Clamps a value between a minimum and maximum value.
 * @param value The value to clamp.
 * @param min The minimum allowed value.
 * @param max The maximum allowed value.
 * @returns The clamped value.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Converts a hexadecimal color string to a number.
 * @param hex The hexadecimal color string (e.g., "#FF0000" or "FF0000").
 * @returns The numeric value of the color.
 */
export function hex2num(hex: string): number {
  if (hex.charAt(0) === "#") {
    hex = hex.slice(1);
  }
  return parseInt(hex, 16);
}

/**
 * Converts a number to a hexadecimal color string.
 * @param num The numeric value to convert.
 * @returns The hexadecimal color string.
 */
export function num2hex(num: number): string {
  return "#" + num.toString(16).padStart(6, "0");
}

/**
 * Converts various color formats to a string representation.
 * @param color The color to convert (can be a number, string, array of RGB values, or RGB object).
 * @returns The string representation of the color.
 */
export function colorToString(
  color:
    | number
    | string
    | [number, number, number]
    | { r: number; g: number; b: number },
): string {
  if (typeof color === "string") {
    return color;
  }
  if (Array.isArray(color)) {
    const [r, g, b] = color;
    return `rgb(${r},${g},${b})`;
  }
  if (typeof color === "object") {
    const { r, g, b } = color;
    return `rgb(${r},${g},${b})`;
  }
  return num2hex(color);
}
