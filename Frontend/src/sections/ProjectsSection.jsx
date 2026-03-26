import { useEffect } from "react";
import { FaGithub, FaArrowUpRightFromSquare } from "react-icons/fa6";

const PROJECTS = [
  {
    title: "AK Connect",
    desc:  "A social connection platform built with React, Node.js, and MongoDB. Features real-time chat, user profiles, and friend connections.",
    tags:  ["React","Node.js","MongoDB","Express","Socket.io"],
    github:"https://github.com/aayushkattel/ak-connect",
    live:  "https://ak-connect.vercel.app",
    color: "#5ba898",
    img:   null,
  },
  {
    title: "Portfolio Website",
    desc:  "This portfolio — a single-page app with animated backgrounds, floating nav, theme toggle, and smooth scroll between sections.",
    tags:  ["React","Tailwind","Vite","Canvas API"],
    github:"https://github.com/aayushkattel/portfolio",
    live:  "#home",
    color: "#d4935a",
    img:   null,
  },
  {
    title: "E-Commerce App",
    desc:  "A full-stack e-commerce application with product listings, cart, authentication, and payment integration.",
    tags:  ["React","Node.js","MongoDB","Stripe"],
    github:"https://github.com/aayushkattel",
    live:  "#",
    color: "#8a7ab8",
    img:   null,
  },
  {
    title: "Task Manager",
    desc:  "A clean task management app with drag-and-drop, categories, deadlines, and local storage persistence.",
    tags:  ["React","Tailwind","LocalStorage"],
    github:"https://github.com/aayushkattel",
    live:  "#",
    color: "#c96a6a",
    img:   null,
  },
];

export default function ProjectsSection({ isDark }) {
  const c = isDark;
  const textColor  = c ? "#e4e6eb" : "#1a1208";
  const mutedColor = c ? "rgba(228,230,235,0.5)" : "rgba(40,30,10,0.5)";

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
    }, { threshold: 0.1 });
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="projects" style={{
      minHeight: "100vh", padding: "100px 0 80px",
      background: c ? "#18191a" : "#f0e8d8",
      transition: "background 0.6s",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <p className="reveal" style={{ fontSize:11,letterSpacing:3,textTransform:"uppercase",fontFamily:"monospace",color:"#5ba898",marginBottom:8 }}>What I've built</p>
        <h2 className="reveal" style={{ fontSize:"clamp(28px,5vw,42px)",fontWeight:700,fontFamily:"Georgia,serif",color:textColor,marginBottom:48,transition:"color 0.6s" }}>
          My <span style={{ background:"linear-gradient(90deg,#5ba898,#d4935a)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text" }}>Projects</span>
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 24,
        }}>
          {PROJECTS.map((p, i) => (
            <div
              key={p.title}
              className="reveal"
              style={{
                borderRadius: 16,
                border: `1px solid ${c ? "rgba(255,255,255,0.08)" : "rgba(26,18,8,0.1)"}`,
                background: c ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.65)",
                overflow: "hidden",
                transition: "transform 0.3s, box-shadow 0.3s, border-color 0.3s",
                backdropFilter: "blur(8px)",
                animationDelay: `${i * 100}ms`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = `0 16px 40px ${p.color}22`;
                e.currentTarget.style.borderColor = p.color + "55";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = c ? "rgba(255,255,255,0.08)" : "rgba(26,18,8,0.1)";
              }}
            >
              {/* Image area */}
              <div style={{
                height: 180,
                background: `linear-gradient(135deg, ${p.color}22, ${p.color}44)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 40, color: p.color, fontWeight: 700, fontFamily: "Georgia,serif",
                borderBottom: `1px solid ${c ? "rgba(255,255,255,0.06)" : "rgba(26,18,8,0.06)"}`,
              }}>
                {/* Replace with: <img src={p.img} style={{width:"100%",height:"100%",objectFit:"cover"}}/> */}
                {p.title.split(" ").map(w => w[0]).join("")}
              </div>

              {/* Content */}
              <div style={{ padding: "20px 20px 16px" }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: textColor, marginBottom: 8, fontFamily: "Georgia,serif" }}>{p.title}</h3>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: mutedColor, marginBottom: 14 }}>{p.desc}</p>

                {/* Tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                  {p.tags.map(tag => (
                    <span key={tag} style={{
                      fontSize: 11, padding: "3px 10px", borderRadius: 20,
                      background: `${p.color}18`,
                      border: `1px solid ${p.color}44`,
                      color: p.color, fontFamily: "monospace",
                    }}>{tag}</span>
                  ))}
                </div>

                {/* Links */}
                <div style={{ display: "flex", gap: 12 }}>
                  <a href={p.github} target="_blank" rel="noreferrer" style={{
                    display:"flex",alignItems:"center",gap:6,
                    fontSize:13,fontWeight:500,color:textColor,textDecoration:"none",
                    padding:"7px 14px",borderRadius:8,
                    border:`1px solid ${c?"rgba(255,255,255,0.12)":"rgba(26,18,8,0.12)"}`,
                    transition:"all 0.2s",
                  }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=p.color;e.currentTarget.style.color=p.color;}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=c?"rgba(255,255,255,0.12)":"rgba(26,18,8,0.12)";e.currentTarget.style.color=textColor;}}
                  >
                    <FaGithub size={14}/> GitHub
                  </a>
                  <a href={p.live} target="_blank" rel="noreferrer" style={{
                    display:"flex",alignItems:"center",gap:6,
                    fontSize:13,fontWeight:500,color:"#fff",textDecoration:"none",
                    padding:"7px 14px",borderRadius:8,
                    background:`linear-gradient(135deg,${p.color},${p.color}cc)`,
                    transition:"opacity 0.2s",
                  }}
                    onMouseEnter={e=>e.currentTarget.style.opacity="0.85"}
                    onMouseLeave={e=>e.currentTarget.style.opacity="1"}
                  >
                    <FaArrowUpRightFromSquare size={13}/> Live Demo
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
