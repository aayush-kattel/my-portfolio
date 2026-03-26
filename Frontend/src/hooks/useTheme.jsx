import { useState, useEffect, createContext, useContext } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.body.style.backgroundColor = isDark ? "#18191a" : "#f0e8d8";
    document.body.style.color           = isDark ? "#e4e6eb" : "#1a1208";
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
