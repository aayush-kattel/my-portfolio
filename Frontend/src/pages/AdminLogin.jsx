import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import ThemeToggle from "../components/ThemeToggle";
import DevModeToggle from "../components/DevMode";
import AnimatedBackground from "../components/AnimatedBackground";
import { apiLogin } from "../api";

const FULL_CMD = "sudo login --admin";

export default function AdminLogin() {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [typedText, setTypedText]   = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [username, setUsername]     = useState("");
  const [password, setPassword]     = useState("");
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    let i = 0, tid;
    function typeNext() {
      if (i <= FULL_CMD.length) {
        setTypedText(FULL_CMD.slice(0, i++));
        tid = setTimeout(typeNext, i === 1 ? 400 : 55 + Math.random() * 60);
      } else setShowCursor(false);
    }
    const start = setTimeout(typeNext, 700);
    return () => { clearTimeout(start); clearTimeout(tid); };
  }, []);

  const handleLogin = async () => {
    if (!username || !password) { setError("Please enter username and password"); return; }
    setLoading(true); setError("");
    try {
      const data = await apiLogin(username, password);
      localStorage.setItem("ak_token", data.token);
      sessionStorage.setItem("ak_admin", "true");
      navigate("/admin");
    } catch (e) {
      setError(e.message || "Access denied — invalid credentials");
      setPassword("");
    } finally { setLoading(false); }
  };

  const t        = (l, d) => isDark ? d : l;
  const cardBg   = t("rgba(255,253,247,0.88)", "rgba(36,37,38,0.90)");
  const inputBg  = t("#ffffff", "rgba(255,255,255,0.05)");
  const inputBdr = t("rgba(26,18,8,0.14)", "rgba(228,230,235,0.12)");
  const termBg   = t("rgba(0,0,0,0.07)", "rgba(255,255,255,0.04)");
  const cardBdr  = t("rgba(26,18,8,0.10)", "rgba(228,230,235,0.10)");
  const text     = t("#1a1208", "#e4e6eb");
  const text2    = t("rgba(26,18,8,0.55)", "rgba(228,230,235,0.5)");

  const inputStyle = {
    width: "100%", height: "42px", borderRadius: "10px",
    border: `1px solid ${inputBdr}`, background: inputBg,
    color: text, fontSize: "14px", padding: "0 14px",
    outline: "none", fontFamily: "monospace", transition: "border .2s,box-shadow .2s",
    boxSizing: "border-box",
  };

  return (
    <div
      ref={sectionRef}
      style={{
        minHeight: "100vh",
        background: t("#f0e8d8", "#18191a"),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        transition: "background 0.6s",
        padding: "clamp(16px, 5vw, 40px) 16px",
      }}
    >
      <AnimatedBackground sectionRef={sectionRef} />
      <ThemeToggle /><DevModeToggle />

      <div style={{ position: "relative", width: "100%", maxWidth: "440px", zIndex: 1 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "22px", background: "linear-gradient(90deg,transparent,#5ba898,#d4935a,#c96a6a,#7aaa6a,#8a7ab8,#5ba898,transparent)", backgroundSize: "200% 100%", animation: "borderSlide 3s linear infinite" }} />
        <div style={{ position: "relative", zIndex: 1, margin: "2px", background: cardBg, borderRadius: "20px", padding: "clamp(20px, 5vw, 36px) clamp(16px, 5vw, 34px) 32px", backdropFilter: "blur(20px)" }}>

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
            <div style={{ position: "relative", width: "44px", height: "44px", flexShrink: 0 }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "50%", border: "2px solid #5ba898", background: "#5ba898", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "14px", color: "#fff", fontFamily: "Georgia,serif" }}>AK</div>
              <div style={{ position: "absolute", inset: "-5px", borderRadius: "50%", border: "1.5px dashed rgba(91,168,152,0.45)", animation: "spin 14s linear infinite" }} />
            </div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 600, fontFamily: "Georgia,serif", color: text, transition: "color .6s" }}>Aayush Kattel</div>
              <div style={{ fontSize: "10px", fontFamily: "monospace", letterSpacing: "2px", textTransform: "uppercase", color: "#5ba898" }}>Full Stack Developer</div>
            </div>
          </div>

          {/* Terminal line */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: "22px", padding: "10px 14px", background: termBg, borderRadius: "10px", border: `1px solid ${cardBdr}`, fontFamily: "monospace", fontSize: "clamp(10px,1.4vw,12px)", minHeight: "38px", flexWrap: "wrap", gap: "2px" }}>
            <span style={{ color: "#34d399" }}>aayush@portfolio</span>
            <span style={{ color: text2 }}>:</span>
            <span style={{ color: "#a855f7" }}>~</span>
            <span style={{ color: text2 }}>$&nbsp;</span>
            <span style={{ color: text }}>{typedText}</span>
            {showCursor && <span style={{ display: "inline-block", width: "7px", height: "13px", background: "#a855f7", marginLeft: "1px", verticalAlign: "middle", animation: "blink 1s step-end infinite" }} />}
          </div>

          <div style={{ fontSize: "clamp(18px,4vw,22px)", fontWeight: 700, fontFamily: "Georgia,serif", marginBottom: "3px", background: "linear-gradient(90deg,#5ba898,#d4935a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Admin Access</div>
          <div style={{ fontSize: "13px", color: text2, marginBottom: "24px" }}>Restricted zone — authorised personnel only</div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 600, letterSpacing: ".07em", textTransform: "uppercase", color: text2, marginBottom: "6px", fontFamily: "monospace" }}>Username</label>
            <input
              type="text" value={username} placeholder="admin" autoComplete="off" spellCheck={false}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={e => e.key === "Enter" && document.getElementById("pw")?.focus()}
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = "#5ba898"; e.target.style.boxShadow = "0 0 0 3px rgba(91,168,152,0.14)"; }}
              onBlur={e => { e.target.style.borderColor = inputBdr; e.target.style.boxShadow = "none"; }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 600, letterSpacing: ".07em", textTransform: "uppercase", color: text2, marginBottom: "6px", fontFamily: "monospace" }}>Password</label>
            <input
              id="pw" type="password" value={password} placeholder="••••••••"
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = "#5ba898"; e.target.style.boxShadow = "0 0 0 3px rgba(91,168,152,0.14)"; }}
              onBlur={e => { e.target.style.borderColor = inputBdr; e.target.style.boxShadow = "none"; }}
            />
          </div>

          {error && <div style={{ fontSize: "12px", color: "#c96a6a", marginBottom: "12px", padding: "8px 12px", background: "rgba(201,106,106,0.1)", borderRadius: "8px", border: "1px solid rgba(201,106,106,0.2)", fontFamily: "monospace" }}>{error}</div>}

          <button
            onClick={handleLogin} disabled={loading}
            style={{ width: "100%", height: "44px", borderRadius: "11px", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: 600, letterSpacing: ".04em", color: "#fff", background: "linear-gradient(135deg,#5ba898,#4a9080)", fontFamily: "monospace", marginBottom: "12px", opacity: loading ? 0.7 : 1, transition: "opacity .2s,transform .1s" }}
            onMouseEnter={e => !loading && (e.currentTarget.style.opacity = ".9")}
            onMouseLeave={e => !loading && (e.currentTarget.style.opacity = "1")}
          >{loading ? "Authenticating…" : "Authenticate →"}</button>

          <div style={{ textAlign: "center", fontSize: "11px", fontFamily: "monospace", color: text2, paddingTop: "8px" }}>
            or type <code style={{ color: "#a855f7", background: "rgba(168,85,247,0.1)", padding: "2px 7px", borderRadius: "5px" }}>sudo login --exit</code> in dev mode to return
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg,transparent,#5ba898,#d4935a,#c96a6a,#7aaa6a,#8a7ab8,transparent)", animation: "barPulse 4s ease-in-out infinite" }} />
      <style>{`@keyframes borderSlide{0%{background-position:200% 0}100%{background-position:-200% 0}}@keyframes spin{to{transform:rotate(360deg)}}@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}@keyframes barPulse{0%,100%{opacity:.3}50%{opacity:.85}}`}</style>
    </div>
  );
}