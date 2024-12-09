/**
 * @file Provides the theme context for the application.
 */
import { createContext } from "react";

export type Theme = "dark" | "light" | "system";

/** State for the ThemeContext component. */
export type ThemeContextState = {
  /** Current theme. */
  theme: Theme;
  /** Set the theme. */
  setTheme: (theme: Theme) => void;
};

/** Initial state for the Theme context. */
const initialState: ThemeContextState = {
  theme: "system",
  setTheme: () => null,
};

export const ThemeContext = createContext<ThemeContextState>(initialState);
