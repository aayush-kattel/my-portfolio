import { useState, useRef, useEffect, useCallback } from "react";

/* ─────────────────────── Mock API ─────────────────────────────── */
const delay = (ms) => new Promise(r => setTimeout(r, ms));
const mockProfile = { name: "Aayush Kattel", role: "Full Stack Developer", location: "Kathmandu, Nepal", status: "Open to work", email: "aayush@email.com", github: "https://github.com/aayush", linkedin: "https://linkedin.com/in/aayush", facebook: "https://facebook.com/aayush", bio: "Passionate full-stack developer crafting elegant digital experiences. Obsessed with clean code and beautiful UIs.", stats: { totalProjects: "12+", profileViews: "2.4k", skillsListed: "24" }, logoUrl: "" };
const mockSkills = [ { _id: "1", name: "React", category: "Frontend", color: "#5ba898" }, { _id: "2", name: "TypeScript", category: "Frontend", color: "#d4935a" }, { _id: "3", name: "Next.js", category: "Frontend", color: "#8a7ab8" }, { _id: "4", name: "Node.js", category: "Backend", color: "#7aaa6a" }, { _id: "5", name: "Express", category: "Backend", color: "#5ba898" }, { _id: "6", name: "MongoDB", category: "Database", color: "#d4935a" }, { _id: "7", name: "PostgreSQL", category: "Database", color: "#c96a6a" }, { _id: "8", name: "Docker", category: "Tools", color: "#64a0c8" }, { _id: "9", name: "Git", category: "Tools", color: "#7aaa6a" }, { _id: "10", name: "Tailwind CSS", category: "Frontend", color: "#c96a6a" }, { _id: "11", name: "GSAP", category: "Animation", color: "#8a7ab8" }, { _id: "12", name: "Framer Motion", category: "Animation", color: "#d4935a" }, ];
const mockProjects = [ { _id: "1", name: "Portfolio CMS", description: "A full-stack portfolio management system with real-time updates and admin panel.", stack: "MERN", tags: ["React", "Node.js", "MongoDB"], liveUrl: "https://example.com", githubUrl: "https://github.com/example", imageUrl: "", status: "Live", featured: true }, { _id: "2", name: "E-Commerce Platform", description: "Scalable e-commerce solution with payment integration and inventory management.", stack: "Next.js + Stripe", tags: ["Next.js", "Stripe", "PostgreSQL"], liveUrl: "", githubUrl: "https://github.com/example2", imageUrl: "", status: "WIP", featured: false }, { _id: "3", name: "Task Management App", description: "Collaborative task board with real-time sync and team features.", stack: "React + Socket.io", tags: ["React", "Socket.io", "Redis"], liveUrl: "", githubUrl: "", imageUrl: "", status: "Draft", featured: false }, ];
const mockEducation = [ { _id: "1", degree: "Bachelor of Information Technology", institution: "Tribhuvan University", location: "Kathmandu, Nepal", startYear: "2020", endYear: "2024", description: "Focus on software engineering, data structures, and web technologies." }, { _id: "2", degree: "Higher Secondary Education", institution: "National College", location: "Kathmandu, Nepal", startYear: "2018", endYear: "2020", description: "" }, ];
const mockExperience = [ { _id: "1", title: "Full Stack Developer", company: "TechCorp Nepal", location: "Kathmandu", type: "Full-time", startDate: "Jan 2024", endDate: "Present", description: "Building scalable web applications and APIs. Leading frontend architecture decisions and mentoring junior developers." }, { _id: "2", title: "Frontend Developer Intern", company: "StartupXYZ", location: "Remote", type: "Internship", startDate: "Jun 2023", endDate: "Dec 2023", description: "Developed React components and improved UI performance by 40%." }, ];
const mockMessages = [ { _id: "1", name: "Sarah Johnson", email: "sarah@example.com", subject: "Project Collaboration", message: "Hi Aayush! I came across your portfolio and I'm really impressed by your work. I'd love to discuss a potential collaboration on a new project. Would you be available for a quick call this week?", read: false, createdAt: new Date(Date.now() - 3600000).toISOString() }, { _id: "2", name: "Mark Chen", email: "mark@techco.com", subject: "Job Opportunity", message: "We have an exciting full-stack position at TechCo that we think would be a great fit for your skills. The role involves building large-scale React applications. Let me know if you're interested!", read: false, createdAt: new Date(Date.now() - 86400000).toISOString() }, { _id: "3", name: "Priya Sharma", email: "priya@design.io", subject: "Freelance Project", message: "Hello! I need a developer to build a portfolio website similar to yours. Are you available for freelance work? Budget is flexible.", read: true, createdAt: new Date(Date.now() - 172800000).toISOString() }, { _id: "4", name: "Alex Rivera", email: "alex@startup.com", subject: "Open Source Contribution", message: "Saw your GitHub repos — great work! Would love to have you contribute to our open source project.", read: true, createdAt: new Date(Date.now() - 259200000).toISOString() }, ];

let _profile = { ...mockProfile };
let _skills = [...mockSkills];
let _projects = [...mockProjects];
let _education = [...mockEducation];
let _experience = [...mockExperience];
let _messages = [...mockMessages];
let _idCounter = 100;
const newId = () => String(++_idCounter);

const api = {
  getProfile: async () => { await delay(300); return { ..._profile }; },
  updateProfile: async (d) => { await delay(400); _profile = { ..._profile, ...d }; return { ..._profile }; },
  getSkills: async () => { await delay(300); return [..._skills]; },
  addSkill: async (d) => { await delay(300); const s = { ...d, _id: newId() }; _skills.push(s); return s; },
  deleteSkill: async (id) => { await delay(200); _skills = _skills.filter(s => s._id !== id); },
  getProjects: async () => { await delay(300); return [..._projects]; },
  addProject: async (d) => { await delay(400); const p = { ...d, _id: newId() }; _projects.push(p); return p; },
  updateProject: async (id, d) => { await delay(400); _projects = _projects.map(p => p._id === id ? { ...p, ...d } : p); return _projects.find(p => p._id === id); },
  deleteProject: async (id) => { await delay(200); _projects = _projects.filter(p => p._id !== id); },
  getEducation: async () => { await delay(300); return [..._education]; },
  addEducation: async (d) => { await delay(300); const e = { ...d, _id: newId() }; _education.push(e); return e; },
  updateEducation: async (id, d) => { await delay(300); _education = _education.map(e => e._id === id ? { ...e, ...d } : e); return _education.find(e => e._id === id); },
  deleteEducation: async (id) => { await delay(200); _education = _education.filter(e => e._id !== id); },
  getExperience: async () => { await delay(300); return [..._experience]; },
  addExperience: async (d) => { await delay(300); const e = { ...d, _id: newId() }; _experience.push(e); return e; },
  updateExperience: async (id, d) => { await delay(300); _experience = _experience.map(e => e._id === id ? { ...e, ...d } : e); return _experience.find(e => e._id === id); },
  deleteExperience: async (id) => { await delay(200); _experience = _experience.filter(e => e._id !== id); },
  getMessages: async () => { await delay(300); return [..._messages]; },
  markRead: async (id) => { await delay(200); _messages = _messages.map(m => m._id === id ? { ...m, read: true } : m); },
  deleteMessage: async (id) => { await delay(200); _messages = _messages.filter(m => m._id !== id); },
};

/* ─────────────────────── Icons (inline SVG) ───────────────────── */
const Icon = ({ name, size = 16, style = {} }) => {
  const icons = {
    gauge: "M12 2a10 10 0 1 0 10 10M12 12l4-8",
    user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
    folder: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z",
    mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
    gear: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
    logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
    plus: "M12 5v14M5 12h14",
    trash: "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
    edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
    check: "M20 6L9 17l-5-5",
    x: "M18 6L6 18M6 6l12 12",
    bars: "M3 12h18M3 6h18M3 18h18",
    layers: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
    graduation: "M22 10v6M6 12v5c3 3 9 3 12 0v-5M12 2L2 7l10 5 10-5-10-5z",
    briefcase: "M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16",
    inbox: "M22 12h-6l-2 3h-4l-2-3H2M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 17.31 4H6.69a2 2 0 0 0-1.24.11z",
    key: "M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4",
    spinner: "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83",
    image: "M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM21 15l-5-5L5 21",
    upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
    pdf: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M9 13h6M9 17h6M9 9h1",
    eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
    arrowLeft: "M19 12H5M12 19l-7-7 7-7",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d={icons[name] || ""} />
    </svg>
  );
};

/* ─────────────────────── Theme ────────────────────────────────── */
const useTheme = () => {
  const [isDark, setIsDark] = useState(() => window.matchMedia("(prefers-color-scheme: dark)").matches);
  const toggle = () => setIsDark(d => !d);
  return { isDark, toggle };
};

/* ─────────────────────── Toast ────────────────────────────────── */
function useToast() {
  const [toast, setToast] = useState({ msg: "", type: "success" });
  const show = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "success" }), 3000);
  }, []);
  return [toast, show];
}

function Toast({ msg, type }) {
  if (!msg) return null;
  return (
    <div style={{
      position: "fixed", top: 20, right: 20, zIndex: 99999,
      padding: "12px 20px", borderRadius: 12,
      background: type === "success" ? "linear-gradient(135deg,#5ba898,#4a9080)" : "linear-gradient(135deg,#c96a6a,#a85555)",
      color: "#fff", fontSize: 13, fontFamily: "monospace", fontWeight: 600,
      boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
      animation: "toastIn .3s ease",
    }}>{msg}</div>
  );
}

/* ─────────────────────── Shared UI ────────────────────────────── */
function Btn({ onClick, children, color = "#5ba898", small, danger, disabled, style = {} }) {
  const bg = danger ? "#c96a6a" : color;
  return (
    <button onClick={onClick} disabled={disabled} style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: small ? "6px 12px" : "9px 18px", borderRadius: 8, border: "none",
      cursor: disabled ? "not-allowed" : "pointer", background: bg, color: "#fff",
      fontSize: small ? 11 : 12, fontFamily: "monospace", fontWeight: 600,
      opacity: disabled ? 0.6 : 1, transition: "opacity .2s,transform .1s",
      whiteSpace: "nowrap", ...style,
    }}
      onMouseEnter={e => !disabled && (e.currentTarget.style.opacity = ".82")}
      onMouseLeave={e => !disabled && (e.currentTarget.style.opacity = "1")}
    >{children}</button>
  );
}

function Input({ label, value, onChange, placeholder = "", type = "text", textarea, style = {}, isDark }) {
  const border = isDark ? "rgba(228,230,235,0.12)" : "rgba(26,18,8,0.12)";
  const base = {
    width: "100%", padding: "9px 12px", borderRadius: 8,
    border: `1px solid ${border}`,
    background: isDark ? "rgba(255,255,255,0.05)" : "#fff",
    color: isDark ? "#e4e6eb" : "#1a1208",
    fontSize: 13, fontFamily: "monospace", outline: "none",
    resize: "vertical", transition: "border .2s,box-shadow .2s", boxSizing: "border-box", ...style,
  };
  const focus = e => { e.target.style.borderColor = "#5ba898"; e.target.style.boxShadow = "0 0 0 3px rgba(91,168,152,0.12)"; };
  const blur = e => { e.target.style.borderColor = border; e.target.style.boxShadow = "none"; };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, flex: 1 }}>
      {label && <label style={{ fontSize: 10, fontFamily: "monospace", letterSpacing: "1.5px", textTransform: "uppercase", color: "#5ba898" }}>{label}</label>}
      {textarea
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ ...base, minHeight: 80 }} onFocus={focus} onBlur={blur} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={base} onFocus={focus} onBlur={blur} />
      }
    </div>
  );
}

function Select({ label, value, onChange, options, isDark }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const getLabel = () => { const o = options.find(o => (typeof o === "object" ? o.value : o) === value); return o ? (typeof o === "object" ? o.label : o) : value; };
  return (
    <div ref={ref} style={{ display: "flex", flexDirection: "column", gap: 5, flex: 1, position: "relative" }}>
      {label && <label style={{ fontSize: 10, fontFamily: "monospace", letterSpacing: "1.5px", textTransform: "uppercase", color: "#5ba898" }}>{label}</label>}
      <div onClick={() => setOpen(o => !o)} style={{
        padding: "9px 12px", borderRadius: 8, cursor: "pointer",
        border: `1px solid ${isDark ? "rgba(228,230,235,0.12)" : "rgba(26,18,8,0.12)"}`,
        background: isDark ? "rgba(255,255,255,0.05)" : "#fff",
        color: isDark ? "#e4e6eb" : "#1a1208",
        fontSize: 13, fontFamily: "monospace",
        display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: 38,
      }}>
        <span>{getLabel()}</span>
        <span style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s", fontSize: 10 }}>▼</span>
      </div>
      {open && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4,
          background: isDark ? "#2a2b2c" : "#fff",
          border: `1px solid ${isDark ? "rgba(228,230,235,0.12)" : "rgba(26,18,8,0.12)"}`,
          borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.15)", zIndex: 9999,
          maxHeight: 200, overflowY: "auto",
        }}>
          {options.map((o, i) => {
            const v = typeof o === "object" ? o.value : o;
            const l = typeof o === "object" ? o.label : o;
            const sel = v === value;
            return (
              <div key={v} onClick={() => { onChange(v); setOpen(false); }} style={{
                padding: "10px 12px", cursor: "pointer",
                background: sel ? (isDark ? "rgba(91,168,152,0.2)" : "rgba(91,168,152,0.12)") : "transparent",
                color: sel ? "#5ba898" : (isDark ? "#e4e6eb" : "#1a1208"),
                fontFamily: "monospace", fontSize: 13,
                borderBottom: i < options.length - 1 ? `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(26,18,8,0.05)"}` : "none",
              }}
                onMouseEnter={e => { if (!sel) e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.05)" : "rgba(26,18,8,0.04)"; }}
                onMouseLeave={e => { if (!sel) e.currentTarget.style.background = "transparent"; }}
              >{l}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Card({ children, title, accent = "#5ba898", isDark, style = {} }) {
  return (
    <div style={{ position: "relative", borderRadius: 18, marginBottom: 20, ...style }}>
      <div style={{
        position: "absolute", inset: 0, borderRadius: 18,
        background: "linear-gradient(90deg,transparent,#5ba898,#d4935a,#c96a6a,#7aaa6a,#8a7ab8,#5ba898,transparent)",
        backgroundSize: "200% 100%", animation: "borderSlide 3s linear infinite",
      }} />
      <div style={{
        position: "relative", zIndex: 1, margin: 2, borderRadius: 16,
        padding: "22px 24px",
        background: isDark ? "rgba(28,29,30,0.96)" : "rgba(255,253,247,0.96)",
        backdropFilter: "blur(12px)",
      }}>
        {title && <div style={{ fontSize: 10, fontFamily: "monospace", letterSpacing: "2px", textTransform: "uppercase", color: accent, marginBottom: 16 }}>{title}</div>}
        {children}
      </div>
    </div>
  );
}

function SectionHeader({ title, sub, isDark }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <p style={{ fontSize: 10, fontFamily: "monospace", letterSpacing: "3px", textTransform: "uppercase", color: "#5ba898", marginBottom: 4 }}>{sub}</p>
      <h2 style={{
        fontSize: "clamp(22px,3vw,30px)", fontWeight: 700, fontFamily: "Georgia,serif",
        margin: 0, background: "linear-gradient(90deg,#5ba898,#d4935a)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
      }}>{title}</h2>
      <div style={{ width: 40, height: 3, borderRadius: 2, background: "linear-gradient(90deg,#5ba898,#d4935a)", marginTop: 8 }} />
    </div>
  );
}

function SpinnerIcon() {
  return <Icon name="spinner" size={14} style={{ animation: "spin 1s linear infinite" }} />;
}

/* ─────────────────────── Nav config ───────────────────────────── */
const NAV = [
  { id: "overview",   label: "Overview",   icon: "gauge" },
  { id: "about",      label: "About",      icon: "user" },
  { id: "skills",     label: "Skills",     icon: "layers" },
  { id: "projects",   label: "Projects",   icon: "folder" },
  { id: "education",  label: "Education",  icon: "graduation" },
  { id: "experience", label: "Experience", icon: "briefcase" },
  { id: "messages",   label: "Messages",   icon: "inbox" },
  { id: "settings",   label: "Settings",   icon: "gear" },
];

/* ═══════════════════════ PAGES ════════════════════════════════════ */

/* ── Overview ── */
function OverviewPage({ isDark }) {
  const t = (l, d) => isDark ? d : l;
  const [counts, setCounts] = useState({ projects: 0, messages: 0, unread: 0, skills: 0 });
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([api.getMessages(), api.getSkills(), api.getProjects()]).then(([mR, sR, pR]) => {
      const msgs = mR.status === "fulfilled" ? mR.value : [];
      const skills = sR.status === "fulfilled" ? sR.value : [];
      const projects = pR.status === "fulfilled" ? pR.value : [];
      setMessages(msgs);
      setCounts({ projects: projects.length, messages: msgs.length, unread: msgs.filter(m => !m.read).length, skills: skills.length });
      setLoading(false);
    });
  }, []);

  const stats = [
    { label: "Total Projects", value: loading ? "…" : counts.projects, delta: "in portfolio", accent: "#5ba898" },
    { label: "Messages", value: loading ? "…" : counts.messages, delta: `${counts.unread} unread`, accent: "#d4935a" },
    { label: "Skills Listed", value: loading ? "…" : counts.skills, delta: "across categories", accent: "#8a7ab8" },
    { label: "Profile Views", value: "—", delta: "not tracked", accent: "#c96a6a" },
  ];

  return (
    <div>
      <SectionHeader title="Overview" sub="Dashboard at a glance" isDark={isDark} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 14, marginBottom: 28 }}>
        {stats.map(({ label, value, delta, accent }) => (
          <div key={label} style={{
            padding: "20px 18px", borderRadius: 14,
            background: t("rgba(255,253,247,0.88)", "rgba(36,37,38,0.88)"),
            border: `1px solid ${t("rgba(26,18,8,0.07)", "rgba(255,255,255,0.07)")}`,
          }}>
            <div style={{ fontSize: 10, fontFamily: "monospace", letterSpacing: "2px", textTransform: "uppercase", color: accent, marginBottom: 8 }}>{label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "Georgia,serif", color: t("#1a1208", "#e4e6eb"), lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 11, marginTop: 5, color: t("rgba(26,18,8,0.4)", "rgba(228,230,235,0.4)") }}>{delta}</div>
          </div>
        ))}
      </div>
      <Card title="Recent Messages" isDark={isDark}>
        {loading && <p style={{ fontSize: 13, color: "#5ba898", fontFamily: "monospace" }}>Loading…</p>}
        {!loading && messages.length === 0 && <p style={{ fontSize: 13, color: t("rgba(26,18,8,0.4)", "rgba(228,230,235,0.4)") }}>No messages yet.</p>}
        {messages.slice(0, 5).map(m => (
          <div key={m._id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: `1px solid ${t("rgba(26,18,8,0.05)", "rgba(255,255,255,0.05)")}` }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: m.read ? "transparent" : "#5ba898", border: m.read ? `1px solid ${t("rgba(26,18,8,0.2)", "rgba(255,255,255,0.2)")}` : undefined, flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 13, color: t("#1a1208", "#e4e6eb"), fontWeight: m.read ? 400 : 600 }}>{m.name}</span>
            <span style={{ fontSize: 11, color: t("rgba(26,18,8,0.4)", "rgba(228,230,235,0.4)"), fontFamily: "monospace" }}>{m.subject || "No subject"}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

/* ── About ── */
function AboutPage({ isDark }) {
  const t = (l, d) => isDark ? d : l;
  const [profile, setProfile] = useState({});
  const [saving, setSaving] = useState(false);
  const [toast, showToast] = useToast();

  useEffect(() => { api.getProfile().then(setProfile); }, []);
  const setField = (k, v) => setProfile(p => ({ ...p, [k]: v }));
  const setStats = (k, v) => setProfile(p => ({ ...p, stats: { ...p.stats, [k]: v } }));

  const save = async () => {
    setSaving(true);
    try { await api.updateProfile(profile); showToast("Profile saved ✓"); }
    catch (e) { showToast(e.message, "error"); }
    finally { setSaving(false); }
  };

  const grid2 = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12, marginBottom: 12 };

  return (
    <div>
      <Toast {...toast} />
      <SectionHeader title="About" sub="Manage your profile" isDark={isDark} />

      <Card title="Bio" isDark={isDark}>
        <div style={grid2}>
          <Input label="Name" value={profile.name || ""} onChange={v => setField("name", v)} placeholder="Aayush Kattel" isDark={isDark} />
          <Input label="Role" value={profile.role || ""} onChange={v => setField("role", v)} placeholder="Full Stack Developer" isDark={isDark} />
          <Input label="Location" value={profile.location || ""} onChange={v => setField("location", v)} placeholder="Kathmandu, Nepal" isDark={isDark} />
          <Input label="Status" value={profile.status || ""} onChange={v => setField("status", v)} placeholder="Open to work" isDark={isDark} />
          <Input label="Email" value={profile.email || ""} onChange={v => setField("email", v)} placeholder="you@email.com" type="email" isDark={isDark} />
          <Input label="GitHub" value={profile.github || ""} onChange={v => setField("github", v)} placeholder="https://github.com/..." isDark={isDark} />
          <Input label="LinkedIn" value={profile.linkedin || ""} onChange={v => setField("linkedin", v)} placeholder="https://linkedin.com/in/..." isDark={isDark} />
          <Input label="Facebook" value={profile.facebook || ""} onChange={v => setField("facebook", v)} placeholder="https://facebook.com/..." isDark={isDark} />
        </div>
        <Input label="Bio / Summary" value={profile.bio || ""} onChange={v => setField("bio", v)} placeholder="Write a short bio..." textarea isDark={isDark} />
      </Card>

      <Card title="At a Glance Stats" isDark={isDark}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12 }}>
          <Input label="Projects" value={profile.stats?.totalProjects || ""} onChange={v => setStats("totalProjects", v)} placeholder="10+" isDark={isDark} />
          <Input label="Profile Views" value={profile.stats?.profileViews || ""} onChange={v => setStats("profileViews", v)} placeholder="1.2k" isDark={isDark} />
          <Input label="Skills Listed" value={profile.stats?.skillsListed || ""} onChange={v => setStats("skillsListed", v)} placeholder="20" isDark={isDark} />
        </div>
      </Card>

      <Btn onClick={save} disabled={saving}>{saving ? <><SpinnerIcon /> Saving…</> : <><Icon name="check" size={13} /> Save Profile</>}</Btn>
    </div>
  );
}

/* ── Skills ── */
function SkillsPage({ isDark }) {
  const t = (l, d) => isDark ? d : l;
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", category: "Frontend", color: "#5ba898" });
  const [toast, showToast] = useToast();

  const CATS = ["Frontend", "Animation", "Backend", "Database", "Tools", "Other"];
  const COLORS = ["#5ba898", "#d4935a", "#c96a6a", "#7aaa6a", "#8a7ab8", "#64a0c8"];

  useEffect(() => { api.getSkills().then(setSkills).finally(() => setLoading(false)); }, []);

  const add = async () => {
    if (!form.name.trim()) return;
    try { const s = await api.addSkill(form); setSkills(p => [...p, s]); setForm(f => ({ ...f, name: "" })); showToast("Skill added ✓"); }
    catch (e) { showToast(e.message, "error"); }
  };

  const del = async (id) => {
    try { await api.deleteSkill(id); setSkills(p => p.filter(s => s._id !== id)); showToast("Skill removed"); }
    catch (e) { showToast(e.message, "error"); }
  };

  const grouped = CATS.reduce((acc, cat) => { acc[cat] = skills.filter(s => s.category === cat); return acc; }, {});

  return (
    <div>
      <Toast {...toast} />
      <SectionHeader title="Skills" sub="Manage skill bubbles" isDark={isDark} />
      <Card title="Add Skill" isDark={isDark} style={{ zIndex: 10, position: "relative" }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
          <Input label="Skill Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="e.g. React" isDark={isDark} style={{ minWidth: 140 }} />
          <Select label="Category" value={form.category} onChange={v => setForm(f => ({ ...f, category: v }))} options={CATS} isDark={isDark} />
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: 10, fontFamily: "monospace", letterSpacing: "1.5px", textTransform: "uppercase", color: "#5ba898" }}>Color</label>
            <div style={{ display: "flex", gap: 6, paddingTop: 2 }}>
              {COLORS.map(c => (
                <div key={c} onClick={() => setForm(f => ({ ...f, color: c }))} style={{
                  width: 22, height: 22, borderRadius: "50%", background: c, cursor: "pointer",
                  border: form.color === c ? "3px solid #fff" : "2px solid transparent",
                  outline: form.color === c ? `2px solid ${c}` : "none", transition: "all .15s",
                }} />
              ))}
            </div>
          </div>
          <Btn onClick={add}><Icon name="plus" size={13} /> Add Skill</Btn>
        </div>
      </Card>
      {loading ? <div style={{ color: "#5ba898", fontFamily: "monospace", fontSize: 13 }}>Loading…</div>
        : CATS.map(cat => grouped[cat].length > 0 && (
          <Card key={cat} title={cat} isDark={isDark}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {grouped[cat].map(s => (
                <div key={s._id} style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 20,
                  background: `${s.color}22`, border: `1px solid ${s.color}55`,
                  color: s.color, fontSize: 12, fontFamily: "monospace", fontWeight: 600,
                }}>
                  {s.name}
                  <button onClick={() => del(s._id)} style={{ background: "none", border: "none", cursor: "pointer", color: s.color, display: "flex", alignItems: "center", padding: 0, opacity: .7 }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "1"} onMouseLeave={e => e.currentTarget.style.opacity = ".7"}>
                    <Icon name="x" size={11} />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        ))}
    </div>
  );
}

/* ── Projects ── */
function ProjectsPage({ isDark }) {
  const t = (l, d) => isDark ? d : l;
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [toast, showToast] = useToast();

  const empty = { name: "", description: "", stack: "", tags: "", liveUrl: "", githubUrl: "", imageUrl: "", status: "Draft", featured: false };
  const [form, setForm] = useState(empty);
  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => { api.getProjects().then(setProjects).finally(() => setLoading(false)); }, []);

  const openForm = (project = null) => {
    if (project) { setForm({ ...project, tags: Array.isArray(project.tags) ? project.tags.join(", ") : project.tags || "" }); setEditId(project._id); }
    else { setForm(empty); setEditId(null); }
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditId(null); setForm(empty); };

  const submit = async () => {
    if (!form.name.trim()) return;
    setUploading(true);
    try {
      if (editId) { const u = await api.updateProject(editId, form); setProjects(p => p.map(pr => pr._id === editId ? u : pr)); showToast("Project updated ✓"); }
      else { const c = await api.addProject(form); setProjects(p => [...p, c]); showToast("Project added ✓"); }
      closeForm();
    } catch (e) { showToast(e.message, "error"); }
    finally { setUploading(false); }
  };

  const del = async (id) => {
    try { await api.deleteProject(id); setProjects(p => p.filter(pr => pr._id !== id)); showToast("Deleted"); }
    catch (e) { showToast(e.message, "error"); }
  };

  const SC = { Live: "#5ba898", WIP: "#d4935a", Draft: "#8a7ab8", Archived: "#c96a6a" };

  return (
    <div>
      <Toast {...toast} />
      <SectionHeader title="Projects" sub="Manage your work" isDark={isDark} />
      <div style={{ marginBottom: 16 }}>
        <Btn onClick={() => showForm ? closeForm() : openForm()}>{showForm ? <><Icon name="x" size={13} /> Cancel</> : <><Icon name="plus" size={13} /> Add Project</>}</Btn>
      </div>
      {showForm && (
        <Card title={editId ? "Edit Project" : "New Project"} isDark={isDark}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12, marginBottom: 12 }}>
            <Input label="Project Name" value={form.name} onChange={v => setF("name", v)} placeholder="My App" isDark={isDark} />
            <Input label="Stack" value={form.stack} onChange={v => setF("stack", v)} placeholder="MERN" isDark={isDark} />
            <Input label="Live URL" value={form.liveUrl} onChange={v => setF("liveUrl", v)} placeholder="https://..." isDark={isDark} />
            <Input label="GitHub URL" value={form.githubUrl} onChange={v => setF("githubUrl", v)} placeholder="https://github.com/..." isDark={isDark} />
            <Input label="Tags (comma separated)" value={form.tags} onChange={v => setF("tags", v)} placeholder="React, Node.js" isDark={isDark} />
            <Select label="Status" value={form.status} onChange={v => setF("status", v)} options={["Live", "WIP", "Draft", "Archived"]} isDark={isDark} />
          </div>
          <Input label="Description" value={form.description} onChange={v => setF("description", v)} placeholder="What does this project do?" textarea isDark={isDark} style={{ marginBottom: 14 }} />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Btn onClick={submit} disabled={uploading}>{uploading ? <><SpinnerIcon /> Saving…</> : <><Icon name="check" size={13} /> {editId ? "Update" : "Save"} Project</>}</Btn>
            <Btn onClick={closeForm} color="#8a7ab8">Cancel</Btn>
          </div>
        </Card>
      )}
      {loading ? <div style={{ color: "#5ba898", fontFamily: "monospace", fontSize: 13 }}>Loading…</div>
        : projects.length === 0
          ? <Card isDark={isDark}><p style={{ fontSize: 13, color: t("rgba(26,18,8,0.4)", "rgba(228,230,235,0.4)") }}>No projects yet.</p></Card>
          : projects.map(p => (
            <Card key={p._id} isDark={isDark}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 15, fontWeight: 700, fontFamily: "Georgia,serif", color: t("#1a1208", "#e4e6eb") }}>{p.name}</span>
                    <span style={{ fontSize: 10, fontFamily: "monospace", padding: "2px 9px", borderRadius: 20, background: `${SC[p.status] || "#5ba898"}22`, color: SC[p.status] || "#5ba898", border: `1px solid ${SC[p.status] || "#5ba898"}44` }}>{p.status}</span>
                    {p.stack && <span style={{ fontSize: 10, fontFamily: "monospace", color: t("rgba(26,18,8,0.4)", "rgba(228,230,235,0.4)") }}>{p.stack}</span>}
                  </div>
                  {p.description && <p style={{ fontSize: 12, lineHeight: 1.7, color: t("rgba(26,18,8,0.55)", "rgba(228,230,235,0.5)"), margin: "0 0 8px" }}>{p.description}</p>}
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
                    {(Array.isArray(p.tags) ? p.tags : String(p.tags || "").split(",").filter(Boolean)).map(tag => (
                      <span key={tag} style={{ fontSize: 10, fontFamily: "monospace", padding: "2px 8px", borderRadius: 10, background: "rgba(91,168,152,0.1)", color: "#5ba898" }}>{tag.trim()}</span>
                    ))}
                  </div>
                  {(p.liveUrl || p.githubUrl) && (
                    <div style={{ display: "flex", gap: 10 }}>
                      {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "#5ba898", fontFamily: "monospace" }}>↗ Live</a>}
                      {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "#8a7ab8", fontFamily: "monospace" }}>↗ GitHub</a>}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <Btn small onClick={() => openForm(p)} color="#8a7ab8"><Icon name="edit" size={12} /></Btn>
                  <Btn small onClick={() => del(p._id)} danger><Icon name="trash" size={12} /></Btn>
                </div>
              </div>
            </Card>
          ))}
    </div>
  );
}

/* ── Education ── */
function EducationPage({ isDark }) {
  const t = (l, d) => isDark ? d : l;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [toast, showToast] = useToast();

  const empty = { degree: "", institution: "", location: "", startYear: "", endYear: "Present", description: "" };
  const [form, setForm] = useState(empty);
  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => { api.getEducation().then(setItems).finally(() => setLoading(false)); }, []);

  const openForm = (item = null) => { if (item) { setForm({ ...item }); setEditId(item._id); } else { setForm(empty); setEditId(null); } setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditId(null); setForm(empty); };

  const submit = async () => {
    if (!form.degree.trim() || !form.institution.trim() || !form.startYear.trim()) { showToast("Degree, institution & start year required", "error"); return; }
    try {
      if (editId) { const u = await api.updateEducation(editId, form); setItems(p => p.map(i => i._id === editId ? u : i)); showToast("Updated ✓"); }
      else { const c = await api.addEducation(form); setItems(p => [...p, c]); showToast("Added ✓"); }
      closeForm();
    } catch (e) { showToast(e.message, "error"); }
  };

  const del = async (id) => {
    try { await api.deleteEducation(id); setItems(p => p.filter(i => i._id !== id)); showToast("Removed"); }
    catch (e) { showToast(e.message, "error"); }
  };

  return (
    <div>
      <Toast {...toast} />
      <SectionHeader title="Education" sub="Manage education history" isDark={isDark} />
      <div style={{ marginBottom: 16 }}>
        <Btn onClick={() => showForm ? closeForm() : openForm()}>{showForm ? <><Icon name="x" size={13} /> Cancel</> : <><Icon name="plus" size={13} /> Add Education</>}</Btn>
      </div>
      {showForm && (
        <Card title={editId ? "Edit Education" : "New Entry"} isDark={isDark}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12, marginBottom: 12 }}>
            <Input label="Degree / Course" value={form.degree} onChange={v => setF("degree", v)} placeholder="Bachelor in IT" isDark={isDark} />
            <Input label="Institution" value={form.institution} onChange={v => setF("institution", v)} placeholder="Tribhuvan University" isDark={isDark} />
            <Input label="Location" value={form.location} onChange={v => setF("location", v)} placeholder="Kathmandu, Nepal" isDark={isDark} />
            <div />
            <Input label="Start Year" value={form.startYear} onChange={v => setF("startYear", v)} placeholder="2022" isDark={isDark} />
            <Input label="End Year" value={form.endYear} onChange={v => setF("endYear", v)} placeholder="Present" isDark={isDark} />
          </div>
          <Input label="Description (optional)" value={form.description} onChange={v => setF("description", v)} placeholder="Brief description…" textarea isDark={isDark} style={{ marginBottom: 14 }} />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Btn onClick={submit}><Icon name="check" size={13} /> {editId ? "Update" : "Save"}</Btn>
            <Btn onClick={closeForm} color="#8a7ab8">Cancel</Btn>
          </div>
        </Card>
      )}
      {loading ? <div style={{ color: "#5ba898", fontFamily: "monospace", fontSize: 13 }}>Loading…</div>
        : items.length === 0
          ? <Card isDark={isDark}><p style={{ fontSize: 13, color: t("rgba(26,18,8,0.4)", "rgba(228,230,235,0.4)") }}>No education entries yet.</p></Card>
          : items.map(item => (
            <Card key={item._id} isDark={isDark}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                <div style={{ flex: 1, borderLeft: "3px solid #5ba898", paddingLeft: 14 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: t("#1a1208", "#e4e6eb"), marginBottom: 3 }}>{item.degree}</div>
                  <div style={{ fontSize: 12, color: t("rgba(26,18,8,0.6)", "rgba(228,230,235,0.55)"), marginBottom: 3 }}>{item.institution}{item.location ? ` · ${item.location}` : ""}</div>
                  <div style={{ fontSize: 10, fontFamily: "monospace", color: "#5ba898" }}>{item.startYear} — {item.endYear}</div>
                  {item.description && <p style={{ fontSize: 12, marginTop: 6, color: t("rgba(26,18,8,0.5)", "rgba(228,230,235,0.45)"), lineHeight: 1.6 }}>{item.description}</p>}
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <Btn small onClick={() => openForm(item)} color="#8a7ab8"><Icon name="edit" size={12} /></Btn>
                  <Btn small onClick={() => del(item._id)} danger><Icon name="trash" size={12} /></Btn>
                </div>
              </div>
            </Card>
          ))}
    </div>
  );
}

/* ── Experience ── */
function ExperiencePage({ isDark }) {
  const t = (l, d) => isDark ? d : l;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [toast, showToast] = useToast();

  const empty = { title: "", company: "", location: "", type: "Full-time", startDate: "", endDate: "Present", description: "" };
  const [form, setForm] = useState(empty);
  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const TYPES = ["Full-time", "Part-time", "Freelance", "Internship", "Contract"];

  useEffect(() => { api.getExperience().then(setItems).finally(() => setLoading(false)); }, []);

  const openForm = (item = null) => { if (item) { setForm({ ...item }); setEditId(item._id); } else { setForm(empty); setEditId(null); } setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditId(null); setForm(empty); };

  const submit = async () => {
    if (!form.title.trim() || !form.company.trim() || !form.startDate.trim()) { showToast("Title, company & start date required", "error"); return; }
    try {
      if (editId) { const u = await api.updateExperience(editId, form); setItems(p => p.map(i => i._id === editId ? u : i)); showToast("Updated ✓"); }
      else { const c = await api.addExperience(form); setItems(p => [...p, c]); showToast("Added ✓"); }
      closeForm();
    } catch (e) { showToast(e.message, "error"); }
  };

  const del = async (id) => {
    try { await api.deleteExperience(id); setItems(p => p.filter(i => i._id !== id)); showToast("Removed"); }
    catch (e) { showToast(e.message, "error"); }
  };

  return (
    <div>
      <Toast {...toast} />
      <SectionHeader title="Experience" sub="Manage work history" isDark={isDark} />
      <div style={{ marginBottom: 16 }}>
        <Btn onClick={() => showForm ? closeForm() : openForm()}>{showForm ? <><Icon name="x" size={13} /> Cancel</> : <><Icon name="plus" size={13} /> Add Experience</>}</Btn>
      </div>
      {showForm && (
        <Card title={editId ? "Edit Experience" : "New Entry"} isDark={isDark}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12, marginBottom: 12 }}>
            <Input label="Job Title" value={form.title} onChange={v => setF("title", v)} placeholder="Frontend Developer" isDark={isDark} />
            <Input label="Company" value={form.company} onChange={v => setF("company", v)} placeholder="Tech Corp" isDark={isDark} />
            <Input label="Location" value={form.location} onChange={v => setF("location", v)} placeholder="Kathmandu / Remote" isDark={isDark} />
            <Select label="Type" value={form.type} onChange={v => setF("type", v)} options={TYPES} isDark={isDark} />
            <Input label="Start Date" value={form.startDate} onChange={v => setF("startDate", v)} placeholder="Jan 2023" isDark={isDark} />
            <Input label="End Date" value={form.endDate} onChange={v => setF("endDate", v)} placeholder="Present" isDark={isDark} />
          </div>
          <Input label="Description" value={form.description} onChange={v => setF("description", v)} placeholder="What you did…" textarea isDark={isDark} style={{ marginBottom: 14 }} />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Btn onClick={submit}><Icon name="check" size={13} /> {editId ? "Update" : "Save"}</Btn>
            <Btn onClick={closeForm} color="#8a7ab8">Cancel</Btn>
          </div>
        </Card>
      )}
      {loading ? <div style={{ color: "#5ba898", fontFamily: "monospace", fontSize: 13 }}>Loading…</div>
        : items.length === 0
          ? <Card isDark={isDark}><p style={{ fontSize: 13, color: t("rgba(26,18,8,0.4)", "rgba(228,230,235,0.4)") }}>No experience entries yet.</p></Card>
          : items.map(item => (
            <Card key={item._id} isDark={isDark}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                <div style={{ flex: 1, borderLeft: "3px solid #d4935a", paddingLeft: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: t("#1a1208", "#e4e6eb") }}>{item.title}</span>
                    <span style={{ fontSize: 10, fontFamily: "monospace", padding: "2px 8px", borderRadius: 10, background: "rgba(212,147,90,0.12)", color: "#d4935a", border: "1px solid rgba(212,147,90,0.25)" }}>{item.type}</span>
                  </div>
                  <div style={{ fontSize: 12, color: t("rgba(26,18,8,0.6)", "rgba(228,230,235,0.55)"), marginBottom: 3 }}>{item.company}{item.location ? ` · ${item.location}` : ""}</div>
                  <div style={{ fontSize: 10, fontFamily: "monospace", color: "#5ba898" }}>{item.startDate} — {item.endDate}</div>
                  {item.description && <p style={{ fontSize: 12, marginTop: 6, color: t("rgba(26,18,8,0.5)", "rgba(228,230,235,0.45)"), lineHeight: 1.6 }}>{item.description}</p>}
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <Btn small onClick={() => openForm(item)} color="#8a7ab8"><Icon name="edit" size={12} /></Btn>
                  <Btn small onClick={() => del(item._id)} danger><Icon name="trash" size={12} /></Btn>
                </div>
              </div>
            </Card>
          ))}
    </div>
  );
}

/* ── Messages ── */
function MessagesPage({ isDark }) {
  const t = (l, d) => isDark ? d : l;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [toast, showToast] = useToast();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  useEffect(() => { api.getMessages().then(setMessages).catch(() => setMessages([])).finally(() => setLoading(false)); }, []);

  const markRead = async (id) => {
    try { await api.markRead(id); setMessages(p => p.map(m => m._id === id ? { ...m, read: true } : m)); }
    catch (e) { showToast(e.message, "error"); }
  };

  const del = async (id) => {
    try { await api.deleteMessage(id); setMessages(p => p.filter(m => m._id !== id)); if (selected?._id === id) setSelected(null); showToast("Deleted"); }
    catch (e) { showToast(e.message, "error"); }
  };

  const open = (m) => { setSelected(m); if (!m.read) markRead(m._id); };
  const unread = messages.filter(m => !m.read).length;
  const showList = !isMobile || !selected;
  const showDetail = !!selected;

  return (
    <div>
      <Toast {...toast} />
      <SectionHeader title="Messages" sub="Contact form inbox" isDark={isDark} />
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <Icon name="inbox" size={15} style={{ color: "#5ba898" }} />
        <span style={{ fontSize: 12, fontFamily: "monospace", color: "#5ba898" }}>{unread} unread</span>
        <span style={{ fontSize: 12, fontFamily: "monospace", color: t("rgba(26,18,8,0.4)", "rgba(228,230,235,0.4)") }}>· {messages.length} total</span>
      </div>
      {loading ? <div style={{ color: "#5ba898", fontFamily: "monospace", fontSize: 13 }}>Loading…</div>
        : messages.length === 0
          ? <Card isDark={isDark}><p style={{ fontSize: 13, color: t("rgba(26,18,8,0.4)", "rgba(228,230,235,0.4)") }}>No messages yet.</p></Card>
          : (
            <div style={{ display: "grid", gridTemplateColumns: (!isMobile && selected) ? "1fr 1.4fr" : "1fr", gap: 16, alignItems: "start" }}>
              {showList && (
                <div>
                  {messages.map(m => (
                    <div key={m._id} onClick={() => open(m)} style={{
                      cursor: "pointer", padding: "14px 16px", marginBottom: 8, borderRadius: 12,
                      background: selected?._id === m._id ? t("rgba(91,168,152,0.08)", "rgba(91,168,152,0.12)") : t("rgba(255,253,247,0.88)", "rgba(36,37,38,0.88)"),
                      border: `1px solid ${selected?._id === m._id ? "#5ba898" : t("rgba(26,18,8,0.07)", "rgba(255,255,255,0.07)")}`,
                      transition: "all .2s",
                    }}
                      onMouseEnter={e => { if (selected?._id !== m._id) e.currentTarget.style.borderColor = "#5ba898"; }}
                      onMouseLeave={e => { if (selected?._id !== m._id) e.currentTarget.style.borderColor = t("rgba(26,18,8,0.07)", "rgba(255,255,255,0.07)"); }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                        <div style={{ width: 7, height: 7, borderRadius: "50%", flexShrink: 0, background: m.read ? "transparent" : "#5ba898", border: m.read ? `1px solid ${t("rgba(26,18,8,0.2)", "rgba(255,255,255,0.2)")}` : undefined }} />
                        <span style={{ fontSize: 13, fontWeight: m.read ? 500 : 700, color: t("#1a1208", "#e4e6eb"), flex: 1 }}>{m.name}</span>
                        <span style={{ fontSize: 10, fontFamily: "monospace", color: t("rgba(26,18,8,0.35)", "rgba(228,230,235,0.35)"), whiteSpace: "nowrap" }}>{new Date(m.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div style={{ fontSize: 11, color: t("rgba(26,18,8,0.5)", "rgba(228,230,235,0.45)"), paddingLeft: 15, fontFamily: "monospace" }}>{m.subject || "No subject"}</div>
                      <div style={{ fontSize: 11, color: t("rgba(26,18,8,0.4)", "rgba(228,230,235,0.35)"), paddingLeft: 15, marginTop: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.message}</div>
                    </div>
                  ))}
                </div>
              )}
              {showDetail && (
                <Card isDark={isDark}>
                  {isMobile && (
                    <button onClick={() => setSelected(null)} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#5ba898", fontFamily: "monospace", fontSize: 12, padding: "0 0 14px", marginBottom: 4 }}>
                      <Icon name="arrowLeft" size={13} /> Back to messages
                    </button>
                  )}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "Georgia,serif", color: t("#1a1208", "#e4e6eb"), marginBottom: 4, wordBreak: "break-word" }}>{selected.name}</div>
                      <a href={`mailto:${selected.email}`} style={{ fontSize: 12, fontFamily: "monospace", color: "#5ba898", textDecoration: "none", wordBreak: "break-all" }}>{selected.email}</a>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                      <Btn small onClick={() => del(selected._id)} danger><Icon name="trash" size={12} /></Btn>
                      {!isMobile && <Btn small onClick={() => setSelected(null)} color="#8a7ab8"><Icon name="x" size={12} /></Btn>}
                    </div>
                  </div>
                  {selected.subject && <div style={{ fontSize: 11, fontFamily: "monospace", letterSpacing: "1.5px", textTransform: "uppercase", color: "#5ba898", marginBottom: 8 }}>{selected.subject}</div>}
                  <div style={{ fontSize: 13, lineHeight: 1.8, color: t("rgba(26,18,8,0.7)", "rgba(228,230,235,0.65)"), padding: 14, borderRadius: 10, background: t("rgba(26,18,8,0.03)", "rgba(255,255,255,0.03)"), border: `1px solid ${t("rgba(26,18,8,0.06)", "rgba(255,255,255,0.05)")}`, wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
                    {selected.message}
                  </div>
                  <div style={{ marginTop: 12, fontSize: 10, fontFamily: "monospace", color: t("rgba(26,18,8,0.35)", "rgba(228,230,235,0.3)") }}>Received {new Date(selected.createdAt).toLocaleString()}</div>
                  <div style={{ marginTop: 12 }}>
                    <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || "Your message")}`} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, background: "#5ba898", color: "#fff", fontSize: 12, fontFamily: "monospace", fontWeight: 600, textDecoration: "none" }}>
                      <Icon name="mail" size={13} /> Reply via Email
                    </a>
                  </div>
                </Card>
              )}
            </div>
          )}
    </div>
  );
}

/* ── Settings ── */
function SettingsPage({ isDark }) {
  const t = (l, d) => isDark ? d : l;
  const [credForm, setCredForm] = useState({ currentPassword: "", newUsername: "", newPassword: "", confirmPassword: "" });
  const [saving, setSaving] = useState(false);
  const [toast, showToast] = useToast();
  const setC = (k, v) => setCredForm(f => ({ ...f, [k]: v }));

  const saveCredentials = async () => {
    if (!credForm.currentPassword) { showToast("Current password is required", "error"); return; }
    if (!credForm.newUsername && !credForm.newPassword) { showToast("Enter a new username or password", "error"); return; }
    if (credForm.newPassword && credForm.newPassword !== credForm.confirmPassword) { showToast("Passwords don't match", "error"); return; }
    if (credForm.newPassword && credForm.newPassword.length < 6) { showToast("Password must be at least 6 characters", "error"); return; }
    setSaving(true);
    await delay(1000);
    showToast("Credentials updated ✓ (demo mode)", "success");
    setCredForm({ currentPassword: "", newUsername: "", newPassword: "", confirmPassword: "" });
    setSaving(false);
  };

  return (
    <div>
      <Toast {...toast} />
      <SectionHeader title="Settings" sub="Account & preferences" isDark={isDark} />
      <Card title="Account" isDark={isDark}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[["Role", "Administrator"], ["Auth", "JWT — stored in localStorage"], ["Session", "Active"]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", gap: 16, padding: "8px 0", borderBottom: `1px solid ${t("rgba(26,18,8,0.05)", "rgba(255,255,255,0.05)")}`, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, fontFamily: "monospace", color: t("rgba(26,18,8,0.4)", "rgba(228,230,235,0.4)"), minWidth: 100 }}>{k}</span>
              <span style={{ fontSize: 13, color: t("#1a1208", "#e4e6eb") }}>{v}</span>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Change Username / Password" accent="#d4935a" isDark={isDark}>
        <p style={{ fontSize: 12, color: t("rgba(26,18,8,0.5)", "rgba(228,230,235,0.5)"), marginBottom: 18, lineHeight: 1.6 }}>Update your admin login credentials.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Input label="Current Password (required)" value={credForm.currentPassword} onChange={v => setC("currentPassword", v)} type="password" placeholder="Your current password" isDark={isDark} />
          <div style={{ width: "100%", height: 1, background: t("rgba(26,18,8,0.07)", "rgba(255,255,255,0.07)") }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 }}>
            <Input label="New Username (optional)" value={credForm.newUsername} onChange={v => setC("newUsername", v)} placeholder="Leave blank to keep current" isDark={isDark} />
            <div />
            <Input label="New Password (optional)" value={credForm.newPassword} onChange={v => setC("newPassword", v)} type="password" placeholder="Min. 6 characters" isDark={isDark} />
            <Input label="Confirm New Password" value={credForm.confirmPassword} onChange={v => setC("confirmPassword", v)} type="password" placeholder="Repeat new password" isDark={isDark} />
          </div>
          <div>
            <Btn onClick={saveCredentials} disabled={saving} color="#d4935a">
              {saving ? <><SpinnerIcon /> Saving…</> : <><Icon name="key" size={13} /> Update Credentials</>}
            </Btn>
          </div>
        </div>
      </Card>
      <Card title="Danger Zone" accent="#c96a6a" isDark={isDark}>
        <p style={{ fontSize: 12, color: t("rgba(26,18,8,0.5)", "rgba(228,230,235,0.5)"), marginBottom: 12 }}>Log out of the admin panel.</p>
        <Btn danger><Icon name="logout" size={13} /> Logout</Btn>
      </Card>
    </div>
  );
}

/* ═══════════════════════ MAIN DASHBOARD ═══════════════════════════ */
const PAGES = { overview: OverviewPage, about: AboutPage, skills: SkillsPage, projects: ProjectsPage, education: EducationPage, experience: ExperiencePage, messages: MessagesPage, settings: SettingsPage };

export default function AdminDashboard() {
  const { isDark, toggle } = useTheme();
  const t = (l, d) => isDark ? d : l;
  const [active, setActive] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const h = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    h();
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  const SIDEBAR_W = 220;
  const ICON_W = 56;
  const expanded = sidebarOpen;
  const totalSidebarW = expanded ? ICON_W + SIDEBAR_W : ICON_W;
  const ActivePage = PAGES[active] || PAGES.overview;

  const navigate = (id) => {
    setActive(id);
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: t("#f0e8d8", "#18191a"), display: "flex", position: "relative", transition: "background 0.4s" }}>

      {/* Animated subtle background */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: isDark
          ? "radial-gradient(ellipse 80% 50% at 20% 40%, rgba(91,168,152,0.04) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 70%, rgba(138,122,184,0.04) 0%, transparent 50%)"
          : "radial-gradient(ellipse 80% 50% at 20% 40%, rgba(91,168,152,0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 70%, rgba(212,147,90,0.05) 0%, transparent 50%)",
      }} />

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 99, backdropFilter: "blur(2px)" }} />
      )}

      {/* ── SIDEBAR ── */}
      <div style={{
        position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 100,
        width: isMobile ? (sidebarOpen ? ICON_W + SIDEBAR_W : 0) : totalSidebarW,
        overflow: "hidden",
        transition: "width 0.3s cubic-bezier(.4,0,.2,1)",
        background: t("rgba(255,253,247,0.97)", "rgba(18,19,20,0.98)"),
        borderRight: `1px solid ${t("rgba(26,18,8,0.08)", "rgba(255,255,255,0.06)")}`,
        backdropFilter: "blur(20px)",
        display: "flex", flexDirection: "column",
      }}>
        {/* Logo / toggle row */}
        <div style={{ display: "flex", alignItems: "center", padding: "16px 12px 12px", gap: 10, flexShrink: 0, minHeight: 70, minWidth: ICON_W + SIDEBAR_W }}>
          <button onClick={() => setSidebarOpen(o => !o)} style={{
            width: 34, height: 34, borderRadius: 9, border: "none", background: "transparent",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            color: "#5ba898", flexShrink: 0, transition: "background .2s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(91,168,152,0.12)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            {sidebarOpen ? <Icon name="x" size={15} /> : <Icon name="bars" size={15} />}
          </button>
          <div style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
            <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "Georgia,serif", color: t("#1a1208", "#e4e6eb") }}>Aayush Kattel</div>
            <div style={{ fontSize: 9, fontFamily: "monospace", letterSpacing: "2px", textTransform: "uppercase", color: "#5ba898" }}>Admin Panel</div>
          </div>
        </div>

        <div style={{ width: "100%", height: 1, background: t("rgba(26,18,8,0.07)", "rgba(255,255,255,0.06)"), flexShrink: 0 }} />

        {/* Nav items */}
        <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto", minWidth: ICON_W + SIDEBAR_W }}>
          {NAV.map(({ id, label, icon }) => {
            const isActive = active === id;
            return (
              <button key={id} onClick={() => navigate(id)} title={label} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12,
                padding: "10px 10px", borderRadius: 10, border: "none", cursor: "pointer",
                marginBottom: 3, textAlign: "left", whiteSpace: "nowrap", overflow: "hidden",
                background: isActive ? "rgba(91,168,152,0.15)" : "transparent",
                color: isActive ? "#5ba898" : t("rgba(26,18,8,0.5)", "rgba(228,230,235,0.5)"),
                fontFamily: "monospace", fontSize: 12, letterSpacing: ".02em",
                borderLeft: isActive ? "2px solid #5ba898" : "2px solid transparent",
                transition: "all .2s",
              }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = t("rgba(26,18,8,0.04)", "rgba(255,255,255,0.05)"); e.currentTarget.style.color = t("#1a1208", "#e4e6eb"); } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = t("rgba(26,18,8,0.5)", "rgba(228,230,235,0.5)"); } }}
              >
                <Icon name={icon} size={14} style={{ flexShrink: 0 }} />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        <div style={{ width: "100%", height: 1, background: t("rgba(26,18,8,0.07)", "rgba(255,255,255,0.06)") }} />

        {/* Bottom: theme toggle + logout */}
        <div style={{ padding: "10px 8px 18px", minWidth: ICON_W + SIDEBAR_W }}>
          <button onClick={toggle} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 12,
            padding: "10px 10px", borderRadius: 10, border: "none", cursor: "pointer",
            background: "transparent", color: t("rgba(26,18,8,0.5)", "rgba(228,230,235,0.5)"),
            fontFamily: "monospace", fontSize: 12, whiteSpace: "nowrap", overflow: "hidden",
            marginBottom: 3, transition: "background .2s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = t("rgba(26,18,8,0.04)", "rgba(255,255,255,0.05)")}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <span style={{ fontSize: 14, flexShrink: 0 }}>{isDark ? "☀️" : "🌙"}</span>
            <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
          </button>
          <button style={{
            width: "100%", display: "flex", alignItems: "center", gap: 12,
            padding: "10px 10px", borderRadius: 10, border: "none", cursor: "pointer",
            background: "transparent", color: "#c96a6a", fontFamily: "monospace", fontSize: 12,
            whiteSpace: "nowrap", overflow: "hidden", transition: "background .2s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(201,106,106,0.1)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <Icon name="logout" size={14} style={{ flexShrink: 0 }} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{
        flex: 1,
        marginLeft: isMobile ? 0 : totalSidebarW,
        transition: "margin-left 0.3s cubic-bezier(.4,0,.2,1)",
        minHeight: "100vh", position: "relative", zIndex: 1, display: "flex", flexDirection: "column",
      }}>

        {/* Top bar */}
        <div style={{
          position: "sticky", top: 0, zIndex: 50, height: 54,
          display: "flex", alignItems: "center", padding: "0 20px", gap: 12,
          background: t("rgba(240,232,216,0.9)", "rgba(18,19,20,0.92)"),
          borderBottom: `1px solid ${t("rgba(26,18,8,0.07)", "rgba(255,255,255,0.06)")}`,
          backdropFilter: "blur(16px)",
        }}>
          {/* Mobile hamburger */}
          {isMobile && (
            <button onClick={() => setSidebarOpen(true)} style={{
              background: "transparent", border: "none", cursor: "pointer",
              color: "#5ba898", display: "flex", alignItems: "center", padding: 6, borderRadius: 8,
              transition: "background .2s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(91,168,152,0.12)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <Icon name="bars" size={18} />
            </button>
          )}
          <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
            <span style={{ fontSize: 12, fontFamily: "monospace", color: "#5ba898" }}>aayush</span>
            <span style={{ color: t("rgba(26,18,8,0.3)", "rgba(255,255,255,0.25)"), fontFamily: "monospace", fontSize: 12 }}>@portfolio:/admin/</span>
            <span style={{ color: "#a855f7", fontFamily: "monospace", fontSize: 12 }}>{active}</span>
          </div>
          <span style={{ fontSize: 10, fontFamily: "monospace", color: t("rgba(26,18,8,0.3)", "rgba(228,230,235,0.3)"), flexShrink: 0 }}>
            {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
          </span>
        </div>

        {/* Page content */}
        <div style={{ padding: "clamp(20px, 4vw, 40px)", maxWidth: 940, width: "100%", boxSizing: "border-box", flex: 1 }}>
          <ActivePage isDark={isDark} />
        </div>
      </div>

      <style>{`
        @keyframes borderSlide { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes toastIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(91,168,152,0.3); border-radius: 4px; }
      `}</style>
    </div>
  );
}