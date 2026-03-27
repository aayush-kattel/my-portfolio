import React, { useState, useEffect, useRef } from "react";
import { FaTimes, FaMinus, FaExpand } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const S = {
  out:     { marginLeft: "16px", marginBottom: "6px", paddingTop: "6px" },
  accent:  { color: "#a855f7" },
  green:   { color: "#34d399" },
  dim:     { color: "rgba(255,255,255,0.45)" },
  muted:   { color: "rgba(255,255,255,0.65)", marginBottom: "4px" },
  error:   { color: "#f87171" },
  badge:   { background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)", color: "#c4b5fd", borderRadius: "4px", padding: "1px 7px", fontSize: "11px" },
};

const About    = () => <div style={S.out}><p style={S.muted}>👋 Hi, I'm <span style={S.accent}>Aayush</span> — full-stack developer based in Nepal.</p><p style={S.dim}>React · Node.js · MongoDB · Open to work</p></div>;
const Help     = () => (
  <div style={S.out}>
    <p style={S.dim}>Available commands:</p>
    {[["about", "Who am I"], ["skills", "Tech stack"], ["projects", "Things I've built"], ["contact", "Get in touch"], ["sudo login --admin", "Open admin login"], ["sudo login --exit", "Return to portfolio"], ["clear", "Clear terminal"], ["exit", "Close dev mode"]].map(([c, d]) => (
      <div key={c} style={{ display: "flex", gap: "16px", marginBottom: "3px", flexWrap: "wrap" }}>
        <span style={{ ...S.accent, minWidth: "160px", fontFamily: "inherit" }}>{c}</span>
        <span style={S.dim}>{d}</span>
      </div>
    ))}
  </div>
);
const Skills   = () => <div style={S.out}>{[{ l: "Frontend", i: ["React", "Next.js", "Tailwind", "TypeScript"] }, { l: "Backend", i: ["Node.js", "Express", "Python"] }, { l: "Database", i: ["MongoDB", "PostgreSQL", "Redis"] }, { l: "DevOps", i: ["Docker", "Git", "Vercel"] }].map(({ l, i }) => <div key={l} style={{ marginBottom: "6px", display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}><span style={{ ...S.green, minWidth: "76px" }}>{l}</span>{i.map(x => <span key={x} style={S.badge}>{x}</span>)}</div>)}</div>;
const Projects = () => <div style={S.out}>{[["E-Commerce Platform", "MERN stack shopping app"], ["Portfolio", "React + Vite + Tailwind"], ["Chat App", "Socket.io real-time messaging"]].map(([n, d]) => <div key={n} style={{ marginBottom: "6px" }}><span style={S.accent}>{n}</span><span style={S.dim}> — {d}</span></div>)}</div>;
const Contact  = () => <div style={S.out}>{[["Email", "aayush@example.com"], ["GitHub", "github.com/aayush"], ["LinkedIn", "linkedin.com/in/aayush"]].map(([l, v]) => <div key={l} style={{ marginBottom: "4px" }}><span style={{ ...S.green, minWidth: "72px", display: "inline-block" }}>{l}</span><span style={S.accent}>{v}</span></div>)}</div>;
const Invalid  = ({ cmd }) => <div style={S.out}><span style={S.error}>bash: {cmd}: command not found</span><span style={S.dim}> (type <span style={S.accent}>help</span> for commands)</span></div>;

const PATH_MAP = { about: "~/about", skills: "~/skills", projects: "~/projects", contact: "~/contact", help: "~" };

const Prompt = ({ path }) => (
  <span style={{ userSelect: "none", whiteSpace: "nowrap" }}>
    <span style={S.green}>aayush</span>
    <span style={S.dim}>@</span>
    <span style={S.accent}>portfolio</span>
    <span style={S.dim}>:</span>
    <span style={{ color: "#7dd3fc" }}>{path}</span>
    <span style={S.dim}>$ </span>
  </span>
);

function Toast({ msg }) {
  return msg ? (
    <div style={{
      position: "absolute", top: "12px", left: "50%", transform: "translateX(-50%)",
      background: "linear-gradient(135deg,#5ba898,#d4935a)",
      color: "#fff", borderRadius: "8px", padding: "8px 18px",
      fontSize: "12px", fontFamily: "monospace", fontWeight: 600,
      whiteSpace: "nowrap", zIndex: 10, boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
      animation: "toastIn .3s ease",
    }}>{msg}</div>
  ) : null;
}

export default function CommandPrompt({ devOpened, setDevOpened }) {
  const navigate = useNavigate();
  const [history, setHistory]       = useState([]);
  const [input, setInput]           = useState("");
  const [path, setPath]             = useState("~");
  const [cmdHistory, setCmdHistory] = useState([]);
  const [histIdx, setHistIdx]       = useState(-1);
  const [toast, setToast]           = useState("");
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => { if (devOpened) setTimeout(() => inputRef.current?.focus(), 80); }, [devOpened]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [history]);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  }

  function resolveOutput(cmd) {
    switch (cmd) {
      case "about":    return <About />;
      case "help":     return <Help />;
      case "skills":   return <Skills />;
      case "projects": return <Projects />;
      case "contact":  return <Contact />;
      default:         return <Invalid cmd={cmd} />;
    }
  }

  function handleKeyDown(e) {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(histIdx + 1, cmdHistory.length - 1);
      setHistIdx(next); setInput(cmdHistory[next] ?? ""); return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = histIdx - 1;
      setHistIdx(next); setInput(next < 0 ? "" : cmdHistory[next] ?? ""); return;
    }
    if (e.key !== "Enter") return;

    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === "sudo login --admin") {
  showToast("🔐 Welcome to admin login page");
  setTimeout(() => {
    setDevOpened(false);
    navigate("/admin-login");
  }, 1500);                    // ← wait for toast to show, then close+navigate
  setInput(""); setHistIdx(-1); return;
}

if (cmd === "sudo login --exit") {
  showToast("🏠 Welcome back to portfolio");
  setTimeout(() => {
    setDevOpened(false);
    navigate("/", { state: { refresh: Date.now() } });
  }, 1500);                    // ← wait for toast to show, then close+navigate
  setInput(""); setHistIdx(-1); return;
}

    if (cmd === "clear") { setHistory([]); setInput(""); setHistIdx(-1); return; }
    if (cmd === "exit")  { setDevOpened(false); setInput(""); setHistIdx(-1); return; }

    const newPath = PATH_MAP[cmd] ?? path;
    setHistory(prev => [...prev, { cmd, path, output: resolveOutput(cmd) }]);
    setCmdHistory(prev => [cmd, ...prev]);
    setPath(newPath);
    setInput(""); setHistIdx(-1);
  }

  if (!devOpened) return null;

  return (
    <div
      style={{
        position: "fixed",
        // On mobile: fill most of the screen; on desktop: fixed size
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        zIndex: 9995,
        width: "min(760px, calc(100vw - 24px))",
        height: "min(480px, calc(100vh - 100px))",
        display: "flex",
        flexDirection: "column",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)",
        animation: "slideUp .22s cubic-bezier(.16,1,.3,1)",
        fontFamily: "'Fira Code','JetBrains Mono','Consolas',monospace",
        fontSize: "clamp(11px, 1.5vw, 13px)",
        lineHeight: "1.6",
      }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Title bar */}
      <div style={{
        position: "relative", display: "flex", alignItems: "center",
        padding: "10px 16px", background: "#1e1e2e",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        flexShrink: 0, userSelect: "none",
      }}>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {[["#ff5f57", <FaTimes size={7} />], ["#febc2e", <FaMinus size={7} />], ["#28c840", <FaExpand size={7} />]].map(([bg, icon], i) => (
            <button
              key={i}
              onClick={i === 0 ? () => setDevOpened(false) : undefined}
              style={{ width: "13px", height: "13px", borderRadius: "50%", border: "none", background: bg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, color: "rgba(0,0,0,0.5)" }}
            >
              {icon}
            </button>
          ))}
        </div>
        <span style={{
          position: "absolute", left: "50%", transform: "translateX(-50%)",
          color: "rgba(255,255,255,0.45)", fontSize: "clamp(10px,1.4vw,12px)", letterSpacing: ".03em",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          maxWidth: "55%",
        }}>
          aayush@portfolio: {path}
        </span>
      </div>

      {/* Body */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "16px 20px",
        background: "#13131f", color: "#e2e8f0", position: "relative",
        scrollbarWidth: "thin", scrollbarColor: "rgba(168,85,247,0.3) transparent",
      }}>
        <Toast msg={toast} />

        {history.length === 0 && (
          <div style={{ marginBottom: "16px", color: "rgba(255,255,255,0.3)", fontSize: "clamp(9px,1.2vw,12px)" }}>
            <div>{"╔══════════════════════════════════════════╗"}</div>
            <div>{"║  Welcome to Aayush's Portfolio Terminal  ║"}</div>
            <div>{"╚══════════════════════════════════════════╝"}</div>
            <div style={{ marginTop: "8px" }}>Type <span style={S.accent}>help</span> to see all commands.</div>
          </div>
        )}

        {history.map((entry, idx) => (
          <div key={idx} style={{ marginBottom: "4px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
              <Prompt path={entry.path} />
              <span style={{ color: "#e2e8f0" }}>{entry.cmd}</span>
            </div>
            {entry.output && <div style={{ marginTop: "4px" }}>{entry.output}</div>}
          </div>
        ))}

        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px", flexWrap: "wrap" }}>
          <Prompt path={path} />
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
            style={{
              background: "transparent", border: "none", outline: "none",
              color: "#e2e8f0", fontFamily: "inherit", fontSize: "inherit",
              lineHeight: "inherit", flex: 1, minWidth: "80px", caretColor: "#a855f7",
            }}
          />
        </div>
        <div ref={bottomRef} />
      </div>

      <style>{`
        @keyframes slideUp { from{opacity:0;transform:translate(-50%,calc(-50% + 16px))} to{opacity:1;transform:translate(-50%,-50%)} }
        @keyframes toastIn { from{opacity:0;transform:translateX(-50%) translateY(-6px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
      `}</style>
    </div>
  );
}