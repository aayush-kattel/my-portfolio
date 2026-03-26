import { useEffect, useRef } from "react";
import { FaDownload, FaGraduationCap, FaBriefcase } from "react-icons/fa6";

const EDUCATION = [
  { year:"2022 – Present", title:"Bachelor in Information Technology", place:"TU — Tribhuvan University, Nepal", icon:<FaGraduationCap size={16}/> },
  { year:"2020 – 2022",    title:"+2 Science",                         place:"ABC Higher Secondary School",      icon:<FaGraduationCap size={16}/> },
];

const EXPERIENCE = [
  { year:"2023 – Present", title:"Freelance Web Developer", place:"Self-employed · Remote",           icon:<FaBriefcase size={16}/> },
  { year:"2023",           title:"Web Development Intern",   place:"Local IT Firm · Kathmandu, Nepal", icon:<FaBriefcase size={16}/> },
];

function useReveal(){
  useEffect(()=>{
    const obs=new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add("visible"); });
    },{threshold:0.12});
    document.querySelectorAll(".reveal").forEach(el=>obs.observe(el));
    return()=>obs.disconnect();
  },[]);
}

export default function AboutSection({isDark}){
  useReveal();
  const c=isDark;
  const textColor  = c?"#e4e6eb":"#1a1208";
  const mutedColor = c?"rgba(228,230,235,0.5)":"rgba(40,30,10,0.5)";
  const cardBg     = c?"rgba(255,255,255,0.03)":"rgba(255,255,255,0.6)";
  const border     = c?"rgba(228,230,235,0.1)":"rgba(26,18,8,0.1)";

  const TimelineItem=({item,delay})=>(
    <div className="reveal" style={{
      display:"flex", gap:16, marginBottom:20,
      animationDelay:`${delay}ms`,
    }}>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0}}>
        <div style={{
          width:36,height:36,borderRadius:"50%",
          background:"rgba(91,168,152,0.15)",
          border:"2px solid #5ba898",
          display:"flex",alignItems:"center",justifyContent:"center",
          color:"#5ba898",
        }}>{item.icon}</div>
        <div style={{width:1,flex:1,background:"rgba(91,168,152,0.2)",marginTop:4}}/>
      </div>
      <div style={{paddingTop:6,paddingBottom:16}}>
        <p style={{fontSize:11,fontFamily:"monospace",color:"#5ba898",letterSpacing:1,marginBottom:3}}>{item.year}</p>
        <p style={{fontSize:15,fontWeight:600,color:textColor,marginBottom:2}}>{item.title}</p>
        <p style={{fontSize:13,color:mutedColor}}>{item.place}</p>
      </div>
    </div>
  );

  return (
    <section id="about" style={{
      minHeight:"100vh", padding:"100px 0 80px",
      background: c?"#18191a":"#f0e8d8",
      transition:"background 0.6s",
    }}>
      <div style={{maxWidth:1000,margin:"0 auto",padding:"0 24px"}}>

        {/* Section label */}
        <p className="reveal" style={{fontSize:11,letterSpacing:3,textTransform:"uppercase",fontFamily:"monospace",color:"#5ba898",marginBottom:8}}>Get to know me</p>
        <h2 className="reveal" style={{fontSize:"clamp(28px,5vw,42px)",fontWeight:700,fontFamily:"Georgia,serif",color:textColor,marginBottom:48,transition:"color 0.6s"}}>
          About <span style={{background:"linear-gradient(90deg,#5ba898,#d4935a)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Me</span>
        </h2>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:48,alignItems:"start"}}>

          {/* Left — photo + bio + CV */}
          <div style={{display:"flex",flexDirection:"column",gap:24}}>
            {/* Photo */}
            <div className="reveal" style={{
              width:200,height:200,borderRadius:16,
              background:`linear-gradient(135deg,rgba(91,168,152,0.2),rgba(212,147,90,0.2))`,
              border:`2px solid rgba(91,168,152,0.3)`,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:56,fontWeight:700,fontFamily:"Georgia,serif",color:"#5ba898",
              overflow:"hidden",
            }}>
              {/* Replace with: <img src="your-photo.jpg" style={{width:"100%",height:"100%",objectFit:"cover"}}/> */}
              AK
            </div>

            {/* Bio */}
            <div className="reveal" style={{
              padding:20,borderRadius:14,
              background:cardBg, border:`1px solid ${border}`,
              backdropFilter:"blur(8px)",
            }}>
              <p style={{fontSize:14,lineHeight:1.8,color:mutedColor}}>
                Hi! I'm <strong style={{color:textColor}}>Aayush Kattel</strong>, a passionate web developer from Nepal
                currently pursuing my Bachelor's in Information Technology. I love building clean,
                performant web applications using modern technologies like React, Node.js, and MongoDB.
              </p>
              <p style={{fontSize:14,lineHeight:1.8,color:mutedColor,marginTop:12}}>
                I'm always learning and exploring new technologies — currently diving deeper into
                Three.js, GSAP, and TypeScript to build more immersive web experiences.
              </p>
            </div>

            {/* CV button */}
            <a href="/Aayush-Kattel-CV.pdf" download className="reveal" style={{
              display:"inline-flex",alignItems:"center",gap:10,
              padding:"12px 24px",borderRadius:12,
              background:"linear-gradient(135deg,#5ba898,#4a8a7a)",
              color:"#fff",textDecoration:"none",
              fontSize:14,fontWeight:600,
              boxShadow:"0 4px 16px rgba(91,168,152,0.35)",
              transition:"transform 0.2s, box-shadow 0.2s",
              alignSelf:"flex-start",
            }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(91,168,152,0.5)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 4px 16px rgba(91,168,152,0.35)";}}
            >
              <FaDownload size={16}/> Download CV
            </a>
          </div>

          {/* Right — education + experience */}
          <div>
            <h3 className="reveal" style={{fontSize:18,fontWeight:600,color:textColor,marginBottom:24,fontFamily:"Georgia,serif"}}>Education</h3>
            {EDUCATION.map((item,i)=><TimelineItem key={i} item={item} delay={i*100}/>)}

            <h3 className="reveal" style={{fontSize:18,fontWeight:600,color:textColor,margin:"32px 0 24px",fontFamily:"Georgia,serif"}}>Experience</h3>
            {EXPERIENCE.map((item,i)=><TimelineItem key={i} item={item} delay={i*100}/>)}
          </div>
        </div>
      </div>
    </section>
  );
}
