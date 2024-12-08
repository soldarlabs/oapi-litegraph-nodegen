/**
 * @file Theme provider for managing the application wide ChadCN theme.
 */
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

/** Properties for the ThemeProvider component. */
type ThemeProviderProps = {
  /** Children to render. */
  children: React.ReactNode;
  /** Default theme to use. */
  defaultTheme?: Theme;
  /** Storage key for the theme. */
  storageKey?: string;
};

/** State for the ThemeProvider component. */
type ThemeProviderState = {
  /** Current theme. */
  theme: Theme
  /** Set the theme. */
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

/**
 * Theme provider for managing the application wide ChadCN theme.
 * @param props The properties for the ThemeProvider component.
 * @returns The ThemeProvider component.
 */
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

/** Hook for using the current theme. */
export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
