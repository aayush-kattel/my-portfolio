import { useRef, useState, useEffect, useCallback } from "react";
import { FaChevronLeft, FaChevronRight, FaEye } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedBackground from "./AnimatedBackground";
import AKLogo from "./AKLogo";
import { useTheme } from "../hooks/useTheme";
import { apiGetProjects } from "../api";

const THUMB_STYLES = [
  "linear-gradient(135deg,#1a1a2e,#16213e,#0f3460,#e94560)",
  "linear-gradient(135deg,#0d0d0d,#1a1a1a,#2d2d2d,#5ba898)",
  "linear-gradient(135deg,#2c3e50,#3498db,#2980b9,#1abc9c)",
  "linear-gradient(135deg,#1e3c72,#2a5298,#f7971e,#ffd200)",
  "linear-gradient(135deg,#4a1942,#c0392b,#e74c3c,#f39c12)",
  "linear-gradient(135deg,#134e5e,#71b280,#5ba898,#d4935a)",
];
const THUMB_ICONS   = ["🛒","👤","💬","📊","🧠","✈️"];
const INTERVAL      = 4500;
const STATUS_COLORS = { Live:"#5ba898", WIP:"#d4935a", Draft:"#8a7ab8", Archived:"#c96a6a" };

export default function ProjectsSection() {
  const { isDark } = useTheme();
  const sectionRef = useRef(null);
  const autoRef    = useRef(null);
  const barRef     = useRef(null);
  const [projects,  setProjects] = useState([]);
  const [loading,   setLoading]  = useState(true);
  const [current,   setCurrent]  = useState(0);
  const [direction, setDir]      = useState(1);
  const t = (l, d) => isDark ? d : l;

  useEffect(() => {
    const fetchProjects = () => {
      setLoading(true);
      apiGetProjects()
        .then(data => setProjects(
          data.filter(p => p.status === "Live" || p.status === "WIP" || p.featured)
        ))
        .catch(() => {})
        .finally(() => setLoading(false));
    };

    fetchProjects();

    const handleVisibility = () => {
      if (document.visibilityState === "visible") fetchProjects();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const pad = (n) => String(n).padStart(2, "0");

  const stopAuto = useCallback(() => {
    clearTimeout(autoRef.current);
    if (barRef.current) { barRef.current.style.transition = "none"; barRef.current.style.width = "0%"; }
  }, []);

  const startAuto = useCallback(() => {
    stopAuto();
    if (!projects.length) return;
    if (barRef.current) {
      barRef.current.style.transition = "none";
      barRef.current.style.width = "0%";
      barRef.current.offsetHeight;
      barRef.current.style.transition = `width ${INTERVAL}ms linear`;
      barRef.current.style.width = "100%";
    }
    autoRef.current = setTimeout(() => { setDir(1); setCurrent(c => (c + 1) % projects.length); }, INTERVAL);
  }, [projects, stopAuto]);

  useEffect(() => { startAuto(); return stopAuto; }, [current, startAuto, stopAuto]);

  const navigate = (dir) => { if (!projects.length) return; stopAuto(); setDir(dir); setCurrent(c => (c + dir + projects.length) % projects.length); };
  const goTo     = (idx)  => { stopAuto(); setDir(idx > current ? 1 : -1); setCurrent(idx); };

  const variants = {
    enter:  (d) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center:        { x: 0, opacity: 1 },
    exit:   (d) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
  };

  const p = projects[current];

  return (
    <>
      <style>{`
        @keyframes borderSlide { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .projects-card-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          align-items: center;
        }
        @media (max-width: 700px) {
          .projects-card-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }
      `}</style>

      <section id="projects" ref={sectionRef} style={{ position:"relative", overflow:"hidden", background:"transparent", padding:"90px clamp(18px,5vw,40px) 70px" }}>
        <AnimatedBackground sectionRef={sectionRef} />
        <div style={{ position:"relative", zIndex:1, maxWidth:"1100px", margin:"0 auto" }}>

          {/* Header — always renders */}
          <div className="reveal">
            <AKLogo />
            <p style={{ fontSize:"11px", fontFamily:"monospace", letterSpacing:"3px", textTransform:"uppercase", color:"#5ba898", marginBottom:"8px" }}>What I've Built</p>
            <h2 style={{ fontSize:"clamp(26px,4vw,42px)", fontWeight:700, fontFamily:"Georgia,serif", letterSpacing:"-0.5px", marginBottom:"10px", color:t("#1a1208","#e4e6eb"), transition:"color 0.6s" }}>
              My <span className="grad-text">Projects</span>
            </h2>
            <div style={{ width:"48px", height:"3px", borderRadius:"2px", background:"linear-gradient(90deg,#5ba898,#d4935a)", marginBottom:"36px" }} />
          </div>

          {/* Loading */}
          {loading && (
            <p style={{ color:"#5ba898", fontFamily:"monospace", fontSize:"13px" }}>Loading projects…</p>
          )}

          {/* Empty */}
          {!loading && projects.length === 0 && (
            <p style={{ color:"#5ba898", fontFamily:"monospace", fontSize:"13px" }}>No projects to display yet.</p>
          )}

          {/* Card — only when data is ready */}
          {!loading && projects.length > 0 && p && (
            <div className="reveal">
              <div style={{ position:"relative", borderRadius:"22px" }}>
                <div style={{ position:"absolute", inset:0, borderRadius:"22px", background:"linear-gradient(90deg,transparent,#5ba898,#d4935a,#c96a6a,#7aaa6a,#8a7ab8,#5ba898,transparent)", backgroundSize:"200% 100%", animation:"borderSlide 3s linear infinite" }} />
                <div style={{ position:"relative", zIndex:1, margin:"2px", borderRadius:"20px", padding:"clamp(16px,4vw,32px)", background:t("rgba(255,253,247,0.92)","rgba(36,37,38,0.92)"), boxShadow:t("0 4px 32px rgba(26,18,8,0.06)","0 4px 32px rgba(0,0,0,0.25)"), transition:"background 0.6s" }}>

                  {/* Top bar */}
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"24px" }}>
                    <span style={{ fontSize:"12px", fontFamily:"monospace", color:"#5ba898", letterSpacing:"1px" }}>
                      {pad(current + 1)} / {pad(projects.length)}
                    </span>
                    <div style={{ display:"flex", gap:"10px" }}>
                      {[{ dir: -1, Icon: FaChevronLeft }, { dir: 1, Icon: FaChevronRight }].map(({ dir: d, Icon }) => (
                        <button key={d} onClick={() => navigate(d)}
                          style={{ width:"40px", height:"40px", borderRadius:"50%", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px", background:"transparent", color:t("#1a1208","#e4e6eb"), border:`1.5px solid ${t("rgba(26,18,8,0.3)","rgba(228,230,235,0.25)")}`, transition:"all 0.2s" }}
                          onMouseEnter={e => { e.currentTarget.style.background="#5ba898"; e.currentTarget.style.color="#fff"; e.currentTarget.style.borderColor="#5ba898"; e.currentTarget.style.transform="scale(1.1)"; }}
                          onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color=t("#1a1208","#e4e6eb"); e.currentTarget.style.borderColor=t("rgba(26,18,8,0.3)","rgba(228,230,235,0.25)"); e.currentTarget.style.transform="scale(1)"; }}
                        ><Icon /></button>
                      ))}
                    </div>
                  </div>

                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={current}
                      custom={direction}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                      className="projects-card-grid"
                    >
                      {/* Thumbnail */}
                      <div style={{ position:"relative", borderRadius:"14px", overflow:"hidden", aspectRatio:"16/10" }}>
                        {p.imageUrl
                          ? <img src={p.imageUrl} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                          : (
                            <div style={{ width:"100%", height:"100%", background:THUMB_STYLES[current % THUMB_STYLES.length], position:"relative" }}>
                              <div style={{ position:"absolute", top:"14px", left:"50%", transform:"translateX(-50%)", width:"85%", background:"rgba(255,255,255,0.12)", borderRadius:"6px", padding:"5px 10px", display:"flex", alignItems:"center", gap:"5px" }}>
                                {["#ff5f57","#ffbd2e","#28c840"].map(c => <div key={c} style={{ width:"7px", height:"7px", borderRadius:"50%", background:c }} />)}
                                <div style={{ flex:1, height:"4px", borderRadius:"3px", background:"rgba(255,255,255,0.18)" }} />
                              </div>
                              <div style={{ position:"absolute", bottom:"20px", right:"20px", fontSize:"52px", opacity:0.18 }}>{THUMB_ICONS[current % THUMB_ICONS.length]}</div>
                              <div style={{ position:"absolute", bottom:"14px", left:"16px", fontSize:"14px", fontWeight:600, fontFamily:"Georgia,serif", color:"rgba(255,255,255,0.92)" }}>{p.name}</div>
                              <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,transparent 55%,rgba(0,0,0,0.55) 100%)" }} />
                            </div>
                          )
                        }
                        <div style={{ position:"absolute", top:"14px", left:"14px", fontSize:"10px", fontFamily:"monospace", letterSpacing:"1.5px", textTransform:"uppercase", padding:"4px 10px", borderRadius:"20px", background:`${STATUS_COLORS[p.status] || "#5ba898"}cc`, color:"#fff" }}>{p.status}</div>
                      </div>

                      {/* Info */}
                      <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
                        <div style={{ fontSize:"11px", fontFamily:"monospace", color:"#5ba898", letterSpacing:"2px", textTransform:"uppercase" }}>Project {pad(current + 1)}</div>
                        <h3 style={{ fontSize:"clamp(18px,2.4vw,26px)", fontWeight:700, fontFamily:"Georgia,serif", lineHeight:1.2, color:t("#1a1208","#e4e6eb"), transition:"color 0.6s" }}>{p.name}</h3>
                        {p.description && <p style={{ fontSize:"13px", lineHeight:1.8, color:t("rgba(40,30,10,0.62)","rgba(228,230,235,0.52)") }}>{p.description}</p>}
                        {p.tags?.length > 0 && (
                          <div>
                            <p style={{ fontSize:"10px", fontFamily:"monospace", letterSpacing:"2px", textTransform:"uppercase", color:"#5ba898", marginBottom:"7px" }}>Tech Stack</p>
                            <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
                              {p.tags.map(s => <span key={s} style={{ fontSize:"10px", fontFamily:"monospace", padding:"3px 9px", borderRadius:"10px", background:t("rgba(91,168,152,0.1)","rgba(91,168,152,0.15)"), color:t("#2d6a5e","#5ba898") }}>{s}</span>)}
                            </div>
                          </div>
                        )}
                        <div style={{ display:"flex", gap:"10px", marginTop:"4px", flexWrap:"wrap" }}>
                          {p.liveUrl && (
                            <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                              style={{ flex:1, minWidth:"100px", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", padding:"11px 16px", borderRadius:"9px", background:"#5ba898", color:"#fff", fontWeight:600, fontSize:"13px", textDecoration:"none", transition:"opacity 0.2s,transform 0.15s" }}
                              onMouseEnter={e => { e.currentTarget.style.opacity=".88"; e.currentTarget.style.transform="translateY(-1px)"; }}
                              onMouseLeave={e => { e.currentTarget.style.opacity="1"; e.currentTarget.style.transform="translateY(0)"; }}
                            ><FaEye /> Preview</a>
                          )}
                          {p.githubUrl && (
                            <a href={p.githubUrl} target="_blank" rel="noopener noreferrer"
                              style={{ flex:1, minWidth:"100px", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", padding:"11px 16px", borderRadius:"9px", fontWeight:600, fontSize:"13px", textDecoration:"none", background:t("rgba(26,18,8,0.07)","rgba(228,230,235,0.07)"), color:t("#1a1208","#e4e6eb"), border:`0.5px solid ${t("rgba(26,18,8,0.15)","rgba(228,230,235,0.12)")}`, transition:"background 0.2s,transform 0.15s" }}
                              onMouseEnter={e => { e.currentTarget.style.background="rgba(91,168,152,0.12)"; e.currentTarget.style.transform="translateY(-1px)"; }}
                              onMouseLeave={e => { e.currentTarget.style.background=t("rgba(26,18,8,0.07)","rgba(228,230,235,0.07)"); e.currentTarget.style.transform="translateY(0)"; }}
                            ><FaGithub /> Code</a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Dots */}
                  <div style={{ display:"flex", gap:"7px", justifyContent:"center", marginTop:"26px" }}>
                    {projects.map((_, i) => (
                      <div key={i} onClick={() => goTo(i)} style={{ width:i===current?"22px":"7px", height:"7px", borderRadius:i===current?"4px":"50%", background:i===current?"#5ba898":t("rgba(26,18,8,0.18)","rgba(228,230,235,0.2)"), cursor:"pointer", transition:"all 0.3s" }} />
                    ))}
                  </div>

                  {/* Progress bar */}
                  <div style={{ width:"100%", height:"2px", borderRadius:"1px", overflow:"hidden", marginTop:"18px", background:t("rgba(26,18,8,0.08)","rgba(228,230,235,0.08)") }}>
                    <div ref={barRef} style={{ height:"100%", background:"#5ba898", borderRadius:"1px", width:"0%" }} />
                  </div>

                </div>
              </div>
            </div>
          )}

          <div className="bottom-bar" style={{ marginTop:"50px" }} />
        </div>
      </section>
    </>
  );
}