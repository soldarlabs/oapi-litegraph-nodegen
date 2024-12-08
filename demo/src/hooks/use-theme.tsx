/**
 * @file Contains a hook for using the current theme context.
 */
import { useContext } from "react";
import { ThemeProviderContext } from "@/context/ThemeContext";

/**
 * Hook for using the current theme context.
 */
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
