/**
 * @file Contains the theme provider for managing the application-wide theme.
 */
import { useEffect, useState } from "react";
import { Theme, ThemeProviderContext } from "@/contexts/theme-context";

/** Properties for the ThemeProvider component. */
type ThemeProviderProps = {
  /** Children to render. */
  children: React.ReactNode;
  /** Default theme to use. */
  defaultTheme?: Theme;
  /** Storage key for the theme. */
  storageKey?: string;
};

/**
 * Theme provider for managing the application-wide theme.
 */
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
