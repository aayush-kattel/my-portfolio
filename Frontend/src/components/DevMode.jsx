import { FaCode } from "react-icons/fa6";
import { useState, useEffect } from "react";
import CommandPrompt from "./CommandPrompt";

export default function DevModeToggle({ onClose }) {
  const [devOpened, setDevOpened] = useState(false);

  useEffect(() => {
    document.body.style.overflow = devOpened ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [devOpened]);

   const closeDev = () => {
    setDevOpened(false);
    onClose?.();                                        // ← call it here
  };
  return (
    <>
      {devOpened && (
        <div
          onClick={closeDev} 
          style={{
            position: "fixed", inset: 0, zIndex: 9990,
            background: "rgba(5,8,15,0.88)",
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
            animation: "fadeInBackdrop 0.2s ease",
          }}
        />
      )}

      {devOpened && (
        <CommandPrompt devOpened={devOpened} setDevOpened={closeDev}  />
      )}

      <button
        onClick={() => devOpened ? closeDev() : setDevOpened(true)}
        aria-label="Toggle Dev Mode"
        style={{
          position: "fixed",
          // Move up on small screens so it doesn't overlap OS navigation bar
          right: "clamp(12px, 4vw, 24px)",
          bottom: "clamp(16px, 4vw, 24px)",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "3px",
          // Slightly smaller on very small phones
          width: "clamp(50px, 10vw, 60px)",
          height: "clamp(50px, 10vw, 60px)",
          borderRadius: "14px",
          border: devOpened
            ? "1.5px solid #a855f7"
            : "1.5px solid rgba(168,85,247,0.4)",
          cursor: "pointer",
          background: devOpened
            ? "rgba(168,85,247,0.25)"
            : "rgba(10,10,20,0.85)",
          color: devOpened ? "#d8b4fe" : "#a855f7",
          fontFamily: "'Fira Code','JetBrains Mono',monospace",
          fontSize: "clamp(8px, 1.5vw, 10px)",
          textAlign: "center",
          boxShadow: devOpened
            ? "0 0 20px rgba(168,85,247,0.5), inset 0 0 12px rgba(168,85,247,0.1)"
            : "0 4px 20px rgba(0,0,0,0.4)",
          transition: "all 0.25s ease",
          backdropFilter: "blur(8px)",
          WebkitTapHighlightColor: "transparent",
          touchAction: "manipulation",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-3px)";
          e.currentTarget.style.boxShadow = "0 0 28px rgba(168,85,247,0.6), inset 0 0 12px rgba(168,85,247,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = devOpened
            ? "0 0 20px rgba(168,85,247,0.5), inset 0 0 12px rgba(168,85,247,0.1)"
            : "0 4px 20px rgba(0,0,0,0.4)";
        }}
      >
        <FaCode size={18} />
        <span style={{ fontSize: "clamp(7px,1.4vw,9px)", letterSpacing:"0.05em", opacity:0.9 }}>
          {devOpened ? "ACTIVE" : "DEV"}
        </span>
      </button>

      <style>{`
        @keyframes fadeInBackdrop {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </>
  );
}