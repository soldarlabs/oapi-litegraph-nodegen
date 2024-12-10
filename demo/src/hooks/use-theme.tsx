/**
 * @file Provides a hook for accessing the current theme context.
 */
import { useContext } from "react";
import { ThemeContext } from "@/contexts/theme-context";

/**
 * Hook for using the current theme context.
 * @returns The current theme context.
 * @throws Will throw an error if used outside of a ThemeProvider.
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
