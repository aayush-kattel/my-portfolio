import { useEffect, useRef, useState } from "react";
import AnimatedBackground from "../components/AnimatedBackground";
import { FaGithub, FaLinkedin } from "react-icons/fa6";

const ROLES = [
  "Full Stack Web Developer",
  "React Developer",
  "Node.js Developer",
  "MongoDB Developer",
  "UI/UX Enthusiast",
];

function useTyping(words, speed=80, pause=1500){
  const [text,setText]=useState("");
  const [wi,setWi]=useState(0);
  const [ci,setCi]=useState(0);
  const [deleting,setDeleting]=useState(false);
  useEffect(()=>{
    const word=words[wi];
    const delay=deleting? speed/2 : ci===word.length ? pause : speed;
    const t=setTimeout(()=>{
      if(!deleting){
        if(ci<word.length){setText(word.slice(0,ci+1));setCi(c=>c+1);}
        else setDeleting(true);
      } else {
        if(ci>0){setText(word.slice(0,ci-1));setCi(c=>c-1);}
        else{setDeleting(false);setWi(w=>(w+1)%words.length);}
      }
    },delay);
    return()=>clearTimeout(t);
  },[text,ci,deleting,wi,words,speed,pause]);
  return text;
}

export default function HomeSection({isDark}){
  const text=useTyping(ROLES);
  const c=isDark;

  return (
    <section id="home" className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      <AnimatedBackground isDark={isDark}/>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10" style={{
        height:2,
        background:"linear-gradient(90deg,transparent,#5ba898,#d4935a,#c96a6a,#7aaa6a,#8a7ab8,transparent)",
        animation:"barPulse 4s ease-in-out infinite",
      }}/>

      {/* Hero content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 gap-5 select-none" style={{paddingTop:120}}>

        {/* Profile photo placeholder */}
        <div style={{
          width:130, height:130, borderRadius:"50%",
          border:`3px solid #5ba898`,
          background: c?"rgba(91,168,152,0.15)":"rgba(91,168,152,0.12)",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:48, fontWeight:700, fontFamily:"Georgia,serif",
          color:"#5ba898",
          boxShadow:"0 0 32px rgba(91,168,152,0.25)",
          animation:"mPulse 4s ease-in-out infinite",
          overflow:"hidden",
        }}>
          {/* Replace this div with <img src="your-photo.jpg" className="w-full h-full object-cover"/> */}
          AK
        </div>

        {/* Name */}
        <div>
          <h1 style={{
            fontSize:"clamp(28px,6vw,52px)", fontWeight:700,
            fontFamily:"Georgia,serif", letterSpacing:"-1px",
            color: c?"#e4e6eb":"#1a1208",
            transition:"color 0.6s",
          }}>
            Aayush{" "}
            <span style={{
              background:"linear-gradient(90deg,#5ba898,#d4935a)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
            }}>Kattel</span>
          </h1>
          <p style={{
            fontSize:"clamp(8px,1.5vw,11px)", letterSpacing:"3px",
            textTransform:"uppercase", fontFamily:"monospace",
            color: c?"rgba(228,230,235,0.4)":"rgba(40,30,10,0.4)",
            marginTop:6, transition:"color 0.6s",
          }}>Web Developer · Nepal</p>
        </div>

        {/* Typing animation */}
        <div style={{
          fontSize:"clamp(14px,2.5vw,20px)", fontFamily:"monospace",
          color:"#5ba898", height:32, display:"flex", alignItems:"center", gap:2,
        }}>
          <span>{text}</span>
          <span className="cursor" style={{color:"#d4935a"}}>|</span>
        </div>

        {/* Social links */}
        <div style={{display:"flex", gap:16, marginTop:4}}>
          {[
            { icon:<FaGithub size={22}/>,  label:"GitHub",   href:"https://github.com/aayushkattel" },
            { icon:<FaLinkedin size={22}/>, label:"LinkedIn", href:"https://linkedin.com/in/aayushkattel" },
          ].map(({icon,label,href})=>(
            <a key={label} href={href} target="_blank" rel="noreferrer"
              style={{
                display:"flex", alignItems:"center", gap:8,
                padding:"10px 20px", borderRadius:10,
                border:`1px solid ${c?"rgba(228,230,235,0.15)":"rgba(26,18,8,0.15)"}`,
                background: c?"rgba(228,230,235,0.06)":"rgba(26,18,8,0.05)",
                color: c?"#e4e6eb":"#1a1208",
                textDecoration:"none", fontSize:14, fontWeight:500,
                transition:"all 0.3s",
              }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="#5ba898";e.currentTarget.style.color="#5ba898";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=c?"rgba(228,230,235,0.15)":"rgba(26,18,8,0.15)";e.currentTarget.style.color=c?"#e4e6eb":"#1a1208";}}
            >
              {icon} {label}
            </a>
          ))}
        </div>

        {/* Scroll hint */}
        <div style={{marginTop:16,display:"flex",flexDirection:"column",alignItems:"center",gap:6,opacity:0.4}}>
          <p style={{fontSize:11,letterSpacing:2,textTransform:"uppercase",fontFamily:"monospace",color:c?"#e4e6eb":"#1a1208"}}>scroll down</p>
          <div style={{width:1,height:40,background:`linear-gradient(to bottom,${c?"#e4e6eb":"#1a1208"},transparent)`}}/>
        </div>
      </div>
    </section>
  );
}
