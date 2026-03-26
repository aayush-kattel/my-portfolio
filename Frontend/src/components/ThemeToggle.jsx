import { FaSun, FaMoon } from "react-icons/fa6";
import { useTheme } from "../hooks/useTheme";

export default function ThemeToggle() {
  const { isDark, setIsDark } = useTheme();

  return (
    <button
      onClick={() => setIsDark((d) => !d)}
      aria-label="Toggle theme"
      style={{
        position: "fixed",
        right: 0,
        top: "clamp(60px, 10%, 100px)",  // safe distance from top on all screen sizes
        zIndex: 9999,
        width: "42px",
        height: "42px",
        borderRadius: "10px 0 0 10px",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: isDark ? "#3a3b3c" : "rgba(26,18,8,0.09)",
        transition: "background 0.4s",
        WebkitTapHighlightColor: "transparent",
        outline: "none",
      }}
    >
      {isDark
        ? <FaMoon style={{ color: "#e4e6eb", fontSize: "16px" }} />
        : <FaSun  style={{ color: "#b8860b", fontSize: "18px" }} />
      }
    </button>
  );
}