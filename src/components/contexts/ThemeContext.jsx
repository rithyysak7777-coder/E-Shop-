import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem("ecommerce_theme") || "dark-gold");

  useEffect(() => {
    localStorage.setItem("ecommerce_theme", theme);
    document.documentElement.setAttribute("data-shop-theme", theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      isDarkGold: theme === "dark-gold",
      toggleTheme: () => setTheme((current) => (current === "dark-gold" ? "light-blue" : "dark-gold")),
      setTheme,
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
