// pages/UserDemandPage.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import AnimatedBackground from "../components/AnimatedBackground";
import ThemeToggle from "../components/ThemeToggle";
import DevModeToggle from "../components/DevMode";
import html2canvas from "html2canvas";
import {
  FaBars, FaXmark, FaFilePen, FaRightFromBracket,
  FaPlus, FaTrash, FaUpload, FaImage, FaDownload, FaEye, FaPen,
} from "react-icons/fa6";

/* ═══════════════════════════════════════════════════════
   CV THEME DEFINITIONS
   ═══════════════════════════════════════════════════════ */
const CV_THEMES = {
  blue:   { name:"Blue",   accent:"#2a9fd6", accentDeep:"#1a6fa8", muted:"#1e3048", sidebar:"#131f2b", highlight:"#3abf9f" },
  red:    { name:"Red",    accent:"#e05555", accentDeep:"#b83333", muted:"#2e1a1a", sidebar:"#1f1313", highlight:"#e07755" },
  orange: { name:"Orange", accent:"#e07a2a", accentDeep:"#b85f10", muted:"#2e1e10", sidebar:"#1f1610", highlight:"#e0aa2a" },
  green:  { name:"Green",  accent:"#3abf7a", accentDeep:"#228855", muted:"#102e1e", sidebar:"#101f16", highlight:"#7ad65a" },
  purple: { name:"Purple", accent:"#9b6ee0", accentDeep:"#6a3ab8", muted:"#1e1030", sidebar:"#150f20", highlight:"#c06ee0" },
  gold:   { name:"Gold",   accent:"#d4935a", accentDeep:"#a86830", muted:"#2a1e0e", sidebar:"#1a1408", highlight:"#d4c45a" },
};

/* ═══════════════════════════════════════════════════════
   INITIALS AVATAR
   ═══════════════════════════════════════════════════════ */
function initialsAvatar(name, accent) {
  const parts = (name || "").trim().split(" ");
  const ini = parts.length >= 2
    ? parts[0][0] + parts[parts.length - 1][0]
    : (parts[0]?.[0] || "?");
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="110" height="110">
      <rect width="110" height="110" fill="#131f2b"/>
      <text x="55" y="70" text-anchor="middle" font-size="38"
        fill="${accent}" font-family="Georgia,serif" font-weight="600">
        ${ini.toUpperCase()}
      </text>
    </svg>`
  )}`;
}

/* ═══════════════════════════════════════════════════════
   CV PREVIEW COMPONENT
   All colours are hardcoded hex — never inherits from the
   app's light/dark theme. CV is always dark.
   ═══════════════════════════════════════════════════════ */
function CVPreview({ data, cvTheme, photoSrc }) {
  const t      = CV_THEMES[cvTheme];
  const hasExp = data.experience.some(e => e.title || e.company);

  const s = {
    page:      { width:"794px", height:"1123px", display:"grid", gridTemplateColumns:"200px 1fr", fontFamily:"Georgia,'Cormorant Garamond',serif", fontSize:"11.2px", lineHeight:"1.55", color:"#c8d4dc", background:"#0f1923", position:"relative", overflow:"hidden", boxSizing:"border-box" },
    topLine:   { position:"absolute", top:0, left:0, width:"200px", height:"3px", background:t.accent, zIndex:10 },
    sb:        { background:t.sidebar, padding:"26px 16px 20px", display:"flex", flexDirection:"column", gap:"15px", borderRight:`1px solid ${t.muted}` },
    avWrap:    { width:"86px", height:"86px", borderRadius:"50%", margin:"0 auto", border:`2px solid ${t.accent}`, boxShadow:`0 0 0 4px ${t.accent}22`, overflow:"hidden", flexShrink:0 },
    avImg:     { width:"100%", height:"100%", objectFit:"cover", objectPosition:"top center", display:"block" },
    sbName:    { textAlign:"center" },
    sbH2:      { fontFamily:"Georgia,serif", fontSize:"1.08rem", fontWeight:600, color:"#e8edf2", letterSpacing:".01em", lineHeight:1.2 },
    sbRole:    { fontSize:"0.57rem", letterSpacing:".14em", color:t.accent, textTransform:"uppercase", marginTop:"4px", fontWeight:500, fontFamily:"monospace" },
    divider:   { height:"1px", background:t.muted, flexShrink:0 },
    sbH3:      { fontSize:"0.58rem", letterSpacing:".18em", textTransform:"uppercase", color:t.accent, fontWeight:600, marginBottom:"8px", fontFamily:"monospace" },
    cl:        { listStyle:"none", padding:0, margin:0, display:"flex", flexDirection:"column", gap:"5px" },
    clLi:      { display:"flex", alignItems:"flex-start", gap:"6px", fontSize:"0.68rem", color:"#7a9ab5", lineHeight:1.4, wordBreak:"break-all", overflowWrap:"anywhere" },
    clDot:     { width:"4px", height:"4px", borderRadius:"50%", background:t.accent, marginTop:"6px", flexShrink:0 },
    tags:      { display:"flex", flexWrap:"wrap", gap:"4px" },
    tag:       { fontSize:"0.6rem", padding:"2px 7px", borderRadius:"3px", background:"#0f1923", color:"#6a8aa5", border:`1px solid ${t.muted}`, fontFamily:"monospace" },
    /* MAIN — always white with dark text */
    main:      { background:"#ffffff", display:"flex", flexDirection:"column" },
    hero:      { padding:"18px 28px 12px", borderBottom:"1px solid #e8edf2", flexShrink:0, background:"#ffffff" },
    heroEye:   { fontSize:"0.57rem", letterSpacing:".22em", textTransform:"uppercase", color:t.accent, fontWeight:600, marginBottom:"3px", fontFamily:"monospace" },
    heroName:  { fontFamily:"Georgia,serif", fontSize:"2.1rem", fontWeight:700, color:"#1a2333", lineHeight:1, letterSpacing:"-.01em" },
    heroSpan:  { color:t.accent },
    secs:      { padding:"11px 28px 0", display:"flex", flexDirection:"column", gap:"10px", flex:1, overflow:"hidden", background:"#ffffff" },
    secLbl:    { display:"flex", alignItems:"center", gap:"8px", marginBottom:"6px" },
    secNum:    { fontSize:"0.55rem", color:t.accentDeep, fontWeight:600, letterSpacing:".05em", fontFamily:"monospace" },
    secTitle:  { fontFamily:"Georgia,serif", fontSize:".96rem", fontWeight:700, color:"#1a2333" },
    secLine:   { flex:1, height:"1px", background:"linear-gradient(90deg,#dde4ec,transparent)" },
    profCard:  { background:"#f7f9fc", borderRadius:"5px", borderLeft:`2.5px solid ${t.accent}`, padding:"9px 13px", color:"#3a5070", fontSize:"0.71rem", lineHeight:1.65, textAlign:"justify" },
    eduList:   { display:"flex", flexDirection:"column", gap:"7px" },
    eduItem:   { display:"flex", gap:"10px" },
    eduDc:     { display:"flex", flexDirection:"column", alignItems:"center", paddingTop:"3px" },
    eduDot:    { width:"7px", height:"7px", borderRadius:"50%", background:t.accent, flexShrink:0 },
    eduLn:     { flex:1, width:"1px", background:"#dde4ec", marginTop:"3px" },
    eduH4:     { fontFamily:"Georgia,serif", fontSize:".81rem", fontWeight:700, color:"#1a2333" },
    eduSchool: { fontSize:".62rem", color:t.accent, fontWeight:600, margin:"1px 0", fontFamily:"monospace" },
    eduYear:   { fontSize:".59rem", color:"#7a90a8", marginBottom:"1px", fontFamily:"monospace" },
    eduDesc:   { color:"#4a6080", fontSize:".66rem", lineHeight:1.4, textAlign:"justify" },
    projGrid:  { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"7px" },
    projCard:  { background:"#f7f9fc", borderRadius:"5px", border:"1px solid #dde4ec", borderLeft:`2.5px solid ${t.accent}`, padding:"8px 10px" },
    projComing:{ background:"#fffbf5", borderRadius:"5px", border:"1px dashed #f0c080", borderLeft:`2.5px solid #e0a040`, padding:"8px 10px" },
    projTitle: { fontFamily:"Georgia,serif", fontSize:".81rem", fontWeight:700, color:"#1a2333", marginBottom:"2px" },
    projStack: { fontSize:".57rem", letterSpacing:".04em", color:t.accent, textTransform:"uppercase", fontWeight:600, marginBottom:"3px", fontFamily:"monospace" },
    projDesc:  { fontSize:".66rem", color:"#4a6080", lineHeight:1.4, textAlign:"justify" },
    expCard:   { background:"#f7f9fc", borderRadius:"5px", borderLeft:`2.5px solid ${t.accent}`, padding:"9px 13px" },
    expTitle:  { fontFamily:"Georgia,serif", fontSize:".86rem", fontWeight:700, color:t.accent, marginBottom:"4px" },
    expDesc:   { fontSize:".69rem", color:"#4a6080", lineHeight:1.6, textAlign:"justify" },
    foot:      { padding:"6px 28px", borderTop:"1px solid #e8edf2", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0, background:"#ffffff" },
    footName:  { fontFamily:"Georgia,serif", fontSize:".7rem", color:"#8a9ab0", fontStyle:"italic" },
    footBar:   { width:"60px", height:"1.5px", background:`linear-gradient(90deg,${t.accent},${t.highlight})`, borderRadius:"2px" },
  };

  const nameParts = (data.name || "Your Name").trim().split(" ");
  const firstName = nameParts[0];
  const lastName  = nameParts.slice(1).join(" ");
  const allSkills = data.skills.filter(Boolean);
  const allTools  = data.tools.filter(Boolean);
  const allEdu    = data.education.filter(e => e.degree || e.school);
  const allProj   = data.projects.filter(p => p.title);
  const allExp    = data.experience.filter(e => e.title || e.company);

  return (
    <div style={s.page} id="cv-preview-render">
      <div style={s.topLine}/>

      {/* ── SIDEBAR ── */}
      <div style={s.sb}>
        <div style={s.avWrap}>
          <img style={s.avImg} src={photoSrc || initialsAvatar(data.name, t.accent)} alt={data.name} crossOrigin="anonymous"/>
        </div>
        <div style={s.sbName}>
          <div style={s.sbH2}>{data.name || "Your Name"}</div>
          <div style={s.sbRole}>{data.role || "Developer"}</div>
        </div>
        <div style={s.divider}/>
        <div>
          <div style={s.sbH3}>Contact</div>
          <ul style={s.cl}>
            {data.phone    && <li style={s.clLi}><span style={s.clDot}/><span>{data.phone}</span></li>}
            {data.email    && <li style={s.clLi}><span style={s.clDot}/><span>{data.email}</span></li>}
            {data.location && <li style={s.clLi}><span style={s.clDot}/><span>{data.location}</span></li>}
            {data.linkedin && <li style={s.clLi}><span style={s.clDot}/><span>{data.linkedin}</span></li>}
            {data.github   && <li style={s.clLi}><span style={s.clDot}/><span>{data.github}</span></li>}
            {data.website  && <li style={s.clLi}><span style={s.clDot}/><span>{data.website}</span></li>}
          </ul>
        </div>
        {allSkills.length > 0 && <>
          <div style={s.divider}/>
          <div>
            <div style={s.sbH3}>Core Skills</div>
            <div style={s.tags}>{allSkills.map((sk,i) => <span key={i} style={s.tag}>{sk}</span>)}</div>
          </div>
        </>}
        {allTools.length > 0 && <>
          <div style={s.divider}/>
          <div>
            <div style={s.sbH3}>Tools & Platforms</div>
            <div style={s.tags}>{allTools.map((tk,i) => <span key={i} style={s.tag}>{tk}</span>)}</div>
          </div>
        </>}
      </div>

      {/* ── MAIN — always dark ── */}
      <div style={s.main}>
        <div style={s.hero}>
          <div style={s.heroEye}>Hello, I'm</div>
          <div style={s.heroName}>{firstName} <span style={s.heroSpan}>{lastName}</span></div>
        </div>

        <div style={s.secs}>
          {data.profile && (
            <div>
              <div style={s.secLbl}><span style={s.secNum}>01</span><span style={s.secTitle}>Profile</span><div style={s.secLine}/></div>
              <div style={s.profCard}>{data.profile}</div>
            </div>
          )}

          {allEdu.length > 0 && (
            <div>
              <div style={s.secLbl}><span style={s.secNum}>02</span><span style={s.secTitle}>Education</span><div style={s.secLine}/></div>
              <div style={s.eduList}>
                {allEdu.map((e,i) => (
                  <div key={i} style={s.eduItem}>
                    <div style={s.eduDc}><div style={s.eduDot}/>{i<allEdu.length-1&&<div style={s.eduLn}/>}</div>
                    <div>
                      <div style={s.eduH4}>{e.degree}</div>
                      {e.school && <div style={s.eduSchool}>{e.school}</div>}
                      {e.year   && <div style={s.eduYear}>{e.year}</div>}
                      {e.desc   && <div style={s.eduDesc}>{e.desc}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {allProj.length > 0 && (
            <div>
              <div style={s.secLbl}><span style={s.secNum}>03</span><span style={s.secTitle}>Projects</span><div style={s.secLine}/></div>
              <div style={s.projGrid}>
                {allProj.map((p,i) => (
                  <div key={i} style={p.coming ? s.projComing : s.projCard}>
                    <div style={{...s.projTitle, color:p.coming?t.highlight:"#b8ccd8"}}>{p.coming?`+ ${p.title}`:p.title}</div>
                    {p.stack && <div style={{...s.projStack, color:p.coming?t.highlight:t.accent}}>{p.stack.toUpperCase()}</div>}
                    {p.desc  && <div style={s.projDesc}>{p.desc}</div>}
                    {p.coming && !p.desc && <div style={{...s.projDesc,color:t.highlight,fontStyle:"italic"}}>Coming soon…</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <div style={s.secLbl}><span style={s.secNum}>04</span><span style={s.secTitle}>Experience</span><div style={s.secLine}/></div>
            {hasExp ? (
              <div style={s.eduList}>
                {allExp.map((e,i) => (
                  <div key={i} style={s.eduItem}>
                    <div style={s.eduDc}><div style={s.eduDot}/>{i<allExp.length-1&&<div style={s.eduLn}/>}</div>
                    <div>
                      <div style={s.eduH4}>{e.title}</div>
                      {e.company && <div style={s.eduSchool}>{e.company}</div>}
                      {e.year    && <div style={s.eduYear}>{e.year}</div>}
                      {e.desc    && <div style={s.eduDesc}>{e.desc}</div>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={s.expCard}>
                <div style={s.expTitle}>{data.expFallbackTitle || "Actively Seeking First Professional Role"}</div>
                <div style={s.expDesc}>{data.expFallback || "Ready to bring fresh energy, strong work ethic, and modern technical skills to a professional team. Open to full-time roles, internships, and remote opportunities."}</div>
              </div>
            )}
          </div>
        </div>

        <div style={s.foot}>
          <span style={s.footName}>{data.name || "Your Name"} — {data.role || "Developer"}</span>
          <div style={s.footBar}/>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   HOISTED STABLE COMPONENTS
   Must be outside CVGeneratorPage so React never remounts
   them mid-keystroke (which kills input focus).
   ═══════════════════════════════════════════════════════ */
function RCard({ title, children, cardBg }) {
  return (
    <div style={{ position:"relative", borderRadius:"16px", marginBottom:"16px" }}>
      <div style={{ position:"absolute", inset:0, borderRadius:"16px", background:"linear-gradient(90deg,transparent,#5ba898,#d4935a,#c96a6a,#7aaa6a,#8a7ab8,#5ba898,transparent)", backgroundSize:"200% 100%", animation:"borderSlide 3s linear infinite" }}/>
      <div style={{ position:"relative", zIndex:1, margin:"2px", borderRadius:"14px", padding:"20px 22px", background:cardBg, backdropFilter:"blur(16px)" }}>
        {title && <div style={{ fontSize:"10px", fontFamily:"monospace", letterSpacing:"2px", textTransform:"uppercase", color:"#5ba898", marginBottom:"14px" }}>{title}</div>}
        {children}
      </div>
    </div>
  );
}

function CvBtn({ onClick, children, small, danger, disabled, style: extraStyle = {} }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ display:"inline-flex", alignItems:"center", gap:"5px", padding:small?"5px 12px":"8px 16px", borderRadius:"7px", border:"none", cursor:disabled?"not-allowed":"pointer", background:danger?"#c96a6a":"#5ba898", color:"#fff", fontSize:small?"11px":"12px", fontFamily:"monospace", fontWeight:600, opacity:disabled?0.6:1, transition:"opacity .2s", ...extraStyle }}
      onMouseEnter={e => !disabled && (e.currentTarget.style.opacity=".8")}
      onMouseLeave={e => !disabled && (e.currentTarget.style.opacity="1")}
    >{children}</button>
  );
}

/* ═══════════════════════════════════════════════════════
   RESPONSIVE CV PREVIEW WRAPPER
   Uses ResizeObserver so the scale always matches the
   actual available container width.
   ═══════════════════════════════════════════════════════ */
function ResponsiveCVPreview({ data, cvTheme, photoSrc }) {
  const wrapRef        = useRef(null);
  const [scale, setScale] = useState(1);
  const CV_W = 794;
  const CV_H = 1123;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      if (w > 0) setScale(Math.min(1, (w - 4) / CV_W));
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={wrapRef} style={{ width:"100%", display:"flex", justifyContent:"center" }}>
      {/* Height placeholder so the page doesn't collapse */}
      <div style={{ width:"100%", height:`${Math.round(CV_H * scale)}px`, position:"relative" }}>
        <div style={{
          position:"absolute",
          top:0,
          left:"50%",
          transform:`translateX(-50%) scale(${scale})`,
          transformOrigin:"top center",
          width:`${CV_W}px`,
          boxShadow:"0 8px 60px rgba(0,0,0,.6), 0 0 0 1px rgba(91,168,152,0.18)",
        }}>
          <CVPreview data={data} cvTheme={cvTheme} photoSrc={photoSrc}/>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CV GENERATOR PAGE
   ═══════════════════════════════════════════════════════ */
function CVGeneratorPage() {
  const { isDark } = useTheme();
  const photoRef   = useRef(null);
  const T = useCallback((l, d) => isDark ? d : l, [isDark]);

  const [step,        setStep]        = useState("form");
  const [cvTheme,     setCvTheme]     = useState("blue");
  const [photoSrc,    setPhotoSrc]    = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [toast,       setToast]       = useState("");

  const [data, setData] = useState({
    name:"", role:"", phone:"", email:"", location:"",
    linkedin:"", github:"", website:"", profile:"",
    expFallbackTitle:"", expFallback:"",
    skills:    ["","","","",""],
    tools:     ["","","","",""],
    education: [{ degree:"", school:"", year:"", desc:"" }, { degree:"", school:"", year:"", desc:"" }],
    projects:  [{ title:"", stack:"", desc:"", coming:false }, { title:"", stack:"", desc:"", coming:false }],
    experience:[{ title:"", company:"", year:"", desc:"" }],
  });

  const text     = T("#1a1208","#e4e6eb");
  const text2    = T("rgba(26,18,8,0.5)","rgba(228,230,235,0.45)");
  const inputBg  = T("#ffffff","rgba(255,255,255,0.05)");
  const inputBdr = T("rgba(26,18,8,0.14)","rgba(228,230,235,0.12)");
  const cardBg   = T("rgba(255,253,247,0.92)","rgba(36,37,38,0.92)");
  const barBg    = T("rgba(240,232,216,0.95)","rgba(20,21,22,0.95)");
  const barBdr   = T("rgba(26,18,8,0.08)","rgba(255,255,255,0.07)");

  const inp = { width:"100%", background:inputBg, border:`1px solid ${inputBdr}`, borderRadius:"8px", padding:"8px 11px", color:text, fontSize:"12.5px", fontFamily:"monospace", outline:"none", transition:"border .2s,box-shadow .2s", boxSizing:"border-box" };
  const lbl = { display:"block", fontSize:"10px", letterSpacing:".12em", textTransform:"uppercase", color:"#5ba898", marginBottom:"4px", fontFamily:"monospace" };
  const fg  = { marginBottom:"11px" };

  const onFocus   = e => { e.target.style.borderColor="#5ba898"; e.target.style.boxShadow="0 0 0 3px rgba(91,168,152,0.12)"; };
  const onBlurEvt = e => { e.target.style.borderColor=inputBdr;  e.target.style.boxShadow="none"; };

  const setField   = useCallback((k,v)       => setData(d => ({...d,[k]:v})), []);
  const setArr     = useCallback((k,i,v)     => setData(d => { const a=[...d[k]]; a[i]=v; return {...d,[k]:a}; }), []);
  const setArrObj  = useCallback((k,i,f,v)   => setData(d => ({...d,[k]:d[k].map((x,idx)=>idx===i?{...x,[f]:v}:x)})), []);
  const addItem    = useCallback((k,empty)   => setData(d => ({...d,[k]:[...d[k],empty]})), []);
  const removeItem = useCallback((k,i)       => setData(d => ({...d,[k]:d[k].filter((_,idx)=>idx!==i)})), []);

  const handlePhoto = e => {
    const file = e.target.files[0]; if (!file) return;
    const r = new FileReader();
    r.onload = ev => setPhotoSrc(ev.target.result);
    r.readAsDataURL(file);
  };

  const showToast = msg => { setToast(msg); setTimeout(()=>setToast(""),2800); };

  /* ── Download PNG ──────────────────────────────────────
     Renders CVPreview into a completely isolated off-screen
     div so html2canvas NEVER touches AnimatedBackground's
     canvas (which can be 0-sized and causes createPattern crash).
  ──────────────────────────────────────────────────────── */
  const handleDownload = useCallback(async () => {
    setDownloading(true);
    showToast("⏳ Generating your CV…");
    try {
      // 1 — isolated off-screen container
      const wrap = document.createElement("div");
      Object.assign(wrap.style, {
        position:"fixed", top:"-9999px", left:"-9999px",
        width:"794px", height:"1123px",
        overflow:"hidden", zIndex:"-1",
        background:"#0f1923", pointerEvents:"none",
      });
      document.body.appendChild(wrap);

      // 2 — render a fresh CVPreview into it
      const { createRoot } = await import("react-dom/client");
      const root = createRoot(wrap);
      await new Promise(resolve => {
        root.render(<CVPreview data={data} cvTheme={cvTheme} photoSrc={photoSrc}/>);
        requestAnimationFrame(() => setTimeout(resolve, 150));
      });

      // 3 — capture ONLY that container; skip any 0-size canvases
      const canvas = await html2canvas(wrap, {
        scale:2,
        useCORS:true,
        allowTaint:false,
        backgroundColor:"#0f1923",
        width:794,
        height:1123,
        ignoreElements: el =>
          el !== wrap &&
          el.tagName === "CANVAS" &&
          (el.width === 0 || el.height === 0),
      });

      // 4 — trigger download
      const link    = document.createElement("a");
      link.download = `${(data.name||"cv").replace(/\s+/g,"_")}_cv.png`;
      link.href     = canvas.toDataURL("image/png");
      link.click();

      // 5 — clean up
      root.unmount();
      document.body.removeChild(wrap);
      showToast("✓ Downloaded!");
    } catch (err) {
      console.error("CV download error:", err);
      showToast("Download failed — see console");
    }
    setDownloading(false);
  }, [data, cvTheme, photoSrc]);

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", minHeight:0 }}>

      {/* ── Sub-topbar ── */}
      <div style={{ flexShrink:0, position:"sticky", top:0, zIndex:10, background:barBg, borderBottom:`1px solid ${barBdr}`, padding:"8px 12px", display:"flex", alignItems:"center", gap:"8px", backdropFilter:"blur(12px)", flexWrap:"wrap" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"4px", fontFamily:"monospace", fontSize:"11px", background:T("rgba(0,0,0,0.06)","rgba(255,255,255,0.04)"), padding:"4px 10px", borderRadius:"7px", border:`1px solid ${barBdr}`, flexShrink:0 }}>
          <span style={{color:"#34d399"}}>cv</span>
          <span style={{color:text2}}>:</span>
          <span style={{color:"#a855f7"}}>{step}</span>
        </div>
        <div style={{flex:1}}/>
        {/* Theme dots */}
        <div style={{display:"flex",alignItems:"center",gap:"5px",flexShrink:0}}>
          <span style={{fontSize:"9px",color:text2,fontFamily:"monospace",letterSpacing:".1em"}}>THEME</span>
          {Object.entries(CV_THEMES).map(([key,th]) => (
            <button key={key} title={th.name} onClick={()=>setCvTheme(key)}
              style={{width:"14px",height:"14px",borderRadius:"50%",background:th.accent,border:cvTheme===key?"2.5px solid #fff":"2px solid transparent",cursor:"pointer",transform:cvTheme===key?"scale(1.3)":"scale(1)",transition:"transform .15s",outline:"none"}}
            />
          ))}
        </div>
        <div style={{width:"1px",height:"16px",background:barBdr,flexShrink:0}}/>
        <button onClick={()=>setStep(s=>s==="form"?"preview":"form")}
          style={{display:"inline-flex",alignItems:"center",gap:"5px",padding:"5px 10px",borderRadius:"7px",border:"none",cursor:"pointer",background:step==="preview"?"linear-gradient(135deg,#5ba898,#4a9080)":T("rgba(26,18,8,0.08)","rgba(255,255,255,0.07)"),color:step==="preview"?"#fff":text,fontSize:"11px",fontFamily:"monospace",fontWeight:600,transition:"background .2s",flexShrink:0}}>
          {step==="form" ? <><FaEye size={11}/> Preview</> : <><FaPen size={10}/> Edit</>}
        </button>
        {step==="preview" && (
          <button onClick={handleDownload} disabled={downloading}
            style={{display:"inline-flex",alignItems:"center",gap:"5px",padding:"5px 10px",borderRadius:"7px",border:"none",cursor:downloading?"wait":"pointer",background:"linear-gradient(135deg,#5ba898,#4a9080)",color:"#fff",fontSize:"11px",fontFamily:"monospace",fontWeight:600,opacity:downloading?0.7:1,flexShrink:0}}>
            <FaDownload size={11}/>{downloading?"Generating…":"Download PNG"}
          </button>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{position:"fixed",top:"68px",right:"20px",zIndex:99999,padding:"10px 18px",borderRadius:"10px",background:"linear-gradient(135deg,#5ba898,#4a9080)",color:"#fff",fontFamily:"monospace",fontSize:"13px",fontWeight:600,boxShadow:"0 4px 20px rgba(0,0,0,0.3)",animation:"toastIn .3s ease"}}>
          {toast}
        </div>
      )}

      {/* ── Body ── */}
      <div style={{flex:1,overflow:"auto",padding:"18px 12px"}}>
        {step==="form" ? (

          /* ══ FORM ══ */
          <div className="cv-form-grid" style={{maxWidth:"980px",margin:"0 auto",display:"grid",gridTemplateColumns:"minmax(0,320px) minmax(0,1fr)",gap:"14px"}}>

            {/* Left */}
            <div>
              <RCard title="// personal_info" cardBg={cardBg}>
                <div style={{...fg,textAlign:"center"}}>
                  <div onClick={()=>photoRef.current?.click()}
                    style={{width:"70px",height:"70px",borderRadius:"50%",border:"2px solid #5ba898",overflow:"hidden",margin:"0 auto 8px",background:T("rgba(26,18,8,0.06)","#0f1923"),display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"border-color .2s"}}
                    onMouseEnter={e=>e.currentTarget.style.borderColor="#d4935a"}
                    onMouseLeave={e=>e.currentTarget.style.borderColor="#5ba898"}>
                    {photoSrc
                      ? <img src={photoSrc} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"top"}} alt=""/>
                      : <FaImage style={{color:"#5ba898",fontSize:"22px"}}/>}
                  </div>
                  <input ref={photoRef} type="file" accept="image/*" onChange={handlePhoto} style={{display:"none"}}/>
                  <label onClick={()=>photoRef.current?.click()} style={{cursor:"pointer",fontSize:"10px",color:"#5ba898",fontFamily:"monospace",letterSpacing:".1em",display:"inline-flex",alignItems:"center",gap:"4px"}}>
                    <FaUpload size={9}/> UPLOAD PHOTO
                  </label>
                  {photoSrc && <button onClick={()=>setPhotoSrc(null)} style={{display:"block",margin:"3px auto 0",background:"none",border:"none",color:"#c96a6a",fontSize:"10px",cursor:"pointer",fontFamily:"monospace"}}>remove</button>}
                </div>
                {[["Full Name","name"],["Role / Title","role"],["Phone","phone"],["Email","email"],["Location","location"],["LinkedIn","linkedin"],["GitHub","github"],["Website","website"]].map(([l,k])=>(
                  <div key={k} style={fg}>
                    <label style={lbl}>{l}</label>
                    <input style={inp} value={data[k]} onChange={e=>setField(k,e.target.value)} placeholder={l} onFocus={onFocus} onBlur={onBlurEvt}/>
                  </div>
                ))}
              </RCard>

              <RCard title="// skills" cardBg={cardBg}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px",marginBottom:"8px"}}>
                  {data.skills.map((sk,i)=>(
                    <input key={i} style={inp} value={sk} onChange={e=>setArr("skills",i,e.target.value)} placeholder={`Skill ${i+1}`} onFocus={onFocus} onBlur={onBlurEvt}/>
                  ))}
                </div>
                <CvBtn small onClick={()=>addItem("skills","")}><FaPlus size={9}/> add skill</CvBtn>
              </RCard>

              <RCard title="// tools_&_platforms" cardBg={cardBg}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px",marginBottom:"8px"}}>
                  {data.tools.map((tk,i)=>(
                    <input key={i} style={inp} value={tk} onChange={e=>setArr("tools",i,e.target.value)} placeholder={`Tool ${i+1}`} onFocus={onFocus} onBlur={onBlurEvt}/>
                  ))}
                </div>
                <CvBtn small onClick={()=>addItem("tools","")}><FaPlus size={9}/> add tool</CvBtn>
              </RCard>
            </div>

            {/* Right */}
            <div>
              <RCard title="// profile_summary" cardBg={cardBg}>
                <textarea style={{...inp,height:"72px",resize:"vertical"}} value={data.profile} onChange={e=>setField("profile",e.target.value)} placeholder="Write a short professional summary…" onFocus={onFocus} onBlur={onBlurEvt}/>
              </RCard>

              <RCard title="// education" cardBg={cardBg}>
                {data.education.map((e,i)=>(
                  <div key={i} style={{borderLeft:"2px solid rgba(91,168,152,0.3)",paddingLeft:"12px",marginBottom:"12px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:"6px"}}>
                      <span style={{fontSize:"10px",color:text2,fontFamily:"monospace"}}>entry_{i+1}</span>
                      {i>0 && <button onClick={()=>removeItem("education",i)} style={{background:"none",border:"none",color:"#c96a6a",fontSize:"10px",cursor:"pointer",fontFamily:"monospace",display:"inline-flex",alignItems:"center",gap:"3px"}}><FaTrash size={9}/> remove</button>}
                    </div>
                    {[["Degree / Certificate","degree"],["School / College","school"],["Year (e.g. 2022–2024)","year"],["Description (optional)","desc"]].map(([l,f])=>(
                      <div key={f} style={{marginBottom:"6px"}}>
                        <label style={lbl}>{l}</label>
                        <input style={inp} value={e[f]} onChange={ev=>setArrObj("education",i,f,ev.target.value)} placeholder={l} onFocus={onFocus} onBlur={onBlurEvt}/>
                      </div>
                    ))}
                  </div>
                ))}
                <CvBtn small onClick={()=>addItem("education",{degree:"",school:"",year:"",desc:""})}><FaPlus size={9}/> add entry</CvBtn>
              </RCard>

              <RCard title="// projects" cardBg={cardBg}>
                {data.projects.map((p,i)=>(
                  <div key={i} style={{borderLeft:`2px solid ${p.coming?"rgba(212,147,90,0.4)":"rgba(91,168,152,0.3)"}`,paddingLeft:"12px",marginBottom:"12px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:"6px",alignItems:"center"}}>
                      <span style={{fontSize:"10px",color:text2,fontFamily:"monospace"}}>project_{i+1}</span>
                      <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
                        <label style={{display:"flex",alignItems:"center",gap:"4px",fontSize:"10px",color:p.coming?"#d4935a":text2,fontFamily:"monospace",cursor:"pointer",fontWeight:p.coming?600:400}}>
                          <input type="checkbox" checked={!!p.coming} onChange={e=>setArrObj("projects",i,"coming",e.target.checked)} style={{accentColor:"#d4935a"}}/>
                          {p.coming?"✓ coming soon":"coming soon"}
                        </label>
                        {i>0 && <button onClick={()=>removeItem("projects",i)} style={{background:"none",border:"none",color:"#c96a6a",fontSize:"10px",cursor:"pointer",fontFamily:"monospace",display:"inline-flex",alignItems:"center",gap:"3px"}}><FaTrash size={9}/> remove</button>}
                      </div>
                    </div>
                    {p.coming && <div style={{fontSize:"10px",color:"#d4935a",fontFamily:"monospace",marginBottom:"8px",padding:"4px 8px",background:"rgba(212,147,90,0.08)",borderRadius:"5px",border:"1px solid rgba(212,147,90,0.2)"}}>This project will display as "coming soon" in the CV</div>}
                    {[["Title","title"],["Tech Stack","stack"],["Description","desc"]].map(([l,f])=>(
                      <div key={f} style={{marginBottom:"6px"}}>
                        <label style={lbl}>{l}</label>
                        <input style={inp} value={p[f]} onChange={ev=>setArrObj("projects",i,f,ev.target.value)} placeholder={l} onFocus={onFocus} onBlur={onBlurEvt}/>
                      </div>
                    ))}
                  </div>
                ))}
                <CvBtn small onClick={()=>addItem("projects",{title:"",stack:"",desc:"",coming:false})}><FaPlus size={9}/> add project</CvBtn>
              </RCard>

              <RCard title="// experience" cardBg={cardBg}>
                <div style={{fontSize:"10px",color:text2,fontFamily:"monospace",marginBottom:"12px",padding:"6px 10px",background:T("rgba(26,18,8,0.05)","rgba(255,255,255,0.04)"),borderRadius:"6px",border:`1px solid ${T("rgba(26,18,8,0.08)","rgba(255,255,255,0.06)")}`}}>
                  Leave empty → shows "seeking role" fallback · Add entries → shows timeline
                </div>
                {data.experience.map((e,i)=>(
                  <div key={i} style={{borderLeft:"2px solid rgba(91,168,152,0.3)",paddingLeft:"12px",marginBottom:"12px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:"6px"}}>
                      <span style={{fontSize:"10px",color:text2,fontFamily:"monospace"}}>exp_{i+1}</span>
                      {i>0 && <button onClick={()=>removeItem("experience",i)} style={{background:"none",border:"none",color:"#c96a6a",fontSize:"10px",cursor:"pointer",fontFamily:"monospace",display:"inline-flex",alignItems:"center",gap:"3px"}}><FaTrash size={9}/> remove</button>}
                    </div>
                    {[["Job Title","title"],["Company / Organisation","company"],["Year (e.g. 2023–2024)","year"],["Description","desc"]].map(([l,f])=>(
                      <div key={f} style={{marginBottom:"6px"}}>
                        <label style={lbl}>{l}</label>
                        <input style={inp} value={e[f]} onChange={ev=>setArrObj("experience",i,f,ev.target.value)} placeholder={l} onFocus={onFocus} onBlur={onBlurEvt}/>
                      </div>
                    ))}
                  </div>
                ))}
                <div style={{borderTop:`1px solid ${T("rgba(26,18,8,0.07)","rgba(255,255,255,0.07)")}`,paddingTop:"12px",marginTop:"4px"}}>
                  <div style={{fontSize:"10px",color:"#5ba898",fontFamily:"monospace",marginBottom:"8px",letterSpacing:".08em"}}>FALLBACK (shown when no experience added)</div>
                  <div style={{marginBottom:"8px"}}>
                    <label style={lbl}>Fallback Title</label>
                    <input style={inp} value={data.expFallbackTitle} onChange={e=>setField("expFallbackTitle",e.target.value)} placeholder="Actively Seeking First Professional Role" onFocus={onFocus} onBlur={onBlurEvt}/>
                  </div>
                  <div>
                    <label style={lbl}>Fallback Description</label>
                    <textarea style={{...inp,height:"60px",resize:"vertical"}} value={data.expFallback} onChange={e=>setField("expFallback",e.target.value)} placeholder="e.g. Ready to bring fresh energy…" onFocus={onFocus} onBlur={onBlurEvt}/>
                  </div>
                </div>
                <CvBtn small onClick={()=>addItem("experience",{title:"",company:"",year:"",desc:""})} style={{marginTop:"10px"}}><FaPlus size={9}/> add experience</CvBtn>
              </RCard>
            </div>
          </div>

        ) : (

          /* ══ PREVIEW ══ */
          <div style={{maxWidth:"900px",margin:"0 auto",display:"flex",flexDirection:"column",gap:"14px"}}>
            <div style={{fontSize:"11px",color:text2,fontFamily:"monospace",display:"flex",alignItems:"center",gap:"10px",flexWrap:"wrap"}}>
              <span>Live preview · <span style={{color:"#5ba898"}}>{CV_THEMES[cvTheme].name}</span> theme · 794 × 1123 px</span>
              <span>· switch themes from the dots above</span>
            </div>
            <ResponsiveCVPreview data={data} cvTheme={cvTheme} photoSrc={photoSrc}/>
            <div style={{height:"24px"}}/>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   NAV + PAGES
   ═══════════════════════════════════════════════════════ */
const NAV   = [{ id:"cv", label:"CV Generator", Icon:FaFilePen }];
const PAGES = { cv: CVGeneratorPage };

/* ═══════════════════════════════════════════════════════
   MAIN UserDemandPage
   ═══════════════════════════════════════════════════════ */
export default function UserDemandPage() {
  const { isDark } = useTheme();
  const navigate   = useNavigate();
  const sectionRef = useRef(null);
  const [active,      setActive]      = useState("cv");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const t = (l, d) => isDark ? d : l;

  const ActivePage = PAGES[active] || PAGES.cv;

  /* ── sudo close ── */
  useEffect(() => {
    const CLOSE_CMD = "sudo close -userdemand";
    let typed = "";
    const h = e => {
      const tag = e.target.tagName;
      if (tag==="INPUT"||tag==="TEXTAREA"||e.target.isContentEditable) return;
      typed = (typed + e.key).slice(-CLOSE_CMD.length);
      if (typed.endsWith(CLOSE_CMD)) { navigate("/"); typed=""; }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [navigate]);

  /* ── responsive ── */
  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      setWindowWidth(w);
      setSidebarOpen(w > 768);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isMobile = windowWidth <= 768;
  const ICON_W   = 56;
  const SB_W     = sidebarOpen ? 220 : 0;
  const totalW   = ICON_W + SB_W;

  return (
    <div ref={sectionRef} style={{minHeight:"100vh",background:t("#f0e8d8","#18191a"),display:"flex",position:"relative",overflow:"hidden",transition:"background 0.6s"}}>
      <AnimatedBackground sectionRef={sectionRef}/>
      <ThemeToggle/>
      <DevModeToggle/>

      {sidebarOpen && isMobile && (
        <div onClick={()=>setSidebarOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:99}}/>
      )}

      {/* ── Sidebar ── */}
      <div style={{
        position:"fixed",top:0,left:0,bottom:0,zIndex:100,
        display:"flex",flexDirection:"column",
        width:`${totalW}px`,
        transform: isMobile&&!sidebarOpen?`translateX(-${totalW}px)`:"translateX(0)",
        transition:"width 0.3s cubic-bezier(.4,0,.2,1),transform 0.3s cubic-bezier(.4,0,.2,1)",
        background:t("rgba(255,253,247,0.94)","rgba(22,23,24,0.96)"),
        borderRight:`1px solid ${t("rgba(26,18,8,0.08)","rgba(255,255,255,0.07)")}`,
        backdropFilter:"blur(18px)",overflow:"hidden",
      }}>
        <div style={{display:"flex",alignItems:"center",padding:"18px 12px 12px",gap:"10px",flexShrink:0,minHeight:"72px"}}>
          <button onClick={()=>setSidebarOpen(o=>!o)}
            style={{width:"32px",height:"32px",borderRadius:"8px",border:"none",background:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#5ba898",flexShrink:0,transition:"background .2s"}}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(91,168,152,0.12)"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            {sidebarOpen?<FaXmark size={15}/>:<FaBars size={15}/>}
          </button>
          <div style={{overflow:"hidden",whiteSpace:"nowrap",opacity:sidebarOpen?1:0,transition:"opacity .2s",pointerEvents:sidebarOpen?"auto":"none"}}>
            <div style={{fontSize:"13px",fontWeight:600,fontFamily:"Georgia,serif",color:t("#1a1208","#e4e6eb")}}>User Demand</div>
            <div style={{fontSize:"9px",fontFamily:"monospace",letterSpacing:"2px",textTransform:"uppercase",color:"#5ba898"}}>// tools panel</div>
          </div>
        </div>
        <div style={{width:"100%",height:"1px",background:t("rgba(26,18,8,0.07)","rgba(255,255,255,0.07)"),flexShrink:0}}/>
        <nav style={{flex:1,padding:"12px 8px",overflowY:"auto"}}>
          {NAV.map(({id,label,Icon})=>{
            const isActive=active===id;
            return (
              <button key={id} onClick={()=>{setActive(id);if(isMobile)setSidebarOpen(false);}} title={!sidebarOpen?label:undefined}
                style={{width:"100%",display:"flex",alignItems:"center",gap:"12px",padding:"10px",borderRadius:"10px",border:"none",cursor:"pointer",marginBottom:"3px",textAlign:"left",whiteSpace:"nowrap",overflow:"hidden",background:isActive?"rgba(91,168,152,0.15)":"transparent",color:isActive?"#5ba898":t("rgba(26,18,8,0.5)","rgba(228,230,235,0.5)"),fontFamily:"monospace",fontSize:"12px",borderLeft:isActive?"2px solid #5ba898":"2px solid transparent",transition:"all .2s"}}
                onMouseEnter={e=>{if(!isActive){e.currentTarget.style.background=t("rgba(26,18,8,0.04)","rgba(255,255,255,0.05)");e.currentTarget.style.color=t("#1a1208","#e4e6eb");}}}
                onMouseLeave={e=>{if(!isActive){e.currentTarget.style.background="transparent";e.currentTarget.style.color=t("rgba(26,18,8,0.5)","rgba(228,230,235,0.5)");}}}
              >
                <Icon size={14} style={{flexShrink:0}}/>
                <span style={{opacity:sidebarOpen?1:0,transition:"opacity .15s"}}>{label}</span>
              </button>
            );
          })}
        </nav>
        <div style={{width:"100%",height:"1px",background:t("rgba(26,18,8,0.07)","rgba(255,255,255,0.07)")}}/>
        <div style={{padding:"10px 8px 18px"}}>
          <button onClick={()=>navigate("/")} title={!sidebarOpen?"Back to Portfolio":undefined}
            style={{width:"100%",display:"flex",alignItems:"center",gap:"12px",padding:"10px",borderRadius:"10px",border:"none",cursor:"pointer",background:"transparent",color:t("rgba(26,18,8,0.45)","rgba(228,230,235,0.4)"),fontFamily:"monospace",fontSize:"12px",whiteSpace:"nowrap",overflow:"hidden",transition:"all .2s"}}
            onMouseEnter={e=>{e.currentTarget.style.background=t("rgba(26,18,8,0.04)","rgba(255,255,255,0.05)");e.currentTarget.style.color=t("#1a1208","#e4e6eb");}}
            onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=t("rgba(26,18,8,0.45)","rgba(228,230,235,0.4)");}}>
            <FaRightFromBracket size={14} style={{flexShrink:0}}/>
            <span style={{opacity:sidebarOpen?1:0,transition:"opacity .15s"}}>Back to Portfolio</span>
          </button>
          {sidebarOpen && (
            <div style={{margin:"8px 4px 0",padding:"7px 10px",borderRadius:"8px",background:t("rgba(26,18,8,0.04)","rgba(255,255,255,0.04)"),border:`1px solid ${t("rgba(26,18,8,0.07)","rgba(255,255,255,0.06)")}`}}>
              <code style={{fontSize:"9px",fontFamily:"monospace",color:"#a855f7",letterSpacing:".04em",display:"block",lineHeight:1.6}}>sudo close -userdemand</code>
              <span style={{fontSize:"8px",fontFamily:"monospace",color:t("rgba(26,18,8,0.3)","rgba(228,230,235,0.25)")}}>type anywhere to exit</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{flex:1,marginLeft:isMobile?"0":`${totalW}px`,transition:"margin-left 0.3s cubic-bezier(.4,0,.2,1)",minHeight:"100vh",position:"relative",zIndex:1,display:"flex",flexDirection:"column"}}>
        <div style={{position:"sticky",top:0,zIndex:50,height:"54px",display:"flex",alignItems:"center",padding:"0 16px",gap:"12px",background:t("rgba(240,232,216,0.88)","rgba(20,21,22,0.9)"),borderBottom:`1px solid ${t("rgba(26,18,8,0.07)","rgba(255,255,255,0.06)")}`,backdropFilter:"blur(14px)",flexShrink:0}}>
          {isMobile && (
            <button onClick={()=>setSidebarOpen(true)} style={{background:"transparent",border:"none",cursor:"pointer",color:"#5ba898",display:"flex",alignItems:"center",padding:"6px"}}>
              <FaBars size={18}/>
            </button>
          )}
          <div style={{flex:1,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>
            <span style={{fontSize:"12px",fontFamily:"monospace",color:"#5ba898"}}>aayush</span>
            <span style={{color:t("rgba(26,18,8,0.3)","rgba(255,255,255,0.25)"),fontFamily:"monospace",fontSize:"12px"}}>@portfolio:/user-demand/</span>
            <span style={{color:"#a855f7",fontFamily:"monospace",fontSize:"12px"}}>{active}</span>
          </div>
          <span style={{fontSize:"10px",fontFamily:"monospace",color:t("rgba(26,18,8,0.3)","rgba(228,230,235,0.3)"),flexShrink:0}}>
            {new Date().toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}
          </span>
        </div>
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minHeight:0}}>
          <ActivePage/>
        </div>
      </div>

      <style>{`
        @keyframes borderSlide{0%{background-position:200% 0}100%{background-position:-200% 0}}
        @keyframes toastIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes barPulse{0%,100%{opacity:.3}50%{opacity:.85}}
        @media(max-width:680px){.cv-form-grid{grid-template-columns:1fr!important}}
      `}</style>
    </div>
  );
}