/**
 * Clamps a value between a minimum and maximum value.
 * @param value The value to clamp
 * @param min The minimum allowed value
 * @param max The maximum allowed value
 * @returns The clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Converts a hexadecimal color string to a number
 * @param hex The hexadecimal color string (e.g., "#FF0000" or "FF0000")
 * @returns The numeric value of the color
 */
export function hex2num(hex: string): number {
  if (hex.charAt(0) === "#") {
    hex = hex.slice(1);
  }
  return parseInt(hex, 16);
}

/**
 * Converts a number to a hexadecimal color string
 * @param num The numeric value to convert
 * @returns The hexadecimal color string
 */
export function num2hex(num: number): string {
  return "#" + num.toString(16).padStart(6, "0");
}

/**
 * Converts a color object to a string representation
 * @param color The color object to convert
 * @returns The string representation of the color
 */
export function colorToString(color: {
  r: number;
  g: number;
  b: number;
}): string {
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
}
