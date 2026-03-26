import { useRef, useEffect, useCallback, useState } from "react";
import {
  FaReact, FaHtml5, FaCss3Alt, FaJs, FaNodeJs, FaGitAlt, FaGithub, FaDatabase,
} from "react-icons/fa6";
import {
  SiTailwindcss, SiExpress, SiMongodb, SiVite, SiTypescript,
  SiVercel, SiThreedotjs, SiGreensock, SiFramer,
} from "react-icons/si";
import { createRoot } from "react-dom/client";
import AnimatedBackground from "./AnimatedBackground";
import AKLogo from "./AKLogo";
import { useTheme } from "../hooks/useTheme";
import { apiGetSkills } from "../api";

const NAME_TO_ICON = {
  react: FaReact, html: FaHtml5, html5: FaHtml5,
  css: FaCss3Alt, css3: FaCss3Alt,
  javascript: FaJs, js: FaJs,
  "node.js": FaNodeJs, nodejs: FaNodeJs, node: FaNodeJs,
  git: FaGitAlt, github: FaGithub,
  database: FaDatabase, sql: FaDatabase, mysql: FaDatabase,
  tailwind: SiTailwindcss, tailwindcss: SiTailwindcss,
  express: SiExpress, "express.js": SiExpress,
  mongodb: SiMongodb, mongo: SiMongodb,
  vite: SiVite,
  typescript: SiTypescript, ts: SiTypescript,
  vercel: SiVercel,
  "three.js": SiThreedotjs, threejs: SiThreedotjs,
  gsap: SiGreensock, greensock: SiGreensock,
  framer: SiFramer, "framer motion": SiFramer,
};
const getIcon = (name) => NAME_TO_ICON[name.toLowerCase()] || FaDatabase;

// Scale bubble sizes for smaller screens
function getBubbleSize(baseSize) {
  const w = window.innerWidth;
  if (w < 480) return Math.round(baseSize * 0.65);
  if (w < 768) return Math.round(baseSize * 0.8);
  return baseSize;
}

const CAT_SIZE = { Frontend: 78, Backend: 74, Database: 70, DevOps: 66, Design: 66, Other: 62 };

// Arena height responsive to viewport
function getArenaHeight() {
  const w = window.innerWidth;
  if (w < 480) return 320;
  if (w < 768) return 380;
  return 460;
}

export default function SkillsSection() {
  const { isDark } = useTheme();
  const sectionRef = useRef(null);
  const arenaRef   = useRef(null);
  const bubblesRef = useRef([]);
  const rafRef     = useRef(null);
  const isDarkRef  = useRef(isDark);
  const [skills, setSkills] = useState([]);
  const [arenaHeight, setArenaHeight] = useState(getArenaHeight());

  useEffect(() => { isDarkRef.current = isDark; }, [isDark]);
  useEffect(() => { apiGetSkills().then(setSkills).catch(() => {}); }, []);

  const getBg = useCallback((color) => `${color}${isDarkRef.current ? "2e" : "1f"}`, []);

  const buildBubbles = useCallback(() => {
    const arena = arenaRef.current;
    if (!arena || skills.length === 0) return;
    arena.innerHTML = "";
    bubblesRef.current = [];
    const aW = arena.offsetWidth || 900;
    const aH = arena.offsetHeight || getArenaHeight();

    skills.forEach((sk) => {
      const size = getBubbleSize(CAT_SIZE[sk.category] || 66);
      const x = 10 + Math.random() * (aW - size - 20);
      const y = 10 + Math.random() * (aH - size - 20);

      const el = document.createElement("div");
      el.className = "bubble";
      el.style.cssText = `width:${size}px;height:${size}px;background:${getBg(sk.color)};border:1.5px solid ${sk.color}88;color:${sk.color};cursor:default;`;
      arena.appendChild(el);

      const IconComp = getIcon(sk.name);
      createRoot(el).render(
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", pointerEvents: "none" }}>
          <IconComp style={{ fontSize: Math.round(size * 0.36) + "px", color: sk.color }} />
          <span style={{ fontSize: Math.max(7, Math.round(size * 0.17)) + "px", fontFamily: "monospace", fontWeight: 600, color: sk.color, marginTop: "4px", lineHeight: 1 }}>{sk.name}</span>
        </div>
      );

      const angle = Math.random() * Math.PI * 2;
      const speed = 0.25 + Math.random() * 0.35;
      const b = { el, sk: { ...sk, size }, x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, hovered: false, pulse: Math.random() * Math.PI * 2 };
      bubblesRef.current.push(b);
      el.addEventListener("mouseenter", () => { b.hovered = true; });
      el.addEventListener("mouseleave", () => { b.hovered = false; });
    });
  }, [skills, getBg]);

  const animate = useCallback(() => {
    const arena = arenaRef.current;
    if (!arena) return;
    const aW = arena.offsetWidth || 900;
    const aH = arena.offsetHeight || getArenaHeight();

    bubblesRef.current.forEach((b) => {
      b.pulse += 0.025;
      if (b.hovered) { b.vx += (Math.random() - 0.5) * 0.35; b.vy += (Math.random() - 0.5) * 0.35; }
      const maxSpd = b.hovered ? 3.2 : 0.6;
      const spd = Math.sqrt(b.vx ** 2 + b.vy ** 2);
      if (spd > maxSpd) { b.vx *= maxSpd / spd; b.vy *= maxSpd / spd; }
      if (!b.hovered && spd < 0.18) { const a = Math.random() * Math.PI * 2; b.vx = Math.cos(a) * 0.22; b.vy = Math.sin(a) * 0.22; }
      b.x += b.vx; b.y += b.vy;
      if (b.x < 2)                   { b.x = 2;                  b.vx =  Math.abs(b.vx); }
      if (b.x > aW - b.sk.size - 2)  { b.x = aW - b.sk.size - 2; b.vx = -Math.abs(b.vx); }
      if (b.y < 2)                   { b.y = 2;                  b.vy =  Math.abs(b.vy); }
      if (b.y > aH - b.sk.size - 2)  { b.y = aH - b.sk.size - 2; b.vy = -Math.abs(b.vy); }
      bubblesRef.current.forEach((o) => {
        if (o === b) return;
        const dx = (b.x + b.sk.size / 2) - (o.x + o.sk.size / 2);
        const dy = (b.y + b.sk.size / 2) - (o.y + o.sk.size / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minD = (b.sk.size + o.sk.size) / 2 + 4;
        if (dist < minD && dist > 0) { const f = (minD - dist) / minD * 0.12; b.vx += (dx / dist) * f; b.vy += (dy / dist) * f; }
      });
      b.el.style.transform  = `translate(${b.x}px,${b.y}px) scale(${b.hovered ? 1.2 : (1 + Math.sin(b.pulse) * 0.025)})`;
      b.el.style.boxShadow  = b.hovered ? `0 10px 30px ${b.sk.color}66` : `0 3px 12px ${b.sk.color}22`;
      b.el.style.background = getBg(b.sk.color);
    });
    rafRef.current = requestAnimationFrame(animate);
  }, [getBg]);

  useEffect(() => {
    if (!skills.length) return;
    const handleResize = () => {
      setArenaHeight(getArenaHeight());
      cancelAnimationFrame(rafRef.current);
      buildBubbles();
      rafRef.current = requestAnimationFrame(animate);
    };
    buildBubbles();
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animate);
    window.addEventListener("resize", handleResize);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", handleResize); };
  }, [skills, buildBubbles, animate]);

  const t = (l, d) => isDark ? d : l;

  return (
    <section
      id="skills"
      ref={sectionRef}
      style={{ position: "relative", overflow: "hidden", background: "transparent", padding: "90px clamp(18px, 5vw, 40px) 70px" }}
    >
      <AnimatedBackground sectionRef={sectionRef} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: "1100px", margin: "0 auto" }}>
        <div className="reveal">
          <AKLogo />
          <p style={{ fontSize: "11px", fontFamily: "monospace", letterSpacing: "3px", textTransform: "uppercase", color: "#5ba898", marginBottom: "8px" }}>What I Know</p>
          <h2 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 700, fontFamily: "Georgia,serif", letterSpacing: "-0.5px", marginBottom: "10px", color: t("#1a1208", "#e4e6eb"), transition: "color 0.6s" }}>
            My <span className="grad-text">Skills</span>
          </h2>
          <div style={{ width: "48px", height: "3px", borderRadius: "2px", background: "linear-gradient(90deg,#5ba898,#d4935a)", marginBottom: "36px" }} />
        </div>

        <div className="reveal">
          <div style={{ position: "relative", borderRadius: "18px" }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "18px", background: "linear-gradient(90deg,transparent,rgba(91,168,152,0.6),rgba(212,147,90,0.6),rgba(201,106,106,0.6),rgba(122,170,106,0.6),rgba(138,122,184,0.6),rgba(91,168,152,0.6),transparent)", backgroundSize: "200% 100%", animation: "borderSlide 6s linear infinite" }} />
            <div
              ref={arenaRef}
              style={{
                position: "relative",
                zIndex: 1,
                margin: "2px",
                borderRadius: "16px",
                width: "calc(100% - 4px)",
                height: arenaHeight + "px",
                overflow: "hidden",
                background: t("rgba(255,253,247,0.7)", "rgba(36,37,38,0.7)"),
                transition: "background 0.6s",
              }}
            >
              {skills.length === 0 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#5ba898", fontFamily: "monospace", fontSize: "13px" }}>
                  Loading skills…
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="bottom-bar" style={{ marginTop: "50px" }} />
      </div>
      <style>{`@keyframes borderSlide{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </section>
  );
}