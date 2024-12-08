/**
 * @file Provides the theme context for the application.
 */
import { createContext } from "react";

export type Theme = "dark" | "light" | "system";

/** State for the ThemeProvider component. */
export type ThemeProviderState = {
  /** Current theme. */
  theme: Theme;
  /** Set the theme. */
  setTheme: (theme: Theme) => void;
};

/** Initial state for the Theme context. */
const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

export const ThemeProviderContext = createContext<ThemeProviderState>(initialState);
