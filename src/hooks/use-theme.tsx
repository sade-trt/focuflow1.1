import { createContext, useContext, useLayoutEffect, useState, type ReactNode } from "react";
import { loadLS, saveLS } from "@/lib/storage";

export type Theme = "dark" | "light";

const ThemeCtx = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
} | null>(null);

function applyThemeClass(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => loadLS<Theme>("focus.theme", "dark"));

  useLayoutEffect(() => {
    applyThemeClass(theme);
    saveLS("focus.theme", theme);
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);

  return (
    <ThemeCtx.Provider
      value={{
        theme,
        setTheme,
        toggle: () => setThemeState((t) => (t === "dark" ? "light" : "dark")),
      }}
    >
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
