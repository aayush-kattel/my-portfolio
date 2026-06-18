// components/LoadingIntro.jsx
import { useState, useEffect } from "react";
import { useTheme } from "../hooks/useTheme";
import ThemeToggle from "./ThemeToggle";
import AnimatedBackground from "./AnimatedBackground";

const S = {
  green:  { color: "#34d399" },
  accent: { color: "#a855f7" },
  dim:    { color: "rgba(255,255,255,0.45)" },
};

const Prompt = () => (
  <span style={{ userSelect: "none", whiteSpace: "nowrap" }}>
    <span style={S.green}>aayush</span>
    <span style={S.dim}>@</span>
    <span style={S.accent}>portfolio</span>
    <span style={S.dim}>$ </span>
  </span>
);

function StatusLine({ text, color, onDone }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(iv);
        setDone(true);
        setTimeout(() => onDone && onDone(), 60); // was 180
      }
    }, 8); // was 18
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "8px",
      marginBottom: "4px", fontSize: "clamp(11px, 1.5vw, 12px)", color,
      fontFamily: "'Fira Code','JetBrains Mono','Consolas',monospace",
    }}>
      <span style={done
        ? { color: "#34d399", fontSize: "11px" }
        : { color: "#a855f7", fontSize: "11px", display: "inline-block", animation: "liSpin 0.7s linear infinite" }
      }>
        {done ? "✓" : "◌"}
      </span>
      <span>{displayed}</span>
    </div>
  );
}

const STAGES = [
  { text: "Initializing portfolio environment...", color: "rgba(255,255,255,0.55)" },
  { text: "Creating the world...",                 color: "#7dd3fc"                },
  { text: "Making components...",                  color: "#a855f7"                },
  { text: "Importing animations & canvas...",      color: "#34d399"                },
  { text: "Loading skills & projects...",          color: "#d4935a"                },
  { text: "Applying theme & styles...",            color: "#f472b6"                },
  { text: "Spinning up dev server...",             color: "rgba(255,255,255,0.55)" },
];
const PROGRESS_AT = [12, 28, 44, 60, 74, 86, 96];

export default function LoadingIntro({ onDone }) {
  const { isDark } = useTheme();
  const pageBg = isDark ? "#18191a" : "#f0e8d8";

  const CMD = "npm run dev";
  const [cmdDisplayed, setCmdDisplayed] = useState("");
  const [cmdDone, setCmdDone]           = useState(false);
  const [activeStages, setActiveStages] = useState([]);
  const [progress, setProgress]         = useState(0);
  const [finishing, setFinishing]       = useState(false);
  const [fadeOut, setFadeOut]           = useState(false);

  useEffect(() => {
    let i = 0;
    const delay = setTimeout(() => {
      const iv = setInterval(() => {
        i++;
        setCmdDisplayed(CMD.slice(0, i));
        if (i >= CMD.length) {
          clearInterval(iv);
          setTimeout(() => setCmdDone(true), 100); // was 380
        }
      }, 30); // was 95
      return () => clearInterval(iv);
    }, 200); // was 700
    return () => clearTimeout(delay);
  }, []);

  useEffect(() => {
    if (!cmdDone) return;
    const t = setTimeout(() => {
      setActiveStages([0]);
      setProgress(PROGRESS_AT[0]);
    }, 80); // was 260
    return () => clearTimeout(t);
  }, [cmdDone]);

  function handleStageDone(idx) {
    const next = idx + 1;
    if (next < STAGES.length) {
      setActiveStages(prev => [...prev, next]);
      setProgress(PROGRESS_AT[next]);
    } else {
      setProgress(100);
      setFinishing(true);
    }
  }

  useEffect(() => {
    if (!finishing) return;
    const t1 = setTimeout(() => setFadeOut(true), 350);  // was 700
    const t2 = setTimeout(() => onDone && onDone(), 900); // was 1400
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [finishing]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 99999,
      backgroundColor: pageBg,
      transition: "background-color 0.6s ease, opacity 0.7s ease",
      opacity: fadeOut ? 0 : 1,
      pointerEvents: fadeOut ? "none" : "all",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "16px",
    }}>
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <AnimatedBackground sectionRef={{ current: null }} />
      </div>

      <ThemeToggle />

      <div
        style={{
          position: "relative", zIndex: 1,
          width: "min(720px, 100%)",
          borderRadius: "12px", overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)",
          fontFamily: "'Fira Code','JetBrains Mono','Consolas',monospace",
          fontSize: "clamp(11px, 1.5vw, 13px)", lineHeight: "1.6",
          animation: "liSlideUp 0.28s cubic-bezier(.16,1,.3,1) both",
        }}
      >
        {/* Title bar */}
        <div style={{
          position: "relative",
          display: "flex", alignItems: "center",
          padding: "10px 16px",
          background: "#1e1e2e",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          flexShrink: 0, userSelect: "none",
        }}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {["#ff5f57", "#febc2e", "#28c840"].map((bg, i) => (
              <div key={i} style={{ width: "13px", height: "13px", borderRadius: "50%", background: bg }} />
            ))}
          </div>
          <span style={{
            position: "absolute", left: "50%", transform: "translateX(-50%)",
            color: "rgba(255,255,255,0.45)", fontSize: "clamp(10px,1.4vw,12px)", letterSpacing: ".03em",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            maxWidth: "60%",
          }}>
            aayush@portfolio — npm run dev
          </span>
        </div>

        {/* Body */}
        <div style={{
          padding: "16px 20px 20px",
          background: "#13131f",
          color: "#e2e8f0",
          minHeight: "260px",
        }}>
          <div style={{ marginBottom: "16px", color: "rgba(255,255,255,0.3)", fontSize: "clamp(9px,1.2vw,12px)" }}>
            <div>{"╔══════════════════════════════════════════╗"}</div>
            <div>{"║  Welcome to Aayush's Portfolio Terminal  ║"}</div>
            <div>{"╚══════════════════════════════════════════╝"}</div>
            <div style={{ marginTop: "6px" }}>
              Type <span style={S.accent}>help</span> to see all commands.
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
            <Prompt />
            <span style={{ color: "#e2e8f0" }}>{cmdDisplayed}</span>
            {!cmdDone && (
              <span style={{
                display: "inline-block", width: "8px", height: "14px",
                background: "#a855f7", borderRadius: "1px",
                animation: "liCursor 1s step-end infinite",
              }} />
            )}
          </div>

          {activeStages.map((idx) => (
            <StatusLine
              key={idx}
              text={STAGES[idx].text}
              color={STAGES[idx].color}
              onDone={() => handleStageDone(idx)}
            />
          ))}

          {finishing && (
            <div style={{
              marginTop: "10px",
              display: "flex", alignItems: "center", gap: "8px",
              fontSize: "13px",
              animation: "liFadeUp 0.4s ease both",
            }}>
              <span style={{ color: "#34d399" }}>✓</span>
              <span style={{
                background: "linear-gradient(90deg,#5ba898,#d4935a)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontWeight: 600,
              }}>
                Portfolio ready — launching…
              </span>
            </div>
          )}

          {cmdDone && (
            <div style={{ marginTop: "18px" }}>
              <div style={{
                width: "100%", height: "3px",
                background: "rgba(255,255,255,0.08)",
                borderRadius: "2px", overflow: "hidden",
              }}>
                <div style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: "linear-gradient(90deg,#5ba898,#a855f7,#d4935a)",
                  borderRadius: "2px",
                  transition: "width 0.4s ease",
                  boxShadow: "0 0 8px rgba(168,85,247,0.5)",
                }} />
              </div>
              <div style={{
                marginTop: "5px", textAlign: "right",
                fontSize: "11px", color: "rgba(255,255,255,0.28)",
              }}>
                {progress}%
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes liSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes liCursor {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes liSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes liFadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}