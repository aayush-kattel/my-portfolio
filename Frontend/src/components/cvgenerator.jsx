import { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "../hooks/useTheme";
import AnimatedBackground from "../components/AnimatedBackground";
import { FaXmark, FaPlus, FaTrash, FaUpload, FaImage, FaDownload, FaEye, FaPen } from "react-icons/fa6";

/* ─────────────────────── CV Theme Definitions ──────────────────── */
const CV_THEMES = {
  blue:   { name: "Blue",   accent: "#2a9fd6", accentDeep: "#1a6fa8", muted: "#1e3048", sidebar: "#131f2b", highlight: "#3abf9f" },
  red:    { name: "Red",    accent: "#e05555", accentDeep: "#b83333", muted: "#2e1a1a", sidebar: "#1f1313", highlight: "#e07755" },
  orange: { name: "Orange", accent: "#e07a2a", accentDeep: "#b85f10", muted: "#2e1e10", sidebar: "#1f1610", highlight: "#e0aa2a" },
  green:  { name: "Green",  accent: "#3abf7a", accentDeep: "#228855", muted: "#102e1e", sidebar: "#101f16", highlight: "#7ad65a" },
  purple: { name: "Purple", accent: "#9b6ee0", accentDeep: "#6a3ab8", muted: "#1e1030", sidebar: "#150f20", highlight: "#c06ee0" },
  gold:   { name: "Gold",   accent: "#d4935a", accentDeep: "#a86830", muted: "#2a1e0e", sidebar: "#1a1408", highlight: "#d4c45a" },
};

/* ─────────────────────── Initials Avatar ───────────────────────── */
function initialsAvatar(name, accent) {
  const parts = (name || "").trim().split(" ");
  const ini = parts.length >= 2
    ? parts[0][0] + parts[parts.length - 1][0]
    : (parts[0]?.[0] || "?");
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="110" height="110"><rect width="110" height="110" fill="#131f2b"/><text x="55" y="70" text-anchor="middle" font-size="38" fill="${accent}" font-family="Georgia,serif" font-weight="600">${ini.toUpperCase()}</text></svg>`
  )}`;
}

/* ─────────────────────── CV Preview ────────────────────────────── */
function CVPreview({ data, cvTheme, photoSrc }) {
  const t = CV_THEMES[cvTheme];
  const hasExp = data.experience.some(e => e.title || e.company);

  const s = {
    page:       { width:"794px",height:"1123px",display:"grid",gridTemplateColumns:"200px 1fr",fontFamily:"Georgia,'Cormorant Garamond',serif",fontSize:"11.2px",lineHeight:"1.55",color:"#c8d4dc",background:"#0f1923",position:"relative",overflow:"hidden" },
    topLine:    { position:"absolute",top:0,left:0,width:"200px",height:"3px",background:t.accent,zIndex:10 },
    sb:         { background:t.sidebar,padding:"26px 16px 20px",display:"flex",flexDirection:"column",gap:"15px",borderRight:`1px solid ${t.muted}` },
    avWrap:     { width:"86px",height:"86px",borderRadius:"50%",margin:"0 auto",border:`2px solid ${t.accent}`,boxShadow:`0 0 0 4px ${t.accent}22`,overflow:"hidden",flexShrink:0 },
    avImg:      { width:"100%",height:"100%",objectFit:"cover",objectPosition:"top center",display:"block" },
    sbName:     { textAlign:"center" },
    sbH2:       { fontFamily:"Georgia,serif",fontSize:"1.08rem",fontWeight:600,color:"#e8edf2",letterSpacing:".01em",lineHeight:1.2 },
    sbRole:     { fontSize:"0.57rem",letterSpacing:".14em",color:t.accent,textTransform:"uppercase",marginTop:"4px",fontWeight:500,fontFamily:"monospace" },
    div:        { height:"1px",background:t.muted,flexShrink:0 },
    sbH3:       { fontSize:"0.58rem",letterSpacing:".18em",textTransform:"uppercase",color:t.accent,fontWeight:600,marginBottom:"8px",fontFamily:"monospace" },
    cl:         { listStyle:"none",display:"flex",flexDirection:"column",gap:"5px" },
    clLi:       { display:"flex",alignItems:"flex-start",gap:"6px",fontSize:"0.68rem",color:"#7a9ab5",lineHeight:1.4,wordBreak:"break-all",overflowWrap:"anywhere" },
    clDot:      { width:"4px",height:"4px",borderRadius:"50%",background:t.accent,marginTop:"6px",flexShrink:0 },
    tags:       { display:"flex",flexWrap:"wrap",gap:"4px" },
    tag:        { fontSize:"0.6rem",padding:"2px 7px",borderRadius:"3px",background:"#0f1923",color:"#6a8aa5",border:`1px solid ${t.muted}`,fontFamily:"monospace" },
    main:       { background:"#162030",display:"flex",flexDirection:"column" },
    hero:       { padding:"18px 28px 12px",borderBottom:`1px solid ${t.muted}`,flexShrink:0 },
    heroEye:    { fontSize:"0.57rem",letterSpacing:".22em",textTransform:"uppercase",color:t.accent,fontWeight:600,marginBottom:"3px",fontFamily:"monospace" },
    heroName:   { fontFamily:"Georgia,serif",fontSize:"2.1rem",fontWeight:700,color:"#e8edf2",lineHeight:1,letterSpacing:"-.01em" },
    heroSpan:   { color:t.highlight },
    secs:       { padding:"11px 28px 0",display:"flex",flexDirection:"column",gap:"10px",flex:1,overflow:"hidden" },
    secLbl:     { display:"flex",alignItems:"center",gap:"8px",marginBottom:"6px" },
    secNum:     { fontSize:"0.55rem",color:t.accentDeep,fontWeight:600,letterSpacing:".05em",fontFamily:"monospace" },
    secTitle:   { fontFamily:"Georgia,serif",fontSize:".96rem",fontWeight:600,color:"#c8d8e8" },
    secLine:    { flex:1,height:"1px",background:`linear-gradient(90deg,${t.muted},transparent)` },
    profCard:   { background:"#0f1923",borderRadius:"5px",borderLeft:`2.5px solid ${t.accent}`,padding:"9px 13px",color:"#7a9ab5",fontSize:"0.71rem",lineHeight:1.65,textAlign:"justify" },
    eduList:    { display:"flex",flexDirection:"column",gap:"7px" },
    eduItem:    { display:"flex",gap:"10px" },
    eduDc:      { display:"flex",flexDirection:"column",alignItems:"center",paddingTop:"3px" },
    eduDot:     { width:"7px",height:"7px",borderRadius:"50%",background:t.accent,flexShrink:0 },
    eduLn:      { flex:1,width:"1px",background:t.muted,marginTop:"3px" },
    eduH4:      { fontFamily:"Georgia,serif",fontSize:".81rem",fontWeight:600,color:"#b8ccd8" },
    eduSchool:  { fontSize:".62rem",color:t.accent,fontWeight:500,margin:"1px 0",fontFamily:"monospace" },
    eduYear:    { fontSize:".59rem",color:"#4a6a85",marginBottom:"1px",fontFamily:"monospace" },
    eduDesc:    { color:"#6a8aa5",fontSize:".66rem",lineHeight:1.4,textAlign:"justify" },
    projGrid:   { display:"grid",gridTemplateColumns:"1fr 1fr",gap:"7px" },
    projCard:   { background:"#0f1923",borderRadius:"5px",border:`1px solid ${t.muted}`,borderLeft:`2.5px solid ${t.accent}`,padding:"8px 10px" },
    projComing: { background:`${t.muted}44`,borderRadius:"5px",border:`1px dashed ${t.muted}`,borderLeft:`2.5px solid ${t.highlight}`,padding:"8px 10px" },
    projTitle:  { fontFamily:"Georgia,serif",fontSize:".81rem",fontWeight:600,color:"#b8ccd8",marginBottom:"2px" },
    projStack:  { fontSize:".57rem",letterSpacing:".04em",color:t.accent,textTransform:"uppercase",fontWeight:500,marginBottom:"3px",fontFamily:"monospace" },
    projDesc:   { fontSize:".66rem",color:"#6a8aa5",lineHeight:1.4,textAlign:"justify" },
    expCard:    { background:"#0f1923",borderRadius:"5px",borderLeft:`2.5px solid ${t.accent}`,padding:"9px 13px" },
    expTitle:   { fontFamily:"Georgia,serif",fontSize:".86rem",fontWeight:600,color:t.accent,marginBottom:"4px" },
    expDesc:    { fontSize:".69rem",color:"#7a9ab5",lineHeight:1.6,textAlign:"justify" },
    foot:       { padding:"6px 28px",borderTop:`1px solid ${t.muted}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0 },
    footName:   { fontFamily:"Georgia,serif",fontSize:".7rem",color:"#3a5a72",fontStyle:"italic" },
    footBar:    { width:"60px",height:"1.5px",background:`linear-gradient(90deg,${t.accent},${t.highlight})`,borderRadius:"2px" },
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
      <div style={s.topLine} />

      {/* SIDEBAR */}
      <div style={s.sb}>
        <div style={s.avWrap}>
          <img style={s.avImg} src={photoSrc || initialsAvatar(data.name, t.accent)} alt={data.name} />
        </div>
        <div style={s.sbName}>
          <div style={s.sbH2}>{data.name || "Your Name"}</div>
          <div style={s.sbRole}>{data.role || "Developer"}</div>
        </div>
        <div style={s.div} />
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
          <div style={s.div}/>
          <div>
            <div style={s.sbH3}>Core Skills</div>
            <div style={s.tags}>{allSkills.map((sk,i)=><span key={i} style={s.tag}>{sk}</span>)}</div>
          </div>
        </>}
        {allTools.length > 0 && <>
          <div style={s.div}/>
          <div>
            <div style={s.sbH3}>Tools & Platforms</div>
            <div style={s.tags}>{allTools.map((sk,i)=><span key={i} style={s.tag}>{sk}</span>)}</div>
          </div>
        </>}
      </div>

      {/* MAIN */}
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
                {allEdu.map((e,i)=>(
                  <div key={i} style={s.eduItem}>
                    <div style={s.eduDc}><div style={s.eduDot}/>{i<allEdu.length-1&&<div style={s.eduLn}/>}</div>
                    <div>
                      <div style={s.eduH4}>{e.degree}</div>
                      {e.school&&<div style={s.eduSchool}>{e.school}</div>}
                      {e.year&&<div style={s.eduYear}>{e.year}</div>}
                      {e.desc&&<div style={s.eduDesc}>{e.desc}</div>}
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
                {allProj.map((p,i)=>(
                  <div key={i} style={p.coming ? s.projComing : s.projCard}>
                    <div style={{...s.projTitle,...(p.coming?{color:t.highlight}:{})}}>{p.title}</div>
                    {p.stack&&<div style={{...s.projStack,...(p.coming?{color:t.highlight}:{})}}>{p.stack}</div>}
                    {p.desc&&<div style={s.projDesc}>{p.desc}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div>
            <div style={s.secLbl}><span style={s.secNum}>04</span><span style={s.secTitle}>Experience</span><div style={s.secLine}/></div>
            {hasExp ? (
              <div style={s.eduList}>
                {allExp.map((e,i)=>(
                  <div key={i} style={s.eduItem}>
                    <div style={s.eduDc}><div style={s.eduDot}/>{i<allExp.length-1&&<div style={s.eduLn}/>}</div>
                    <div>
                      <div style={s.eduH4}>{e.title}</div>
                      {e.company&&<div style={s.eduSchool}>{e.company}</div>}
                      {e.year&&<div style={s.eduYear}>{e.year}</div>}
                      {e.desc&&<div style={s.eduDesc}>{e.desc}</div>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={s.expCard}>
                <div style={s.expTitle}>Actively Seeking First Professional Role</div>
                <div style={s.expDesc}>{data.expFallback||"Ready to bring fresh energy, strong work ethic, and modern technical skills to a professional team. Open to full-time roles, internships, and remote opportunities."}</div>
              </div>
            )}
          </div>
        </div>
        <div style={s.foot}>
          <span style={s.footName}>{data.name||"Your Name"} — {data.role||"Developer"}</span>
          <div style={s.footBar}/>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── Main CVGenerator ──────────────────────── */
export default function CVGenerator() {
  const { isDark }   = useTheme();
  const sectionRef   = useRef(null);
  const photoRef     = useRef(null);
  const [visible,    setVisible]    = useState(false);
  const [typed,      setTyped]      = useState("");
  const [step,       setStep]       = useState("form");
  const [cvTheme,    setCvTheme]    = useState("blue");
  const [photoSrc,   setPhotoSrc]   = useState(null);
  const [downloading,setDownloading]= useState(false);
  const [toast,      setToast]      = useState("");
  const [typedCmd,   setTypedCmd]   = useState("");
  const [showCursor, setShowCursor] = useState(true);

  const SECRET = "sudo cv -generator";
  const EXIT   = "sudo cv -exit";

  const [data, setData] = useState({
    name:"", role:"", phone:"", email:"", location:"",
    linkedin:"", github:"", website:"", profile:"", expFallback:"",
    skills:    ["","","","",""],
    tools:     ["","","","",""],
    education: [{degree:"",school:"",year:"",desc:""},{degree:"",school:"",year:"",desc:""}],
    projects:  [{title:"",stack:"",desc:"",coming:false},{title:"",stack:"",desc:"",coming:false}],
    experience:[{title:"",company:"",year:"",desc:""}],
  });

  /* Secret code listener */
  useEffect(()=>{
    const h = (e)=>{
      setTyped(prev=>{
        const next=(prev+e.key).slice(-EXIT.length);
        if(next.endsWith(SECRET)){setVisible(true);return"";}
        if(next.endsWith(EXIT)){setVisible(false);setStep("form");return"";}
        return next;
      });
    };
    window.addEventListener("keydown",h);
    return ()=>window.removeEventListener("keydown",h);
  },[]);

  /* Typewriter on open — mirrors AdminLogin style */
  useEffect(()=>{
    if(!visible)return;
    setTypedCmd("");setShowCursor(true);
    let i=0,tid;
    function typeNext(){
      if(i<=SECRET.length){setTypedCmd(SECRET.slice(0,i++));tid=setTimeout(typeNext,i===1?300:50+Math.random()*50);}
      else setShowCursor(false);
    }
    const s=setTimeout(typeNext,400);
    return ()=>{clearTimeout(s);clearTimeout(tid);};
  },[visible]);

  /* Toast */
  const showToast=(msg)=>{setToast(msg);setTimeout(()=>setToast(""),2800);};

  /* Data helpers */
  const setField  =(k,v)=>setData(d=>({...d,[k]:v}));
  const setArr    =(k,i,v)=>setData(d=>{const a=[...d[k]];a[i]=v;return{...d,[k]:a};});
  const setArrObj =(k,i,f,v)=>setData(d=>({...d,[k]:d[k].map((x,idx)=>idx===i?{...x,[f]:v}:x)}));
  const addItem   =(k,empty)=>setData(d=>({...d,[k]:[...d[k],empty]}));
  const removeItem=(k,i)=>setData(d=>({...d,[k]:d[k].filter((_,idx)=>idx!==i)}));

  /* Photo */
  const handlePhoto=(e)=>{
    const file=e.target.files[0];if(!file)return;
    const r=new FileReader();r.onload=ev=>setPhotoSrc(ev.target.result);r.readAsDataURL(file);
  };

  /* Download PNG */
  const handleDownload=useCallback(async()=>{
    setDownloading(true);showToast("⏳ Generating your CV…");
    try{
      if(!window.html2canvas){
        await new Promise((res,rej)=>{
          const sc=document.createElement("script");
          sc.src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
          sc.onload=res;sc.onerror=rej;document.head.appendChild(sc);
        });
      }
      const el=document.getElementById("cv-preview-render");
      const canvas=await window.html2canvas(el,{scale:2,useCORS:true,allowTaint:true,width:794,height:1123,backgroundColor:"#0f1923"});
      const link=document.createElement("a");
      link.download=`${(data.name||"cv").replace(/\s+/g,"_")}_cv.png`;
      link.href=canvas.toDataURL("image/png");link.click();
      showToast("✓ Downloaded!");
    }catch{showToast("Download failed — try again");}
    setDownloading(false);
  },[data.name]);

  if(!visible)return null;

  /* Portfolio theme helpers — exact same pattern as AdminLogin */
  const T      = (l,d)=>isDark?d:l;
  const cardBg = T("rgba(255,253,247,0.92)","rgba(36,37,38,0.92)");
  const inputBg= T("#ffffff","rgba(255,255,255,0.05)");
  const inputBdr=T("rgba(26,18,8,0.14)","rgba(228,230,235,0.12)");
  const text   = T("#1a1208","#e4e6eb");
  const text2  = T("rgba(26,18,8,0.5)","rgba(228,230,235,0.45)");

  const inp={width:"100%",background:inputBg,border:`1px solid ${inputBdr}`,borderRadius:"8px",padding:"8px 11px",color:text,fontSize:"12.5px",fontFamily:"monospace",outline:"none",transition:"border .2s,box-shadow .2s",boxSizing:"border-box"};
  const lbl={display:"block",fontSize:"10px",letterSpacing:".12em",textTransform:"uppercase",color:"#5ba898",marginBottom:"4px",fontFamily:"monospace"};
  const fg ={marginBottom:"11px"};

  const onFocus=e=>{e.target.style.borderColor="#5ba898";e.target.style.boxShadow="0 0 0 3px rgba(91,168,152,0.12)";};
  const onBlur =e=>{e.target.style.borderColor=inputBdr;e.target.style.boxShadow="none";};

  /* Rainbow border card — exact same as your Card component */
  const RCard=({title,children,style={}})=>(
    <div style={{position:"relative",borderRadius:"16px",marginBottom:"16px",...style}}>
      <div style={{position:"absolute",inset:0,borderRadius:"16px",background:"linear-gradient(90deg,transparent,#5ba898,#d4935a,#c96a6a,#7aaa6a,#8a7ab8,#5ba898,transparent)",backgroundSize:"200% 100%",animation:"borderSlide 3s linear infinite"}}/>
      <div style={{position:"relative",zIndex:1,margin:"2px",borderRadius:"14px",padding:"20px 22px",background:cardBg,backdropFilter:"blur(16px)"}}>
        {title&&<div style={{fontSize:"10px",fontFamily:"monospace",letterSpacing:"2px",textTransform:"uppercase",color:"#5ba898",marginBottom:"14px"}}>{title}</div>}
        {children}
      </div>
    </div>
  );

  const Btn=({onClick,children,small,danger,disabled,accent})=>(
    <button onClick={onClick} disabled={disabled} style={{display:"inline-flex",alignItems:"center",gap:"5px",padding:small?"5px 12px":"8px 16px",borderRadius:"7px",border:"none",cursor:disabled?"not-allowed":"pointer",background:danger?"#c96a6a":accent||"#5ba898",color:"#fff",fontSize:small?"11px":"12px",fontFamily:"monospace",fontWeight:600,opacity:disabled?0.6:1,transition:"opacity .2s"}}
      onMouseEnter={e=>!disabled&&(e.currentTarget.style.opacity=".8")}
      onMouseLeave={e=>!disabled&&(e.currentTarget.style.opacity="1")}
    >{children}</button>
  );

  return (
    <div ref={sectionRef} style={{position:"fixed",inset:0,zIndex:9998,background:T("#f0e8d8","#18191a"),display:"flex",flexDirection:"column",overflow:"hidden",transition:"background .6s",animation:"cvSlideIn .3s cubic-bezier(.16,1,.3,1)"}}>
      <AnimatedBackground sectionRef={sectionRef}/>

      {/* ── Top bar — mirrors AdminLogin terminal header ── */}
      <div style={{position:"relative",zIndex:10,background:T("rgba(255,253,247,0.88)","rgba(20,25,35,0.92)"),borderBottom:`1px solid ${T("rgba(26,18,8,0.1)","rgba(91,168,152,0.2)")}`,padding:"10px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",backdropFilter:"blur(16px)",flexShrink:0}}>

        {/* Terminal prompt — same style as AdminLogin */}
        <div style={{display:"flex",alignItems:"center",gap:"4px",fontFamily:"monospace",fontSize:"12px",background:T("rgba(0,0,0,0.06)","rgba(255,255,255,0.04)"),padding:"6px 12px",borderRadius:"8px",border:`1px solid ${T("rgba(26,18,8,0.08)","rgba(255,255,255,0.06)")}`}}>
          <span style={{color:"#34d399"}}>aayush@portfolio</span>
          <span style={{color:text2}}>:</span>
          <span style={{color:"#a855f7"}}>~</span>
          <span style={{color:text2}}>$&nbsp;</span>
          <span style={{color:text}}>{typedCmd}</span>
          {showCursor&&<span style={{display:"inline-block",width:"6px",height:"12px",background:"#a855f7",verticalAlign:"middle",animation:"blink 1s step-end infinite"}}/>}
        </div>

        {/* Right controls */}
        <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
          {/* CV Theme dots */}
          <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
            <span style={{fontSize:"9px",color:text2,fontFamily:"monospace",letterSpacing:".1em"}}>THEME</span>
            {Object.entries(CV_THEMES).map(([key,th])=>(
              <button key={key} title={th.name} onClick={()=>setCvTheme(key)} style={{width:"16px",height:"16px",borderRadius:"50%",background:th.accent,border:cvTheme===key?"2.5px solid #fff":"2px solid transparent",cursor:"pointer",transform:cvTheme===key?"scale(1.3)":"scale(1)",transition:"transform .15s",outline:"none"}}/>
            ))}
          </div>

          <div style={{width:"1px",height:"16px",background:T("rgba(26,18,8,0.12)","rgba(255,255,255,0.1)")}}/>

          {/* Preview/Edit toggle */}
          <button onClick={()=>setStep(s=>s==="form"?"preview":"form")} style={{display:"inline-flex",alignItems:"center",gap:"5px",padding:"5px 13px",borderRadius:"7px",border:"none",cursor:"pointer",background:step==="preview"?"linear-gradient(135deg,#5ba898,#4a9080)":T("rgba(26,18,8,0.08)","rgba(255,255,255,0.07)"),color:step==="preview"?"#fff":text,fontSize:"11px",fontFamily:"monospace",fontWeight:600,transition:"background .2s"}}>
            {step==="form"?<><FaEye size={11}/> Preview</>:<><FaPen size={10}/> Edit</>}
          </button>

          {step==="preview"&&(
            <button onClick={handleDownload} disabled={downloading} style={{display:"inline-flex",alignItems:"center",gap:"5px",padding:"5px 13px",borderRadius:"7px",border:"none",cursor:downloading?"wait":"pointer",background:"linear-gradient(135deg,#5ba898,#4a9080)",color:"#fff",fontSize:"11px",fontFamily:"monospace",fontWeight:600,opacity:downloading?0.7:1}}>
              <FaDownload size={11}/>{downloading?"Generating…":"Download PNG"}
            </button>
          )}

          {/* Exit — same hint style as AdminLogin */}
          <button onClick={()=>{setVisible(false);setStep("form");}} style={{display:"inline-flex",alignItems:"center",gap:"5px",padding:"5px 12px",borderRadius:"7px",border:`1px solid ${T("rgba(26,18,8,0.12)","rgba(255,255,255,0.1)")}`,cursor:"pointer",background:"transparent",color:text2,fontSize:"11px",fontFamily:"monospace"}}>
            <FaXmark size={11}/><code style={{color:"#a855f7",background:"rgba(168,85,247,0.1)",padding:"1px 6px",borderRadius:"4px",fontSize:"10px"}}>sudo cv -exit</code>
          </button>
        </div>
      </div>

      {/* Toast — same as admin */}
      {toast&&(
        <div style={{position:"fixed",top:"68px",right:"20px",zIndex:99999,padding:"10px 18px",borderRadius:"10px",background:"linear-gradient(135deg,#5ba898,#4a9080)",color:"#fff",fontFamily:"monospace",fontSize:"13px",fontWeight:600,boxShadow:"0 4px 20px rgba(0,0,0,0.3)",animation:"toastIn .3s ease"}}>
          {toast}
        </div>
      )}

      {/* ── Body ── */}
      <div style={{flex:1,overflow:"auto",padding:"22px 20px",position:"relative",zIndex:1}}>
        {step==="form" ? (

          /* ══ FORM ══ */
          <div style={{maxWidth:"980px",margin:"0 auto",display:"grid",gridTemplateColumns:"320px 1fr",gap:"18px"}}>

            {/* Left column */}
            <div>
              <RCard title="// personal_info">
                {/* Photo upload */}
                <div style={{...fg,textAlign:"center"}}>
                  <div onClick={()=>photoRef.current?.click()} style={{width:"70px",height:"70px",borderRadius:"50%",border:"2px solid #5ba898",overflow:"hidden",margin:"0 auto 8px",background:T("rgba(26,18,8,0.06)","#0f1923"),display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"border-color .2s"}}
                    onMouseEnter={e=>e.currentTarget.style.borderColor="#d4935a"}
                    onMouseLeave={e=>e.currentTarget.style.borderColor="#5ba898"}
                  >
                    {photoSrc?<img src={photoSrc} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"top"}} alt=""/>:<FaImage style={{color:"#5ba898",fontSize:"22px"}}/>}
                  </div>
                  <input ref={photoRef} type="file" accept="image/*" onChange={handlePhoto} style={{display:"none"}}/>
                  <label onClick={()=>photoRef.current?.click()} style={{cursor:"pointer",fontSize:"10px",color:"#5ba898",fontFamily:"monospace",letterSpacing:".1em",display:"inline-flex",alignItems:"center",gap:"4px"}}>
                    <FaUpload size={9}/> UPLOAD PHOTO
                  </label>
                  {photoSrc&&<button onClick={()=>setPhotoSrc(null)} style={{display:"block",margin:"3px auto 0",background:"none",border:"none",color:"#c96a6a",fontSize:"10px",cursor:"pointer",fontFamily:"monospace"}}>remove</button>}
                </div>

                {[["Full Name","name"],["Role / Title","role"],["Phone","phone"],["Email","email"],["Location","location"],["LinkedIn","linkedin"],["GitHub","github"],["Website","website"]].map(([l,k])=>(
                  <div key={k} style={fg}>
                    <label style={lbl}>{l}</label>
                    <input style={inp} value={data[k]} onChange={e=>setField(k,e.target.value)} placeholder={l} onFocus={onFocus} onBlur={onBlur}/>
                  </div>
                ))}
              </RCard>

              <RCard title="// skills">
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px",marginBottom:"8px"}}>
                  {data.skills.map((s,i)=><input key={i} style={inp} value={s} onChange={e=>setArr("skills",i,e.target.value)} placeholder={`Skill ${i+1}`} onFocus={onFocus} onBlur={onBlur}/>)}
                </div>
                <Btn small onClick={()=>addItem("skills","")}><FaPlus size={9}/> add skill</Btn>
              </RCard>

              <RCard title="// tools_&_platforms">
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px",marginBottom:"8px"}}>
                  {data.tools.map((s,i)=><input key={i} style={inp} value={s} onChange={e=>setArr("tools",i,e.target.value)} placeholder={`Tool ${i+1}`} onFocus={onFocus} onBlur={onBlur}/>)}
                </div>
                <Btn small onClick={()=>addItem("tools","")}><FaPlus size={9}/> add tool</Btn>
              </RCard>
            </div>

            {/* Right column */}
            <div>
              <RCard title="// profile_summary">
                <textarea style={{...inp,height:"72px",resize:"vertical"}} value={data.profile} onChange={e=>setField("profile",e.target.value)} placeholder="Write a short professional summary…" onFocus={onFocus} onBlur={onBlur}/>
              </RCard>

              <RCard title="// education">
                {data.education.map((e,i)=>(
                  <div key={i} style={{borderLeft:"2px solid rgba(91,168,152,0.3)",paddingLeft:"12px",marginBottom:"12px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:"6px"}}>
                      <span style={{fontSize:"10px",color:text2,fontFamily:"monospace"}}>entry_{i+1}</span>
                      {i>0&&<button onClick={()=>removeItem("education",i)} style={{background:"none",border:"none",color:"#c96a6a",fontSize:"10px",cursor:"pointer",fontFamily:"monospace",display:"inline-flex",alignItems:"center",gap:"3px"}}><FaTrash size={9}/> remove</button>}
                    </div>
                    {[["Degree / Certificate","degree"],["School / College","school"],["Year (e.g. 2022–2024)","year"],["Description (optional)","desc"]].map(([l,f])=>(
                      <div key={f} style={{marginBottom:"6px"}}>
                        <label style={lbl}>{l}</label>
                        <input style={inp} value={e[f]} onChange={ev=>setArrObj("education",i,f,ev.target.value)} placeholder={l} onFocus={onFocus} onBlur={onBlur}/>
                      </div>
                    ))}
                  </div>
                ))}
                <Btn small onClick={()=>addItem("education",{degree:"",school:"",year:"",desc:""})}><FaPlus size={9}/> add entry</Btn>
              </RCard>

              <RCard title="// projects">
                {data.projects.map((p,i)=>(
                  <div key={i} style={{borderLeft:"2px solid rgba(91,168,152,0.3)",paddingLeft:"12px",marginBottom:"12px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:"6px",alignItems:"center"}}>
                      <span style={{fontSize:"10px",color:text2,fontFamily:"monospace"}}>project_{i+1}</span>
                      <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
                        <label style={{display:"flex",alignItems:"center",gap:"4px",fontSize:"10px",color:text2,fontFamily:"monospace",cursor:"pointer"}}>
                          <input type="checkbox" checked={!!p.coming} onChange={e=>setArrObj("projects",i,"coming",e.target.checked)} style={{accentColor:"#d4935a"}}/> coming soon
                        </label>
                        {i>0&&<button onClick={()=>removeItem("projects",i)} style={{background:"none",border:"none",color:"#c96a6a",fontSize:"10px",cursor:"pointer",fontFamily:"monospace",display:"inline-flex",alignItems:"center",gap:"3px"}}><FaTrash size={9}/> remove</button>}
                      </div>
                    </div>
                    {[["Title","title"],["Tech Stack","stack"],["Description","desc"]].map(([l,f])=>(
                      <div key={f} style={{marginBottom:"6px"}}>
                        <label style={lbl}>{l}</label>
                        <input style={inp} value={p[f]} onChange={ev=>setArrObj("projects",i,f,ev.target.value)} placeholder={l} onFocus={onFocus} onBlur={onBlur}/>
                      </div>
                    ))}
                  </div>
                ))}
                <Btn small onClick={()=>addItem("projects",{title:"",stack:"",desc:"",coming:false})}><FaPlus size={9}/> add project</Btn>
              </RCard>

              <RCard title="// experience">
                <div style={{fontSize:"10px",color:text2,fontFamily:"monospace",marginBottom:"12px",padding:"6px 10px",background:T("rgba(26,18,8,0.05)","rgba(255,255,255,0.04)"),borderRadius:"6px",border:`1px solid ${T("rgba(26,18,8,0.08)","rgba(255,255,255,0.06)")}`}}>
                  leave all fields empty → shows "seeking role" box · add entries → shows timeline format
                </div>
                {data.experience.map((e,i)=>(
                  <div key={i} style={{borderLeft:"2px solid rgba(91,168,152,0.3)",paddingLeft:"12px",marginBottom:"12px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:"6px"}}>
                      <span style={{fontSize:"10px",color:text2,fontFamily:"monospace"}}>exp_{i+1}</span>
                      {i>0&&<button onClick={()=>removeItem("experience",i)} style={{background:"none",border:"none",color:"#c96a6a",fontSize:"10px",cursor:"pointer",fontFamily:"monospace",display:"inline-flex",alignItems:"center",gap:"3px"}}><FaTrash size={9}/> remove</button>}
                    </div>
                    {[["Job Title","title"],["Company / Organisation","company"],["Year (e.g. 2023–2024)","year"],["Description","desc"]].map(([l,f])=>(
                      <div key={f} style={{marginBottom:"6px"}}>
                        <label style={lbl}>{l}</label>
                        <input style={inp} value={e[f]} onChange={ev=>setArrObj("experience",i,f,ev.target.value)} placeholder={l} onFocus={onFocus} onBlur={onBlur}/>
                      </div>
                    ))}
                  </div>
                ))}
                <div style={{marginBottom:"10px"}}>
                  <label style={lbl}>Fallback text (when no experience entered)</label>
                  <textarea style={{...inp,height:"52px",resize:"vertical"}} value={data.expFallback} onChange={e=>setField("expFallback",e.target.value)} placeholder="e.g. Actively seeking my first professional role…" onFocus={onFocus} onBlur={onBlur}/>
                </div>
                <Btn small onClick={()=>addItem("experience",{title:"",company:"",year:"",desc:""})}><FaPlus size={9}/> add experience</Btn>
              </RCard>
            </div>
          </div>

        ) : (

          /* ══ PREVIEW ══ */
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"14px"}}>
            <div style={{fontSize:"11px",color:text2,fontFamily:"monospace",display:"flex",alignItems:"center",gap:"12px"}}>
              <span>Live preview · <span style={{color:"#5ba898"}}>{CV_THEMES[cvTheme].name}</span> theme · 794 × 1123 px</span>
              <span style={{color:text2}}>·</span>
              <span>switch themes from the dots above</span>
            </div>
            <div style={{transform:"scale(0.82)",transformOrigin:"top center",boxShadow:"0 8px 60px rgba(0,0,0,.55),0 0 0 1px rgba(91,168,152,0.15)"}}>
              <CVPreview data={data} cvTheme={cvTheme} photoSrc={photoSrc}/>
            </div>
            <div style={{height:"32px"}}/>
          </div>
        )}
      </div>

      {/* Bottom rainbow bar — same as your .bottom-bar */}
      <div style={{height:"2px",background:"linear-gradient(90deg,transparent,#5ba898,#d4935a,#c96a6a,#7aaa6a,#8a7ab8,transparent)",animation:"barPulse 4s ease-in-out infinite",flexShrink:0}}/>

      <style>{`
        @keyframes cvSlideIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes borderSlide{0%{background-position:200% 0}100%{background-position:-200% 0}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes barPulse{0%,100%{opacity:.3}50%{opacity:.85}}
        @keyframes toastIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>
    </div>
  );
}