"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
import { isClientSide } from "@Utils/ClientOnly";

type Theme = "dark" | "light" | "system";

const local: Theme = "light";

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  isDarkTheme: boolean;

  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: local,
  setTheme: () => null,
  isDarkTheme: false,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

const ThemeProvider = ({
  children,
  defaultTheme = local,
  storageKey = "theme",
  ...props
}: ThemeProviderProps) => {
  const storageData = isClientSide() ? localStorage.getItem(storageKey) : null;

  const [theme, setTheme] = useState<Theme>(
    () => (storageData as Theme) || defaultTheme,
  );
  const [isDarkTheme, setIsDarkTheme] = useState(initialState.isDarkTheme);

  useEffect(() => {
    if (!isClientSide()) return;

    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    let appliedTheme = theme;

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      appliedTheme = systemTheme; // Use the system theme
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    setIsDarkTheme(appliedTheme === "dark");
  }, [theme]);

  const value = {
    theme,
    isDarkTheme,
    setTheme: (data: Theme) => {
      localStorage.setItem(storageKey, data);
      setTheme(data);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
};

export { ThemeProvider, ThemeProviderContext };
