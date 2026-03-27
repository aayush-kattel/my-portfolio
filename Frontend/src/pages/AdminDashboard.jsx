import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import ThemeToggle from "../components/ThemeToggle";
import DevModeToggle from "../components/DevMode";
import AnimatedBackground from "../components/AnimatedBackground";
import {
  FaBars, FaXmark, FaGauge, FaUser, FaFolderOpen, FaEnvelope,
  FaGear, FaRightFromBracket, FaPlus, FaTrash,
  FaPen, FaCheck, FaGraduationCap, FaBriefcase, FaLayerGroup,
  FaUpload, FaImage, FaSpinner, FaInbox, FaKey,FaFilePdf,FaEye
} from "react-icons/fa6";
import {
  apiGetProfile, apiUpdateProfile, apiUploadLogo,
  apiGetSkills, apiAddSkill, apiDeleteSkill,
  apiGetProjects, apiAddProject, apiUpdateProject, apiDeleteProject,
  apiGetEducation, apiAddEducation, apiUpdateEducation, apiDeleteEducation,
  apiGetExperience, apiAddExperience, apiUpdateExperience, apiDeleteExperience,
  apiGetMessages, apiMarkRead, apiDeleteMessage,
} from "../api";

/* ─────────────────────── Constants ────────────────────────────── */
const API_BASE = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

const NAV = [
  { id: "overview",   label: "Overview",   Icon: FaGauge },
  { id: "about",      label: "About",      Icon: FaUser },
  { id: "skills",     label: "Skills",     Icon: FaLayerGroup },
  { id: "projects",   label: "Projects",   Icon: FaFolderOpen },
  { id: "education",  label: "Education",  Icon: FaGraduationCap },
  { id: "experience", label: "Experience", Icon: FaBriefcase },
  { id: "messages",   label: "Messages",   Icon: FaEnvelope },
  { id: "settings",   label: "Settings",   Icon: FaGear },
];

/* ─────────────────────── Shared hooks ─────────────────────────── */
function useT() {
  const { isDark } = useTheme();
  return (l, d) => (isDark ? d : l);
}

function useToast() {
  const [toast, setToast] = useState({ msg: "", type: "success" });
  const show = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "success" }), 3000);
  }, []);
  return [toast, show];
}

/* ─────────────────────── Shared UI atoms ───────────────────────── */
function Toast({ msg, type = "success" }) {
  if (!msg) return null;
  return (
    <div style={{
      position: "fixed", top: "20px", right: "20px", zIndex: 99999,
      padding: "10px 18px", borderRadius: "10px",
      background: type === "success"
        ? "linear-gradient(135deg,#5ba898,#4a9080)"
        : "linear-gradient(135deg,#c96a6a,#a85555)",
      color: "#fff", fontFamily: "monospace", fontSize: "13px", fontWeight: 600,
      boxShadow: "0 4px 20px rgba(0,0,0,0.3)", animation: "toastIn .3s ease",
    }}>
      {msg}
    </div>
  );
}

function Spinner() {
  return <FaSpinner style={{ animation: "spin 1s linear infinite", fontSize: "14px" }} />;
}

function Card({ children, title, accent = "#5ba898", style = {} }) {
  const t = useT();
  return (
    <div style={{ 
      position: "relative", 
      borderRadius: "18px", 
      marginBottom: "20px", 
      overflow: "visible",   // ✅ ADD THIS
      ...style 
    }}>
      <div style={{
        position: "absolute", inset: 0, borderRadius: "18px",
        background: "linear-gradient(90deg,transparent,#5ba898,#d4935a,#c96a6a,#7aaa6a,#8a7ab8,#5ba898,transparent)",
        backgroundSize: "200% 100%", animation: "borderSlide 3s linear infinite", overflow: "visible"
      }} />
      <div style={{
        position: "relative", 
        zIndex: 1,             // ✅ KEEP THIS (already present)
        margin: "2px", 
        borderRadius: "16px",
        padding: "24px 26px",
        background: t("rgba(255,253,247,0.94)", "rgba(36,37,38,0.94)"),
        backdropFilter: "blur(12px)", 
        overflow: "visible",   // ✅ ALREADY PRESENT — confirm it's there
      }}>
        {title && (
          <div style={{
            fontSize: "10px", fontFamily: "monospace", letterSpacing: "2px",
            textTransform: "uppercase", color: accent, marginBottom: "16px",
          }}>{title}</div>
        )}
        {children}
      </div>
    </div>
  );
}

function SectionHeader({ title, sub }) {
  return (
    <div style={{ marginBottom: "28px" }}>
      <p style={{
        fontSize: "10px", fontFamily: "monospace", letterSpacing: "3px",
        textTransform: "uppercase", color: "#5ba898", marginBottom: "4px",
      }}>{sub}</p>
      <h2 style={{
        fontSize: "clamp(22px,3vw,32px)", fontWeight: 700, fontFamily: "Georgia,serif",
        margin: 0, background: "linear-gradient(90deg,#5ba898,#d4935a)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
      }}>{title}</h2>
      <div style={{
        width: "40px", height: "3px", borderRadius: "2px",
        background: "linear-gradient(90deg,#5ba898,#d4935a)", marginTop: "8px",
      }} />
    </div>
  );
}

function Btn({ onClick, children, color = "#5ba898", small = false, danger = false, disabled = false, style = {} }) {
  const bg = danger ? "#c96a6a" : color;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        padding: small ? "5px 12px" : "9px 18px", borderRadius: "8px",
        border: "none", cursor: disabled ? "not-allowed" : "pointer",
        background: bg, color: "#fff",
        fontSize: small ? "11px" : "12px", fontFamily: "monospace", fontWeight: 600,
        opacity: disabled ? 0.6 : 1, transition: "opacity .2s,transform .1s", ...style,
      }}
      onMouseEnter={e => !disabled && (e.currentTarget.style.opacity = ".85")}
      onMouseLeave={e => !disabled && (e.currentTarget.style.opacity = "1")}
    >{children}</button>
  );
}

function Input({ label, value, onChange, placeholder = "", type = "text", textarea = false, style = {} }) {
  const t = useT();
  const base = {
    width: "100%", padding: "9px 12px", borderRadius: "8px",
    border: `1px solid ${t("rgba(26,18,8,0.12)", "rgba(228,230,235,0.12)")}`,
    background: t("#fff", "rgba(255,255,255,0.05)"),
    color: t("#1a1208", "#e4e6eb"),
    fontSize: "13px", fontFamily: "monospace", outline: "none", resize: "vertical",
    transition: "border .2s,box-shadow .2s", boxSizing: "border-box", ...style,
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px", flex: 1 }}>
      {label && (
        <label style={{
          fontSize: "10px", fontFamily: "monospace", letterSpacing: "1.5px",
          textTransform: "uppercase", color: "#5ba898",
        }}>{label}</label>
      )}
      {textarea
        ? <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            style={{ ...base, minHeight: "80px" }}
            onFocus={e => { e.target.style.borderColor = "#5ba898"; e.target.style.boxShadow = "0 0 0 3px rgba(91,168,152,0.1)"; }}
            onBlur={e => { e.target.style.borderColor = t("rgba(26,18,8,0.12)", "rgba(228,230,235,0.12)"); e.target.style.boxShadow = "none"; }}
          />
        : <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            style={base}
            onFocus={e => { e.target.style.borderColor = "#5ba898"; e.target.style.boxShadow = "0 0 0 3px rgba(91,168,152,0.1)"; }}
            onBlur={e => { e.target.style.borderColor = t("rgba(26,18,8,0.12)", "rgba(228,230,235,0.12)"); e.target.style.boxShadow = "none"; }}
          />
      }
    </div>
  );
}

function Select({ label, value, onChange, options, style = {} }) {
  const t = useT();
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleSelect = (selectedValue) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  const getDisplayValue = () => {
    const option = options.find(o => {
      const val = typeof o === "object" ? o.value : o;
      return val === value;
    });
    if (!option) return value;
    return typeof option === "object" ? option.label : option;
  };

  return (
    <div 
      ref={selectRef}
      style={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: "5px", 
        flex: 1, 
        position: "relative",
        ...style 
      }}
    >
      {label && (
        <label style={{
          fontSize: "10px", 
          fontFamily: "monospace", 
          letterSpacing: "1.5px",
          textTransform: "uppercase", 
          color: "#5ba898",
        }}>{label}</label>
      )}
      
      {/* Custom Select Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: "9px 12px",
          borderRadius: "8px",
          border: `1px solid ${t("rgba(26,18,8,0.12)", "rgba(228,230,235,0.12)")}`,
          background: t("#fff", "#2a2b2c"),
          color: t("#1a1208", "#e4e6eb"),
          fontSize: "13px",
          fontFamily: "monospace",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: "44px",
          transition: "all 0.2s",
        }}
      >
        <span>{getDisplayValue()}</span>
        <span style={{
          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.2s",
        }}>▼</span>
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: "4px",
            background: t("#fff", "#2a2b2c"),
            border: `1px solid ${t("rgba(26,18,8,0.12)", "rgba(228,230,235,0.12)")}`,
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: isOpen ? 999 : 1,
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          {options.map((o, index) => {
            const val = typeof o === "object" ? o.value : o;
            const lbl = typeof o === "object" ? o.label : o;
            const isSelected = val === value;
            return (
              <div
                key={val}
                onClick={() => handleSelect(val)}
                style={{
                  padding: "10px 12px",
                  cursor: "pointer",
                  background: isSelected 
                    ? t("rgba(91,168,152,0.15)", "rgba(91,168,152,0.2)")
                    : "transparent",
                  color: isSelected 
                    ? "#5ba898"
                    : t("#1a1208", "#e4e6eb"),
                  fontFamily: "monospace",
                  fontSize: "13px",
                  transition: "background 0.2s",
                  borderBottom: index !== options.length - 1 
                    ? `1px solid ${t("rgba(26,18,8,0.05)", "rgba(255,255,255,0.05)")}`
                    : "none",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = t("rgba(26,18,8,0.05)", "rgba(255,255,255,0.05)");
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = "transparent";
                  }
                }}
                onTouchStart={(e) => {
                  e.currentTarget.style.background = t("rgba(91,168,152,0.2)", "rgba(91,168,152,0.25)");
                }}
                onTouchEnd={(e) => {
                  if (!isSelected) {
                    setTimeout(() => {
                      e.currentTarget.style.background = "transparent";
                    }, 100);
                  }
                }}
              >
                {lbl}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────── Page: Overview ───────────────────────── */
function OverviewPage() {
  const t = useT();
  const [counts,   setCounts]   = useState({ projects: 0, messages: 0, unread: 0, skills: 0 });
  const [messages, setMessages] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      const [profileRes, messagesRes, skillsRes, projectsRes] = await Promise.allSettled([
        apiGetProfile(),
        apiGetMessages(),
        apiGetSkills(),
        apiGetProjects(),
      ]);

      if (cancelled) return;

      const msgs     = messagesRes.status     === "fulfilled" ? (messagesRes.value     || []) : [];
      const skills   = skillsRes.status       === "fulfilled" ? (skillsRes.value       || []) : [];
      const projects = projectsRes.status     === "fulfilled" ? (projectsRes.value     || []) : [];

      setMessages(msgs);
      setCounts({
        projects: projects.length,
        messages: msgs.length,
        unread:   msgs.filter(m => !m.read).length,
        skills:   skills.length,
      });
      setLoading(false);
    }

    fetchAll();
    return () => { cancelled = true; };
  }, []);

  const stats = [
    { label: "Total Projects", value: loading ? "…" : counts.projects, delta: "in portfolio",          accent: "#5ba898" },
    { label: "Messages",       value: loading ? "…" : counts.messages, delta: `${counts.unread} unread`, accent: "#d4935a" },
    { label: "Skills Listed",  value: loading ? "…" : counts.skills,   delta: "across categories",     accent: "#8a7ab8" },
    { label: "Profile Views",  value: "—",                             delta: "not tracked",            accent: "#c96a6a" },
  ];

  return (
    <div>
      <SectionHeader title="Overview" sub="Dashboard at a glance" />

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))",
        gap: "14px", marginBottom: "28px",
      }}>
        {stats.map(({ label, value, delta, accent }) => (
          <div key={label} style={{
            padding: "20px 18px", borderRadius: "14px",
            background: t("rgba(255,253,247,0.88)", "rgba(36,37,38,0.88)"),
            border: `1px solid ${t("rgba(26,18,8,0.07)", "rgba(255,255,255,0.07)")}`,
          }}>
            <div style={{
              fontSize: "10px", fontFamily: "monospace", letterSpacing: "2px",
              textTransform: "uppercase", color: accent, marginBottom: "8px",
            }}>{label}</div>
            <div style={{
              fontSize: "28px", fontWeight: 700, fontFamily: "Georgia,serif",
              color: t("#1a1208", "#e4e6eb"), lineHeight: 1,
            }}>{value}</div>
            <div style={{
              fontSize: "11px", marginTop: "5px",
              color: t("rgba(26,18,8,0.4)", "rgba(228,230,235,0.4)"),
            }}>{delta}</div>
          </div>
        ))}
      </div>

      <Card title="Recent Messages">
        {loading && (
          <p style={{ fontSize: "13px", color: "#5ba898", fontFamily: "monospace" }}>Loading…</p>
        )}
        {!loading && messages.length === 0 && (
          <p style={{ fontSize: "13px", color: t("rgba(26,18,8,0.4)", "rgba(228,230,235,0.4)") }}>
            No messages yet.
          </p>
        )}
        {messages.slice(0, 5).map(m => (
          <div key={m._id} style={{
            display: "flex", alignItems: "center", gap: "10px", padding: "9px 0",
            borderBottom: `1px solid ${t("rgba(26,18,8,0.05)", "rgba(255,255,255,0.05)")}`,
          }}>
            <div style={{
              width: "7px", height: "7px", borderRadius: "50%",
              background: m.read ? "transparent" : "#5ba898",
              border: m.read ? `1px solid ${t("rgba(26,18,8,0.2)", "rgba(255,255,255,0.2)")}` : undefined,
              flexShrink: 0,
            }} />
            <span style={{
              flex: 1, fontSize: "13px",
              color: t("#1a1208", "#e4e6eb"), fontWeight: m.read ? 400 : 600,
            }}>{m.name}</span>
            <span style={{
              fontSize: "11px",
              color: t("rgba(26,18,8,0.4)", "rgba(228,230,235,0.4)"),
              fontFamily: "monospace",
            }}>{m.subject || "No subject"}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

/* ─────────────────────── Page: About ──────────────────────────── */

function AboutPage() {
  const t = useT();
  const [profile,      setProfile]      = useState({});
  const [saving,       setSaving]       = useState(false);
  const [toast,        showToast]       = useToast();

  /* logo */
  const [logoFile,    setLogoFile]    = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const logoRef = useRef();

  /* cv */
  const [cvFile,       setCvFile]       = useState(null);
  const [cvUploading,  setCvUploading]  = useState(false);
  const [cvDeleting,   setCvDeleting]   = useState(false);
  const cvRef = useRef();

  useEffect(() => {
    apiGetProfile().then(setProfile).catch(() => {});
  }, []);

  /* ── helpers ── */
  const setField = (k, v) => setProfile(p => ({ ...p, [k]: v }));
  const setStats = (k, v) => setProfile(p => ({ ...p, stats: { ...p.stats, [k]: v } }));

  /* ── save profile (bio / stats / etc.) ── */
  const save = async () => {
    setSaving(true);
    try {
      let updated = { ...profile };

      if (logoFile) {
        const r = await apiUploadLogo(logoFile);
        updated = { ...updated, logoUrl: r.logoUrl };
        setLogoFile(null);
        setLogoPreview(null);
      }

      await apiUpdateProfile(updated);
      setProfile(updated);
      showToast("Profile saved ✓");
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  /* ── logo file picker ── */
  const onLogoChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setLogoFile(f);
    setLogoPreview(URL.createObjectURL(f));
  };

  /* ── cv upload (fires immediately on file pick or button click) ── */
  const uploadCV = async (file) => {
    if (!file) return;
    setCvUploading(true);
    try {
      const r = await apiUploadCV(file);
      setProfile(p => ({ ...p, cvUrl: r.cvUrl }));
      setCvFile(null);
      // reset the file input so the same file can be re-selected if needed
      if (cvRef.current) cvRef.current.value = "";
      showToast("CV uploaded ✓");
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setCvUploading(false);
    }
  };

  const onCvChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setCvFile(f);
    uploadCV(f); // upload immediately on pick
  };

  /* ── cv delete ── */
  const deleteCV = async () => {
    if (!window.confirm("Remove CV from your portfolio?")) return;
    setCvDeleting(true);
    try {
      await apiDeleteCV();
      setProfile(p => ({ ...p, cvUrl: "" }));
      showToast("CV removed");
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setCvDeleting(false);
    }
  };

  /* ── logo src ── */
  const API_BASE = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";
  const logoSrc = logoPreview
    || (profile.logoUrl
      ? profile.logoUrl.startsWith("http") ? profile.logoUrl : `${API_BASE}${profile.logoUrl}`
      : null);

  /* ── cv display url (strip fl_attachment for preview link) ── */
  const cvPreviewUrl = profile.cvUrl
    ? profile.cvUrl.replace(/[?&]fl_attachment[^&]*/g, "")
    : null;

  return (
    <div>
      <Toast {...toast} />
      <SectionHeader title="About" sub="Manage your profile" />

      {/* ── LOGO ── */}
      <Card title="Logo / Avatar">
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <div style={{ position: "relative", width: "80px", height: "80px", flexShrink: 0 }}>
            <div style={{
              width: "80px", height: "80px", borderRadius: "50%",
              border: "3px solid #5ba898", overflow: "hidden",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "linear-gradient(135deg,rgba(91,168,152,0.15),rgba(212,147,90,0.1))",
            }}>
              {logoSrc
                ? <img src={logoSrc} alt="logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <FaImage style={{ color: "#5ba898", fontSize: "28px" }} />
              }
            </div>
            <div style={{
              position: "absolute", bottom: "3px", right: "3px",
              width: "14px", height: "14px", borderRadius: "50%",
              background: "#5ba898", border: `2px solid ${t("#f0e8d8", "#18191a")}`,
            }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <input ref={logoRef} type="file" accept="image/*" onChange={onLogoChange} style={{ display: "none" }} />
            <Btn onClick={() => logoRef.current.click()} small>
              <FaUpload /> Choose Image
            </Btn>
            {logoFile && <span style={{ fontSize: "11px", fontFamily: "monospace", color: "#5ba898" }}>{logoFile.name} — will save with profile</span>}
            {!logoFile && logoSrc && <span style={{ fontSize: "11px", fontFamily: "monospace", color: t("rgba(26,18,8,0.4)", "rgba(228,230,235,0.4)") }}>Current image loaded ✓</span>}
            <span style={{ fontSize: "10px", fontFamily: "monospace", color: t("rgba(26,18,8,0.4)", "rgba(228,230,235,0.4)") }}>PNG, JPG, WebP — max 2 MB</span>
          </div>
        </div>
      </Card>

      {/* ── CV / RESUME ── */}
      <Card title="CV / Resume">
        <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>

          {/* icon */}
          <div style={{
            width: "56px", height: "56px", borderRadius: "12px", flexShrink: 0,
            background: profile.cvUrl
              ? "rgba(91,168,152,0.15)"
              : t("rgba(26,18,8,0.05)", "rgba(255,255,255,0.05)"),
            border: `2px solid ${profile.cvUrl ? "rgba(91,168,152,0.4)" : t("rgba(26,18,8,0.12)", "rgba(255,255,255,0.1)")}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: profile.cvUrl ? "#5ba898" : t("rgba(26,18,8,0.3)", "rgba(255,255,255,0.25)"),
            fontSize: "22px", transition: "all 0.3s",
          }}>
            <FaFilePdf />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1, minWidth: "200px" }}>

            {/* status line */}
            {profile.cvUrl ? (
              <div style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "8px 12px", borderRadius: "8px",
                background: "rgba(91,168,152,0.1)",
                border: "1px solid rgba(91,168,152,0.25)",
                width: "fit-content",
              }}>
                <FaCheck style={{ color: "#5ba898", fontSize: "11px" }} />
                <span style={{ fontSize: "12px", fontFamily: "monospace", color: "#5ba898" }}>
                  CV uploaded & live on portfolio
                </span>
              </div>
            ) : (
              <div style={{
                padding: "8px 12px", borderRadius: "8px",
                background: t("rgba(26,18,8,0.04)", "rgba(255,255,255,0.04)"),
                border: `1px dashed ${t("rgba(26,18,8,0.15)", "rgba(255,255,255,0.1)")}`,
                width: "fit-content",
              }}>
                <span style={{ fontSize: "12px", fontFamily: "monospace", color: t("rgba(26,18,8,0.4)", "rgba(228,230,235,0.35)") }}>
                  No CV uploaded yet — visitors won't see the download button
                </span>
              </div>
            )}

            {/* action buttons */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
              <input
                ref={cvRef}
                type="file"
                accept="application/pdf"
                onChange={onCvChange}
                style={{ display: "none" }}
              />

              <Btn
                onClick={() => cvRef.current.click()}
                disabled={cvUploading}
                small
              >
                {cvUploading
                  ? <><Spinner /> Uploading…</>
                  : <><FaUpload /> {profile.cvUrl ? "Replace CV" : "Upload CV"}</>
                }
              </Btn>

              {profile.cvUrl && (
                <>
                  <a
                    href={cvPreviewUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-flex", alignItems: "center", gap: "6px",
                      padding: "7px 14px", borderRadius: "7px", fontSize: "12px",
                      fontFamily: "monospace", textDecoration: "none",
                      background: t("rgba(26,18,8,0.06)", "rgba(255,255,255,0.06)"),
                      border: `1px solid ${t("rgba(26,18,8,0.12)", "rgba(255,255,255,0.1)")}`,
                      color: t("#1a1208", "#e4e6eb"),
                    }}
                  >
                    <FaEye style={{ fontSize: "11px" }} /> Preview
                  </a>

                  <Btn
                    onClick={deleteCV}
                    disabled={cvDeleting}
                    small
                    danger
                  >
                    {cvDeleting ? <><Spinner /> Removing…</> : <><FaTrash /> Remove</>}
                  </Btn>
                </>
              )}
            </div>

            {/* uploading progress hint */}
            {cvUploading && (
              <span style={{ fontSize: "11px", fontFamily: "monospace", color: "#5ba898" }}>
                Uploading to Cloudinary… please wait
              </span>
            )}

            <span style={{ fontSize: "10px", fontFamily: "monospace", color: t("rgba(26,18,8,0.35)", "rgba(228,230,235,0.3)") }}>
              PDF only — max 5 MB
            </span>
          </div>
        </div>
      </Card>

      {/* ── BIO ── */}
      <Card title="Bio">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
          <Input label="Name"     value={profile.name     || ""} onChange={v => setField("name", v)}     placeholder="Aayush Kattel" />
          <Input label="Role"     value={profile.role     || ""} onChange={v => setField("role", v)}     placeholder="Full Stack Developer" />
          <Input label="Location" value={profile.location || ""} onChange={v => setField("location", v)} placeholder="Kathmandu, Nepal" />
          <Input label="Status"   value={profile.status   || ""} onChange={v => setField("status", v)}   placeholder="Open to work" />
          <Input label="Email"    value={profile.email    || ""} onChange={v => setField("email", v)}    placeholder="you@email.com" type="email" />
          <Input label="GitHub"   value={profile.github   || ""} onChange={v => setField("github", v)}   placeholder="https://github.com/..." />
          <Input label="LinkedIn" value={profile.linkedin || ""} onChange={v => setField("linkedin", v)} placeholder="https://linkedin.com/in/..." />
          <Input label="Facebook" value={profile.facebook || ""} onChange={v => setField("facebook", v)} placeholder="https://facebook.com/..." />
        </div>
        <Input label="Bio / Summary" value={profile.bio || ""} onChange={v => setField("bio", v)} placeholder="Write a short bio..." textarea />
      </Card>

      {/* ── STATS ── */}
      <Card title="At a Glance Stats">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
          <Input label="Projects"      value={profile.stats?.totalProjects || ""} onChange={v => setStats("totalProjects", v)} placeholder="10+" />
          <Input label="Profile Views" value={profile.stats?.profileViews  || ""} onChange={v => setStats("profileViews",  v)} placeholder="1.2k" />
          <Input label="Skills Listed" value={profile.stats?.skillsListed  || ""} onChange={v => setStats("skillsListed",  v)} placeholder="20" />
        </div>
      </Card>

      <Btn onClick={save} disabled={saving}>
        {saving ? <><Spinner /> Saving…</> : <><FaCheck /> Save Profile</>}
      </Btn>
    </div>
  );
}

/* ─────────────────────── Page: Skills ─────────────────────────── */
function SkillsPage() {
  const t = useT();
  const [skills,  setSkills]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [form,    setForm]    = useState({ name: "", category: "Frontend", color: "#5ba898" });
  const [toast,   showToast]  = useToast();

  const CATS   = ["Frontend", "Animation", "Backend", "Database", "Tools", "Other"];
  const COLORS = ["#5ba898", "#d4935a", "#c96a6a", "#7aaa6a", "#8a7ab8", "#64a0c8"];

  useEffect(() => {
    apiGetSkills().then(setSkills).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const add = async () => {
    if (!form.name.trim()) return;
    try {
      const s = await apiAddSkill(form);
      setSkills(p => [...p, s]);
      setForm(f => ({ ...f, name: "" }));
      showToast("Skill added ✓");
    } catch (e) { showToast(e.message, "error"); }
  };

  const del = async (id) => {
    try { await apiDeleteSkill(id); setSkills(p => p.filter(s => s._id !== id)); showToast("Skill removed"); }
    catch (e) { showToast(e.message, "error"); }
  };

  const grouped = CATS.reduce((acc, cat) => {
    acc[cat] = skills.filter(s => s.category === cat);
    return acc;
  }, {});

  return (
    <div>
      <Toast {...toast} />
      <SectionHeader title="Skills" sub="Manage skill bubbles" />
      <Card title="Add Skill" style={{ zIndex: 10, position: "relative" }}>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "flex-end" }}>
          <Input label="Skill Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="e.g. React" style={{ minWidth: "150px" }} />
          <Select label="Category" value={form.category} onChange={v => setForm(f => ({ ...f, category: v }))} options={CATS} />
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label style={{ fontSize: "10px", fontFamily: "monospace", letterSpacing: "1.5px", textTransform: "uppercase", color: "#5ba898" }}>Color</label>
            <div style={{ display: "flex", gap: "6px", paddingTop: "2px" }}>
              {COLORS.map(c => (
                <div key={c} onClick={() => setForm(f => ({ ...f, color: c }))}
                  style={{
                    width: "22px", height: "22px", borderRadius: "50%", background: c,
                    cursor: "pointer",
                    border: form.color === c ? "3px solid #fff" : "2px solid transparent",
                    outline: form.color === c ? `2px solid ${c}` : "none",
                    transition: "all .15s",
                  }} />
              ))}
            </div>
          </div>
          <Btn onClick={add}><FaPlus /> Add Skill</Btn>
        </div>
      </Card>

      {loading
        ? <div style={{ color: "#5ba898", fontFamily: "monospace", fontSize: "13px" }}>Loading…</div>
        : CATS.map(cat => grouped[cat].length > 0 && (
          <Card key={cat} title={cat}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {grouped[cat].map(s => (
                <div key={s._id} style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "6px 12px", borderRadius: "20px",
                  background: `${s.color}22`, border: `1px solid ${s.color}55`,
                  color: s.color, fontSize: "12px", fontFamily: "monospace", fontWeight: 600,
                }}>
                  {s.name}
                  <button onClick={() => del(s._id)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: s.color, display: "flex", alignItems: "center", padding: 0, opacity: .7 }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "1"}
                    onMouseLeave={e => e.currentTarget.style.opacity = ".7"}>
                    <FaXmark size={11} />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        ))
      }
    </div>
  );
}

/* ─────────────────────── Page: Projects ───────────────────────── */
function ProjectsPage() {
  const t = useT();
  const [projects,   setProjects]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showForm,   setShowForm]   = useState(false);
  const [editId,     setEditId]     = useState(null);
  const [imgFile,    setImgFile]    = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [uploading,  setUploading]  = useState(false);
  const [toast,      showToast]     = useToast();
  const imgRef = useRef();

  const empty = { name: "", description: "", stack: "", tags: "", liveUrl: "", githubUrl: "", imageUrl: "", status: "Draft", featured: false };
  const [form, setForm] = useState(empty);
  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    apiGetProjects().then(setProjects).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const openForm = (project = null) => {
    if (project) {
      setForm({ ...project, tags: Array.isArray(project.tags) ? project.tags.join(", ") : project.tags || "" });
      setEditId(project._id);
      setImgPreview(project.imageUrl || null);
    } else {
      setForm(empty); setEditId(null); setImgPreview(null);
    }
    setImgFile(null);
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditId(null); setForm(empty); setImgFile(null); setImgPreview(null); };

  const onImgChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setImgFile(f);
    setImgPreview(URL.createObjectURL(f));
  };

  const uploadProjectImage = async (file) => {
    const fd    = new FormData();
    fd.append("projectImage", file);
    const BASE  = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const token = localStorage.getItem("ak_token");
    const res   = await fetch(`${BASE}/upload/project-image`, {
      method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");
    return data.imageUrl;
  };

  const submit = async () => {
    if (!form.name.trim()) return;
    setUploading(true);
    try {
      let imageUrl = form.imageUrl || "";
      if (imgFile) imageUrl = await uploadProjectImage(imgFile);
      const payload = { ...form, imageUrl };

      if (editId) {
        const updated = await apiUpdateProject(editId, payload);
        setProjects(p => p.map(pr => pr._id === editId ? updated : pr));
        showToast("Project updated ✓");
      } else {
        const created = await apiAddProject(payload);
        setProjects(p => [...p, created]);
        showToast("Project added ✓");
      }
      closeForm();
    } catch (e) { showToast(e.message, "error"); }
    finally { setUploading(false); }
  };

  const del = async (id) => {
    try { await apiDeleteProject(id); setProjects(p => p.filter(pr => pr._id !== id)); showToast("Deleted"); }
    catch (e) { showToast(e.message, "error"); }
  };

  const STATUS_COLORS = { Live: "#5ba898", WIP: "#d4935a", Draft: "#8a7ab8", Archived: "#c96a6a" };

  return (
    <div>
      <Toast {...toast} />
      <SectionHeader title="Projects" sub="Manage your work" />

      <div style={{ marginBottom: "16px" }}>
        <Btn onClick={() => showForm ? closeForm() : openForm()}>
          {showForm ? <><FaXmark /> Cancel</> : <><FaPlus /> Add Project</>}
        </Btn>
      </div>

      {showForm && (
        <Card title={editId ? "Edit Project" : "New Project"}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
            <Input label="Project Name" value={form.name}      onChange={v => setF("name", v)}      placeholder="My App" />
            <Input label="Stack"        value={form.stack}     onChange={v => setF("stack", v)}     placeholder="MERN" />
            <Input label="Live URL"     value={form.liveUrl}   onChange={v => setF("liveUrl", v)}   placeholder="https://..." />
            <Input label="GitHub URL"   value={form.githubUrl} onChange={v => setF("githubUrl", v)} placeholder="https://github.com/..." />
            <Input label="Tags (comma separated)" value={form.tags} onChange={v => setF("tags", v)} placeholder="React, Node.js" />
            <Select label="Status" value={form.status} onChange={v => setF("status", v)} options={["Live", "WIP", "Draft", "Archived"]} />
          </div>
          <Input label="Description" value={form.description} onChange={v => setF("description", v)} placeholder="What does this project do?" textarea style={{ marginBottom: "14px" }} />

          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "10px", fontFamily: "monospace", letterSpacing: "1.5px", textTransform: "uppercase", color: "#5ba898", display: "block", marginBottom: "8px" }}>
              Project Screenshot / Thumbnail
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{
                width: "120px", height: "75px", borderRadius: "8px",
                border: `1px dashed ${t("rgba(26,18,8,0.2)", "rgba(228,230,235,0.2)")}`,
                overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
                background: t("rgba(26,18,8,0.03)", "rgba(255,255,255,0.03)"), flexShrink: 0,
              }}>
                {imgPreview
                  ? <img src={imgPreview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <FaImage style={{ color: t("rgba(26,18,8,0.2)", "rgba(228,230,235,0.2)"), fontSize: "22px" }} />
                }
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <input ref={imgRef} type="file" accept="image/*" onChange={onImgChange} style={{ display: "none" }} />
                <Btn onClick={() => imgRef.current.click()} small><FaUpload /> Choose Image</Btn>
                {imgFile && <span style={{ fontSize: "11px", fontFamily: "monospace", color: "#5ba898" }}>{imgFile.name}</span>}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <Btn onClick={submit} disabled={uploading}>
              {uploading ? <><Spinner /> Saving…</> : <><FaCheck /> {editId ? "Update" : "Save"} Project</>}
            </Btn>
            <Btn onClick={closeForm} color="#8a7ab8">Cancel</Btn>
          </div>
        </Card>
      )}

      {loading
        ? <div style={{ color: "#5ba898", fontFamily: "monospace", fontSize: "13px" }}>Loading…</div>
        : projects.length === 0
          ? <Card><p style={{ fontSize: "13px", color: t("rgba(26,18,8,0.4)", "rgba(228,230,235,0.4)") }}>No projects yet. Add one above.</p></Card>
          : projects.map(p => (
            <Card key={p._id}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
                <div style={{ display: "flex", gap: "14px", flex: 1, minWidth: 0 }}>
                  {p.imageUrl && (
                    <div style={{ width: "90px", height: "58px", borderRadius: "8px", overflow: "hidden", flexShrink: 0, border: `1px solid ${t("rgba(26,18,8,0.08)", "rgba(255,255,255,0.08)")}` }}>
                      <img src={p.imageUrl} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "15px", fontWeight: 700, fontFamily: "Georgia,serif", color: t("#1a1208", "#e4e6eb") }}>{p.name}</span>
                      <span style={{ fontSize: "10px", fontFamily: "monospace", padding: "2px 9px", borderRadius: "20px", background: `${STATUS_COLORS[p.status] || "#5ba898"}22`, color: STATUS_COLORS[p.status] || "#5ba898", border: `1px solid ${STATUS_COLORS[p.status] || "#5ba898"}44` }}>{p.status}</span>
                    </div>
                    {p.description && <p style={{ fontSize: "12px", lineHeight: 1.7, color: t("rgba(26,18,8,0.55)", "rgba(228,230,235,0.5)"), margin: "0 0 8px" }}>{p.description}</p>}
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {(Array.isArray(p.tags) ? p.tags : String(p.tags || "").split(",").filter(Boolean)).map(tag => (
                        <span key={tag} style={{ fontSize: "10px", fontFamily: "monospace", padding: "2px 8px", borderRadius: "10px", background: "rgba(91,168,152,0.1)", color: "#5ba898" }}>{tag.trim()}</span>
                      ))}
                    </div>
                    {(p.liveUrl || p.githubUrl) && (
                      <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
                        {p.liveUrl   && <a href={p.liveUrl}   target="_blank" rel="noopener noreferrer" style={{ fontSize: "11px", color: "#5ba898",  fontFamily: "monospace" }}>↗ Live</a>}
                        {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: "11px", color: "#8a7ab8", fontFamily: "monospace" }}>↗ GitHub</a>}
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                  <Btn small onClick={() => openForm(p)} color="#8a7ab8"><FaPen /></Btn>
                  <Btn small onClick={() => del(p._id)} danger><FaTrash /></Btn>
                </div>
              </div>
            </Card>
          ))
      }
    </div>
  );
}

/* ─────────────────────── Page: Education ──────────────────────── */
function EducationPage() {
  const t = useT();
  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId,   setEditId]   = useState(null);
  const [toast,    showToast]   = useToast();

  const empty = { degree: "", institution: "", location: "", startYear: "", endYear: "Present", description: "" };
  const [form, setForm] = useState(empty);
  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    apiGetEducation().then(setItems).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const openForm = (item = null) => {
    if (item) { setForm({ ...item }); setEditId(item._id); }
    else      { setForm(empty);       setEditId(null); }
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditId(null); setForm(empty); };

  const submit = async () => {
    if (!form.degree.trim() || !form.institution.trim() || !form.startYear.trim()) {
      showToast("Degree, institution & start year required", "error"); return;
    }
    try {
      if (editId) {
        const updated = await apiUpdateEducation(editId, form);
        setItems(p => p.map(i => i._id === editId ? updated : i));
        showToast("Education updated ✓");
      } else {
        const created = await apiAddEducation(form);
        setItems(p => [...p, created]);
        showToast("Education added ✓");
      }
      closeForm();
    } catch (e) { showToast(e.message, "error"); }
  };

  const del = async (id) => {
    try { await apiDeleteEducation(id); setItems(p => p.filter(i => i._id !== id)); showToast("Removed"); }
    catch (e) { showToast(e.message, "error"); }
  };

  return (
    <div>
      <Toast {...toast} />
      <SectionHeader title="Education" sub="Manage education history" />
      <div style={{ marginBottom: "16px" }}>
        <Btn onClick={() => showForm ? closeForm() : openForm()}>
          {showForm ? <><FaXmark /> Cancel</> : <><FaPlus /> Add Education</>}
        </Btn>
      </div>

      {showForm && (
        <Card title={editId ? "Edit Education" : "New Education Entry"}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
            <Input label="Degree / Course" value={form.degree}      onChange={v => setF("degree", v)}      placeholder="Bachelor in IT" />
            <Input label="Institution"     value={form.institution} onChange={v => setF("institution", v)} placeholder="Tribhuvan University" />
            <Input label="Location"        value={form.location}    onChange={v => setF("location", v)}    placeholder="Kathmandu, Nepal" />
            <div />
            <Input label="Start Year" value={form.startYear} onChange={v => setF("startYear", v)} placeholder="2022" />
            <Input label="End Year"   value={form.endYear}   onChange={v => setF("endYear", v)}   placeholder="Present" />
          </div>
          <Input label="Description (optional)" value={form.description} onChange={v => setF("description", v)} placeholder="Brief description…" textarea style={{ marginBottom: "14px" }} />
          <div style={{ display: "flex", gap: "8px" }}>
            <Btn onClick={submit}><FaCheck /> {editId ? "Update" : "Save"}</Btn>
            <Btn onClick={closeForm} color="#8a7ab8">Cancel</Btn>
          </div>
        </Card>
      )}

      {loading
        ? <div style={{ color: "#5ba898", fontFamily: "monospace", fontSize: "13px" }}>Loading…</div>
        : items.length === 0
          ? <Card><p style={{ fontSize: "13px", color: t("rgba(26,18,8,0.4)", "rgba(228,230,235,0.4)") }}>No education entries yet.</p></Card>
          : items.map(item => (
            <Card key={item._id}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
                <div style={{ flex: 1, borderLeft: "3px solid #5ba898", paddingLeft: "14px" }}>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: t("#1a1208", "#e4e6eb"), marginBottom: "3px" }}>{item.degree}</div>
                  <div style={{ fontSize: "12px", color: t("rgba(26,18,8,0.6)", "rgba(228,230,235,0.55)"), marginBottom: "3px" }}>{item.institution}{item.location ? ` · ${item.location}` : ""}</div>
                  <div style={{ fontSize: "10px", fontFamily: "monospace", color: "#5ba898" }}>{item.startYear} — {item.endYear}</div>
                  {item.description && <p style={{ fontSize: "12px", marginTop: "6px", color: t("rgba(26,18,8,0.5)", "rgba(228,230,235,0.45)"), lineHeight: 1.6 }}>{item.description}</p>}
                </div>
                <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                  <Btn small onClick={() => openForm(item)} color="#8a7ab8"><FaPen /></Btn>
                  <Btn small onClick={() => del(item._id)} danger><FaTrash /></Btn>
                </div>
              </div>
            </Card>
          ))
      }
    </div>
  );
}

/* ─────────────────────── Page: Experience ─────────────────────── */
function ExperiencePage() {
  const t = useT();
  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId,   setEditId]   = useState(null);
  const [toast,    showToast]   = useToast();

  const empty = { title: "", company: "", location: "", type: "Full-time", startDate: "", endDate: "Present", description: "" };
  const [form, setForm] = useState(empty);
  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const TYPE_OPTS = ["Full-time", "Part-time", "Freelance", "Internship", "Contract"];

  useEffect(() => {
    apiGetExperience().then(setItems).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const openForm = (item = null) => {
    if (item) { setForm({ ...item }); setEditId(item._id); }
    else      { setForm(empty);       setEditId(null); }
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditId(null); setForm(empty); };

  const submit = async () => {
    if (!form.title.trim() || !form.company.trim() || !form.startDate.trim()) {
      showToast("Title, company & start date required", "error"); return;
    }
    try {
      if (editId) {
        const updated = await apiUpdateExperience(editId, form);
        setItems(p => p.map(i => i._id === editId ? updated : i));
        showToast("Experience updated ✓");
      } else {
        const created = await apiAddExperience(form);
        setItems(p => [...p, created]);
        showToast("Experience added ✓");
      }
      closeForm();
    } catch (e) { showToast(e.message, "error"); }
  };

  const del = async (id) => {
    try { await apiDeleteExperience(id); setItems(p => p.filter(i => i._id !== id)); showToast("Removed"); }
    catch (e) { showToast(e.message, "error"); }
  };

  return (
    <div>
      <Toast {...toast} />
      <SectionHeader title="Experience" sub="Manage work history" />
      <div style={{ marginBottom: "16px" }}>
        <Btn onClick={() => showForm ? closeForm() : openForm()}>
          {showForm ? <><FaXmark /> Cancel</> : <><FaPlus /> Add Experience</>}
        </Btn>
      </div>

      {showForm && (
        <Card title={editId ? "Edit Experience" : "New Experience Entry"}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
            <Input label="Job Title" value={form.title}    onChange={v => setF("title", v)}    placeholder="Frontend Developer" />
            <Input label="Company"   value={form.company}  onChange={v => setF("company", v)}  placeholder="Tech Corp" />
            <Input label="Location"  value={form.location} onChange={v => setF("location", v)} placeholder="Kathmandu / Remote" />
            <Select label="Type" value={form.type} onChange={v => setF("type", v)} options={TYPE_OPTS} />
            <Input label="Start Date" value={form.startDate} onChange={v => setF("startDate", v)} placeholder="Jan 2023" />
            <Input label="End Date"   value={form.endDate}   onChange={v => setF("endDate", v)}   placeholder="Present" />
          </div>
          <Input label="Description" value={form.description} onChange={v => setF("description", v)} placeholder="What you did…" textarea style={{ marginBottom: "14px" }} />
          <div style={{ display: "flex", gap: "8px" }}>
            <Btn onClick={submit}><FaCheck /> {editId ? "Update" : "Save"}</Btn>
            <Btn onClick={closeForm} color="#8a7ab8">Cancel</Btn>
          </div>
        </Card>
      )}

      {loading
        ? <div style={{ color: "#5ba898", fontFamily: "monospace", fontSize: "13px" }}>Loading…</div>
        : items.length === 0
          ? <Card><p style={{ fontSize: "13px", color: t("rgba(26,18,8,0.4)", "rgba(228,230,235,0.4)") }}>No experience entries yet.</p></Card>
          : items.map(item => (
            <Card key={item._id}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
                <div style={{ flex: 1, borderLeft: "3px solid #d4935a", paddingLeft: "14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: t("#1a1208", "#e4e6eb") }}>{item.title}</span>
                    <span style={{ fontSize: "10px", fontFamily: "monospace", padding: "2px 8px", borderRadius: "10px", background: "rgba(212,147,90,0.12)", color: "#d4935a", border: "1px solid rgba(212,147,90,0.25)" }}>{item.type}</span>
                  </div>
                  <div style={{ fontSize: "12px", color: t("rgba(26,18,8,0.6)", "rgba(228,230,235,0.55)"), marginBottom: "3px" }}>{item.company}{item.location ? ` · ${item.location}` : ""}</div>
                  <div style={{ fontSize: "10px", fontFamily: "monospace", color: "#5ba898" }}>{item.startDate} — {item.endDate}</div>
                  {item.description && <p style={{ fontSize: "12px", marginTop: "6px", color: t("rgba(26,18,8,0.5)", "rgba(228,230,235,0.45)"), lineHeight: 1.6 }}>{item.description}</p>}
                </div>
                <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                  <Btn small onClick={() => openForm(item)} color="#8a7ab8"><FaPen /></Btn>
                  <Btn small onClick={() => del(item._id)} danger><FaTrash /></Btn>
                </div>
              </div>
            </Card>
          ))
      }
    </div>
  );
}

/* ─────────────────────── Page: Messages ───────────────────────── */
function MessagesPage() {
  const t = useT();
  const [messages, setMessages] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState(null);
  const [toast,    showToast]   = useToast();

  useEffect(() => {
    apiGetMessages()
      .then(setMessages)
      .catch((err) => {
        // Handle rate limiting error gracefully
        if (err.message?.includes("Too many messages") || err.message?.includes("rate limit")) {
          showToast("Rate limit reached. Please wait a moment before refreshing.", "error");
        }
        setMessages([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const markRead = async (id) => {
    try { await apiMarkRead(id); setMessages(p => p.map(m => m._id === id ? { ...m, read: true } : m)); }
    catch (e) { 
      if (e.message?.includes("rate limit")) {
        showToast("Please wait before marking as read", "error");
      } else {
        showToast(e.message, "error"); 
      }
    }
  };

  const del = async (id) => {
    try {
      await apiDeleteMessage(id);
      setMessages(p => p.filter(m => m._id !== id));
      if (selected?._id === id) setSelected(null);
      showToast("Deleted");
    } catch (e) { 
      if (e.message?.includes("rate limit")) {
        showToast("Please wait before deleting", "error");
      } else {
        showToast(e.message, "error"); 
      }
    }
  };

  const open   = (m) => { setSelected(m); if (!m.read) markRead(m._id); };
  const unread = messages.filter(m => !m.read).length;

  return (
    <div>
      <Toast {...toast} />
      <SectionHeader title="Messages" sub="Contact form inbox" />
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <FaInbox style={{ color: "#5ba898" }} />
        <span style={{ fontSize: "12px", fontFamily: "monospace", color: "#5ba898" }}>{unread} unread</span>
        <span style={{ fontSize: "12px", fontFamily: "monospace", color: t("rgba(26,18,8,0.4)", "rgba(228,230,235,0.4)") }}>· {messages.length} total</span>
      </div>

      {loading
        ? <div style={{ color: "#5ba898", fontFamily: "monospace", fontSize: "13px" }}>Loading…</div>
        : messages.length === 0
          ? <Card><p style={{ fontSize: "13px", color: t("rgba(26,18,8,0.4)", "rgba(228,230,235,0.4)") }}>No messages yet.</p></Card>
          : (
            <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 1.4fr" : "1fr", gap: "16px" }}>
              <div>
                {messages.map(m => (
                  <div key={m._id} onClick={() => open(m)}
                    style={{
                      cursor: "pointer", padding: "14px 16px", marginBottom: "8px", borderRadius: "12px",
                      background: selected?._id === m._id ? t("rgba(91,168,152,0.08)", "rgba(91,168,152,0.12)") : t("rgba(255,253,247,0.88)", "rgba(36,37,38,0.88)"),
                      border: `1px solid ${selected?._id === m._id ? "#5ba898" : t("rgba(26,18,8,0.07)", "rgba(255,255,255,0.07)")}`,
                      transition: "all .2s",
                    }}
                    onMouseEnter={e => { if (selected?._id !== m._id) e.currentTarget.style.borderColor = "#5ba898"; }}
                    onMouseLeave={e => { if (selected?._id !== m._id) e.currentTarget.style.borderColor = t("rgba(26,18,8,0.07)", "rgba(255,255,255,0.07)"); }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                      <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: m.read ? "transparent" : "#5ba898", border: m.read ? `1px solid ${t("rgba(26,18,8,0.2)", "rgba(255,255,255,0.2)")}` : undefined, flexShrink: 0 }} />
                      <span style={{ fontSize: "13px", fontWeight: m.read ? 500 : 700, color: t("#1a1208", "#e4e6eb"), flex: 1 }}>{m.name}</span>
                      <span style={{ fontSize: "10px", fontFamily: "monospace", color: t("rgba(26,18,8,0.35)", "rgba(228,230,235,0.35)") }}>{new Date(m.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div style={{ fontSize: "11px", color: t("rgba(26,18,8,0.5)", "rgba(228,230,235,0.45)"), paddingLeft: "15px", fontFamily: "monospace" }}>{m.subject || "No subject"}</div>
                    <div style={{ fontSize: "11px", color: t("rgba(26,18,8,0.4)", "rgba(228,230,235,0.35)"), paddingLeft: "15px", marginTop: "3px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.message}</div>
                  </div>
                ))}
              </div>
              {selected && (
                <Card>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
                    <div>
                      <div style={{ fontSize: "16px", fontWeight: 700, fontFamily: "Georgia,serif", color: t("#1a1208", "#e4e6eb"), marginBottom: "4px" }}>{selected.name}</div>
                      <a href={`mailto:${selected.email}`} style={{ fontSize: "12px", fontFamily: "monospace", color: "#5ba898", textDecoration: "none" }}>{selected.email}</a>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <Btn small onClick={() => del(selected._id)} danger><FaTrash /></Btn>
                      <Btn small onClick={() => setSelected(null)} color="#8a7ab8"><FaXmark /></Btn>
                    </div>
                  </div>
                  {selected.subject && <div style={{ fontSize: "11px", fontFamily: "monospace", letterSpacing: "1.5px", textTransform: "uppercase", color: "#5ba898", marginBottom: "8px" }}>{selected.subject}</div>}
                  <div style={{ fontSize: "13px", lineHeight: 1.8, color: t("rgba(26,18,8,0.7)", "rgba(228,230,235,0.65)"), padding: "14px", borderRadius: "10px", background: t("rgba(26,18,8,0.03)", "rgba(255,255,255,0.03)"), border: `1px solid ${t("rgba(26,18,8,0.06)", "rgba(255,255,255,0.05)")}` }}>
                    {selected.message}
                  </div>
                  <div style={{ marginTop: "12px", fontSize: "10px", fontFamily: "monospace", color: t("rgba(26,18,8,0.35)", "rgba(228,230,235,0.3)") }}>
                    Received {new Date(selected.createdAt).toLocaleString()}
                  </div>
                  <div style={{ marginTop: "12px" }}>
                    <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || "Your message")}`}
                      style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "8px", background: "#5ba898", color: "#fff", fontSize: "12px", fontFamily: "monospace", fontWeight: 600, textDecoration: "none" }}>
                      <FaEnvelope /> Reply via Email
                    </a>
                  </div>
                </Card>
              )}
            </div>
          )
      }
    </div>
  );
}

/* ─────────────────────── Page: Settings ───────────────────────── */
function SettingsPage() {
  const t        = useT();
  const navigate = useNavigate();

  const [credForm,   setCredForm]   = useState({ currentPassword: "", newUsername: "", newPassword: "", confirmPassword: "" });
  const [credSaving, setCredSaving] = useState(false);
  const [toast,      showToast]     = useToast();
  const setC = (k, v) => setCredForm(f => ({ ...f, [k]: v }));

  const handleLogout = () => {
    localStorage.removeItem("ak_token");
    sessionStorage.removeItem("ak_admin");
    window.location.href = "/"; 
  };

  const saveCredentials = async () => {
    if (!credForm.currentPassword) {
      showToast("Current password is required", "error"); return;
    }
    if (!credForm.newUsername && !credForm.newPassword) {
      showToast("Enter a new username or password", "error"); return;
    }
    if (credForm.newPassword && credForm.newPassword !== credForm.confirmPassword) {
      showToast("New passwords don't match", "error"); return;
    }
    if (credForm.newPassword && credForm.newPassword.length < 6) {
      showToast("Password must be at least 6 characters", "error"); return;
    }

    setCredSaving(true);
    try {
      const BASE  = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const token = localStorage.getItem("ak_token");

      const body = { currentPassword: credForm.currentPassword };
      if (credForm.newUsername.trim()) body.newUsername = credForm.newUsername.trim();
      if (credForm.newPassword)        body.newPassword = credForm.newPassword;

      const res  = await fetch(`${BASE}/auth/credentials`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to update credentials");

      showToast("Credentials updated ✓ — logging you out…", "success");
      setCredForm({ currentPassword: "", newUsername: "", newPassword: "", confirmPassword: "" });

      setTimeout(() => {
        localStorage.removeItem("ak_token");
        sessionStorage.removeItem("ak_admin");
        navigate("/admin-login");
      }, 2000);
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setCredSaving(false);
    }
  };

  return (
    <div>
      <Toast {...toast} />
      <SectionHeader title="Settings" sub="Account & preferences" />

      <Card title="Account">
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {[
            ["Role",    "Administrator"],
            ["Auth",    "JWT — stored in localStorage"],
            ["Session", "Active"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", gap: "16px", padding: "8px 0", borderBottom: `1px solid ${t("rgba(26,18,8,0.05)", "rgba(255,255,255,0.05)")}` }}>
              <span style={{ fontSize: "11px", fontFamily: "monospace", color: t("rgba(26,18,8,0.4)", "rgba(228,230,235,0.4)"), minWidth: "100px" }}>{k}</span>
              <span style={{ fontSize: "13px", color: t("#1a1208", "#e4e6eb") }}>{v}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Change Username / Password" accent="#d4935a">
        <p style={{ fontSize: "12px", color: t("rgba(26,18,8,0.5)", "rgba(228,230,235,0.5)"), marginBottom: "18px", lineHeight: 1.6 }}>
          Update your admin login credentials. You will be logged out automatically after saving so the new credentials take effect.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Input
            label="Current Password (required)"
            value={credForm.currentPassword}
            onChange={v => setC("currentPassword", v)}
            type="password"
            placeholder="Your current password"
          />
          <div style={{ width: "100%", height: "1px", background: t("rgba(26,18,8,0.07)", "rgba(255,255,255,0.07)"), margin: "4px 0" }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <Input
              label="New Username (optional)"
              value={credForm.newUsername}
              onChange={v => setC("newUsername", v)}
              placeholder="Leave blank to keep current"
            />
            <div />
            <Input
              label="New Password (optional)"
              value={credForm.newPassword}
              onChange={v => setC("newPassword", v)}
              type="password"
              placeholder="Min. 6 characters"
            />
            <Input
              label="Confirm New Password"
              value={credForm.confirmPassword}
              onChange={v => setC("confirmPassword", v)}
              type="password"
              placeholder="Repeat new password"
            />
          </div>
          <div style={{ marginTop: "4px" }}>
            <Btn onClick={saveCredentials} disabled={credSaving} color="#d4935a">
              {credSaving ? <><Spinner /> Saving…</> : <><FaKey /> Update Credentials</>}
            </Btn>
          </div>
        </div>
      </Card>

      <Card title="Danger Zone" accent="#c96a6a">
        <p style={{ fontSize: "12px", color: t("rgba(26,18,8,0.5)", "rgba(228,230,235,0.5)"), marginBottom: "12px" }}>
          Log out of the admin panel.
        </p>
        <Btn onClick={handleLogout} danger><FaRightFromBracket /> Logout</Btn>
      </Card>
    </div>
  );
}

/* ─────────────────────── Main Dashboard ───────────────────────── */
const PAGES = {
  overview: OverviewPage, about: AboutPage, skills: SkillsPage,
  projects: ProjectsPage, education: EducationPage, experience: ExperiencePage,
  messages: MessagesPage, settings: SettingsPage,
};

export default function AdminDashboard() {
  const { isDark } = useTheme();
  const navigate   = useNavigate();
  const sectionRef = useRef(null);
  const [active,      setActive]      = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const t = (l, d) => isDark ? d : l;

  function handleLogout() {
    localStorage.removeItem("ak_token");
    sessionStorage.removeItem("ak_admin");
    navigate("/");
  }

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const SIDEBAR_W  = sidebarOpen ? 220 : 0;
  const ICON_W     = 56;
  const ActivePage = PAGES[active] || PAGES.overview;

  return (
    <div
      ref={sectionRef}
      style={{
        minHeight: "100vh", background: t("#f0e8d8", "#18191a"),
        display: "flex", position: "relative", overflow: "hidden",
        transition: "background 0.6s",
      }}
    >
      <AnimatedBackground sectionRef={sectionRef} />
      <ThemeToggle />
      <DevModeToggle />

      {/* Mobile overlay */}
      {sidebarOpen && window.innerWidth <= 768 && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.5)", zIndex: 99,
            transition: "opacity 0.3s ease",
          }}
        />
      )}

      {/* Sidebar */}
      <div style={{
        position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 100,
        display: "flex", flexDirection: "column",
        width: `${ICON_W + SIDEBAR_W}px`,
        transform: window.innerWidth <= 768 && !sidebarOpen ? `translateX(-${ICON_W}px)` : "translateX(0)",
        transition: "width 0.3s cubic-bezier(.4,0,.2,1), transform 0.3s cubic-bezier(.4,0,.2,1)",
        background: t("rgba(255,253,247,0.94)", "rgba(22,23,24,0.96)"),
        borderRight: `1px solid ${t("rgba(26,18,8,0.08)", "rgba(255,255,255,0.07)")}`,
        backdropFilter: "blur(18px)", overflow: "hidden",
      }}>
        {/* Logo row */}
        <div style={{ display: "flex", alignItems: "center", padding: "18px 12px 12px", gap: "10px", flexShrink: 0, minHeight: "72px" }}>
          <button
            onClick={() => setSidebarOpen(o => !o)}
            style={{ width: "32px", height: "32px", borderRadius: "8px", border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#5ba898", flexShrink: 0, transition: "background .2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(91,168,152,0.12)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            {sidebarOpen ? <FaXmark size={15} /> : <FaBars size={15} />}
          </button>
          <div style={{ overflow: "hidden", whiteSpace: "nowrap", opacity: sidebarOpen ? 1 : 0, transition: "opacity .2s", pointerEvents: sidebarOpen ? "auto" : "none" }}>
            <div style={{ fontSize: "13px", fontWeight: 600, fontFamily: "Georgia,serif", color: t("#1a1208", "#e4e6eb") }}>Aayush Kattel</div>
            <div style={{ fontSize: "9px", fontFamily: "monospace", letterSpacing: "2px", textTransform: "uppercase", color: "#5ba898" }}>Admin Panel</div>
          </div>
        </div>

        <div style={{ width: "100%", height: "1px", background: t("rgba(26,18,8,0.07)", "rgba(255,255,255,0.07)"), flexShrink: 0 }} />

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
          {NAV.map(({ id, label, Icon }) => {
            const isActive = active === id;
            return (
              <button key={id} onClick={() => { setActive(id); if (window.innerWidth <= 768) setSidebarOpen(false); }} title={!sidebarOpen ? label : undefined}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: "12px",
                  padding: "10px 10px", borderRadius: "10px", border: "none", cursor: "pointer",
                  marginBottom: "3px", textAlign: "left", whiteSpace: "nowrap", overflow: "hidden",
                  background: isActive ? "rgba(91,168,152,0.15)" : "transparent",
                  color: isActive ? "#5ba898" : t("rgba(26,18,8,0.5)", "rgba(228,230,235,0.5)"),
                  fontFamily: "monospace", fontSize: "12px", letterSpacing: ".02em",
                  borderLeft: isActive ? "2px solid #5ba898" : "2px solid transparent",
                  transition: "all .2s",
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = t("rgba(26,18,8,0.04)", "rgba(255,255,255,0.05)"); e.currentTarget.style.color = t("#1a1208", "#e4e6eb"); } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = t("rgba(26,18,8,0.5)", "rgba(228,230,235,0.5)"); } }}
              >
                <Icon size={14} style={{ flexShrink: 0 }} />
                <span style={{ opacity: sidebarOpen ? 1 : 0, transition: "opacity .15s" }}>{label}</span>
              </button>
            );
          })}
        </nav>

        <div style={{ width: "100%", height: "1px", background: t("rgba(26,18,8,0.07)", "rgba(255,255,255,0.07)") }} />

        {/* Logout */}
        <div style={{ padding: "10px 8px 18px" }}>
          <button
            onClick={handleLogout}
            title={!sidebarOpen ? "Logout" : undefined}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: "12px",
              padding: "10px 10px", borderRadius: "10px", border: "none", cursor: "pointer",
              background: "transparent", color: "#c96a6a", fontFamily: "monospace", fontSize: "12px",
              whiteSpace: "nowrap", overflow: "hidden", transition: "background .2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(201,106,106,0.1)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <FaRightFromBracket size={14} style={{ flexShrink: 0 }} />
            <span style={{ opacity: sidebarOpen ? 1 : 0, transition: "opacity .15s" }}>Logout</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1, marginLeft: window.innerWidth <= 768 ? (sidebarOpen ? `${ICON_W + SIDEBAR_W}px` : "0") : `${ICON_W + SIDEBAR_W}px`,
        transition: "margin-left 0.3s cubic-bezier(.4,0,.2,1)",
        minHeight: "100vh", position: "relative", zIndex: 1,
      }}>
        {/* Top bar */}
        <div style={{
          position: "sticky", top: 0, zIndex: 50, height: "54px",
          display: "flex", alignItems: "center", padding: "0 32px", gap: "12px",
          background: t("rgba(240,232,216,0.88)", "rgba(20,21,22,0.9)"),
          borderBottom: `1px solid ${t("rgba(26,18,8,0.07)", "rgba(255,255,255,0.06)")}`,
          backdropFilter: "blur(14px)", transition: "background 0.6s",
        }}>
          {/* Mobile menu button */}
          {window.innerWidth <= 768 && !sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                background: "transparent", border: "none", cursor: "pointer",
                color: "#5ba898", display: "flex", alignItems: "center",
                padding: "8px", marginRight: "8px",
              }}
            >
              <FaBars size={18} />
            </button>
          )}
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: "12px", fontFamily: "monospace", color: "#5ba898" }}>aayush</span>
            <span style={{ color: t("rgba(26,18,8,0.3)", "rgba(255,255,255,0.25)"), fontFamily: "monospace", fontSize: "12px" }}>@portfolio:/admin/</span>
            <span style={{ color: "#a855f7", fontFamily: "monospace", fontSize: "12px" }}>{active}</span>
          </div>
          <span style={{ fontSize: "10px", fontFamily: "monospace", color: t("rgba(26,18,8,0.3)", "rgba(228,230,235,0.3)") }}>
            {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
          </span>
        </div>

        <div style={{ padding: "36px 40px 80px", maxWidth: "920px" }}>
          <ActivePage />
        </div>
      </div>

      <style>{`
        @keyframes borderSlide { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes toastIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        
        /* Responsive styles - only for mobile/tablet */
        @media (max-width: 768px) {
          /* Main content padding */
          .admin-main-content {
            padding: 24px 20px 60px !important;
          }
          
          /* Card padding */
          .card-inner {
            padding: 20px !important;
          }
          
          /* Grid layouts - stack on mobile */
          .bio-grid, .stats-grid, .form-grid {
            grid-template-columns: 1fr !important;
          }
          
          /* Skills section - maintain layout but allow wrapping */
          .skills-add-form {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          
          .skills-add-form > div {
            width: 100% !important;
          }
          
          /* Project cards - stack on mobile */
          .project-card {
            flex-direction: column !important;
          }
          
          .project-image {
            width: 100% !important;
            height: auto !important;
            max-width: 200px !important;
          }
          
          /* Messages layout - stack on mobile */
          .messages-layout {
            grid-template-columns: 1fr !important;
          }
          
          /* Button groups */
          .button-group {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          
          .button-group button {
            width: 100% !important;
            justify-content: center !important;
          }
          
          /* Stats cards */
          .stats-grid {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)) !important;
          }
          
          /* Education/Experience items */
          .education-item, .experience-item {
            flex-direction: column !important;
          }
          
          .item-actions {
            margin-top: 12px !important;
            justify-content: flex-start !important;
          }
        }
        
        /* Tablet styles */
        @media (min-width: 769px) and (max-width: 1024px) {
          .bio-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          
          .stats-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          
          .form-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}