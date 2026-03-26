import { useEffect, useRef, useState } from "react";

const SKILLS = [
  { name:"React",          color:"#61dafb", bg:"rgba(97,218,251,0.12)",  size:90 },
  { name:"JavaScript",     color:"#f7df1e", bg:"rgba(247,223,30,0.12)",  size:85 },
  { name:"Node.js",        color:"#68a063", bg:"rgba(104,160,99,0.12)",  size:88 },
  { name:"MongoDB",        color:"#4db33d", bg:"rgba(77,179,61,0.12)",   size:80 },
  { name:"Tailwind",       color:"#38bdf8", bg:"rgba(56,189,248,0.12)",  size:82 },
  { name:"Express",        color:"#d4935a", bg:"rgba(212,147,90,0.12)",  size:75 },
  { name:"HTML",           color:"#e34c26", bg:"rgba(227,76,38,0.12)",   size:78 },
  { name:"CSS",            color:"#264de4", bg:"rgba(38,77,228,0.12)",   size:76 },
  { name:"TypeScript",     color:"#3178c6", bg:"rgba(49,120,198,0.12)",  size:74 },
  { name:"Git",            color:"#f05032", bg:"rgba(240,80,50,0.12)",   size:72 },
  { name:"Three.js",       color:"#5ba898", bg:"rgba(91,168,152,0.12)",  size:70 },
  { name:"GSAP",           color:"#88ce02", bg:"rgba(136,206,2,0.12)",   size:68 },
  { name:"Vite",           color:"#bd34fe", bg:"rgba(189,52,254,0.12)",  size:70 },
  { name:"framer-motion",  color:"#c96a6a", bg:"rgba(201,106,106,0.12)", size:72 },
  { name:"REST API",       color:"#d4935a", bg:"rgba(212,147,90,0.12)",  size:74 },
  { name:"Mongoose",       color:"#880000", bg:"rgba(136,0,0,0.12)",     size:68 },
  { name:"GitHub",         color:"#8a7ab8", bg:"rgba(138,122,184,0.12)", size:70 },
  { name:"Vercel",         color:"#b0b3b8", bg:"rgba(176,179,184,0.12)", size:66 },
];

function Bubble({ skill, isDark, isFloating }) {
  const [hovered, setHovered] = useState(false);
  const animStyle = isFloating || hovered ? {
    animation: `floatUp ${2 + Math.random() * 1.5}s ease-in-out infinite`,
    animationDelay: `${Math.random() * 1}s`,
  } : {};

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width:  skill.size,
        height: skill.size,
        borderRadius: "50%",
        background: skill.bg,
        border: `2px solid ${hovered ? skill.color : (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)")}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "border-color 0.3s, transform 0.3s, box-shadow 0.3s",
        boxShadow: hovered ? `0 8px 28px ${skill.color}44` : "none",
        transform: hovered ? "scale(1.12)" : "scale(1)",
        ...animStyle,
      }}
    >
      <span style={{
        fontSize: skill.size > 78 ? 11 : 10,
        fontWeight: 600,
        fontFamily: "monospace",
        color: hovered ? skill.color : (isDark ? "#b0b3b8" : "#5a4a35"),
        textAlign: "center",
        lineHeight: 1.3,
        padding: "0 6px",
        transition: "color 0.3s",
      }}>
        {skill.name}
      </span>
    </div>
  );
}

export default function SkillsSection({ isDark }) {
  const [sectionHovered, setSectionHovered] = useState(false);
  const c = isDark;
  const textColor = c ? "#e4e6eb" : "#1a1208";

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="skills" style={{
      minHeight: "100vh", padding: "100px 0 80px",
      background: c ? "#242526" : "#fffdf7",
      transition: "background 0.6s",
    }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px" }}>
        <p className="reveal" style={{ fontSize:11,letterSpacing:3,textTransform:"uppercase",fontFamily:"monospace",color:"#5ba898",marginBottom:8 }}>What I work with</p>
        <h2 className="reveal" style={{ fontSize:"clamp(28px,5vw,42px)",fontWeight:700,fontFamily:"Georgia,serif",color:textColor,marginBottom:12,transition:"color 0.6s" }}>
          My <span style={{ background:"linear-gradient(90deg,#5ba898,#d4935a)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text" }}>Skills</span>
        </h2>
        <p className="reveal" style={{ fontSize:14,color:c?"rgba(228,230,235,0.5)":"rgba(40,30,10,0.5)",marginBottom:40,fontFamily:"monospace" }}>
          Hover over the bubbles to interact ↓
        </p>

        {/* Bubble container */}
        <div
          className="reveal"
          onMouseEnter={() => setSectionHovered(true)}
          onMouseLeave={() => setSectionHovered(false)}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            justifyContent: "center",
            alignItems: "center",
            padding: "40px 20px",
            borderRadius: 24,
            border: `1px solid ${c ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
            background: c ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.5)",
            minHeight: 320,
            cursor: "default",
            transition: "border-color 0.4s",
            borderColor: sectionHovered ? "rgba(91,168,152,0.3)" : undefined,
          }}
        >
          {SKILLS.map((skill) => (
            <Bubble key={skill.name} skill={skill} isDark={isDark} isFloating={sectionHovered} />
          ))}
        </div>
      </div>
    </section>
  );
}
