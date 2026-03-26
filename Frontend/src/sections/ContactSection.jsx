import { useEffect, useState } from "react";
import { FaEnvelope, FaPhone, FaLocationDot, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa6";

export default function ContactSection({ isDark }) {
  const c = isDark;
  const textColor  = c ? "#e4e6eb" : "#1a1208";
  const mutedColor = c ? "rgba(228,230,235,0.5)" : "rgba(40,30,10,0.5)";
  const cardBg     = c ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.65)";
  const border     = c ? "rgba(255,255,255,0.08)" : "rgba(26,18,8,0.1)";
  const inputBg    = c ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.8)";

  const [form, setForm] = useState({ name:"", email:"", message:"" });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
    }, { threshold: 0.1 });
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Wire to your backend / EmailJS / Formspree here
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name:"", email:"", message:"" });
  };

  const inputStyle = {
    width:"100%", padding:"12px 14px", borderRadius:10,
    border:`1px solid ${border}`, background:inputBg,
    color:textColor, fontSize:14, fontFamily:"system-ui,sans-serif",
    outline:"none", transition:"border-color 0.3s",
  };

  const INFO = [
    { icon:<FaEnvelope size={16}/>, label:"Email",    val:"aayushkattel@email.com",  href:"mailto:aayushkattel@email.com" },
    { icon:<FaPhone    size={16}/>, label:"Phone",    val:"+977-98XXXXXXXX",          href:"tel:+97798XXXXXXXX" },
    { icon:<FaLocationDot size={16}/>,label:"Location",val:"Kathmandu, Nepal",        href:"#" },
  ];

  const SOCIALS = [
    { icon:<FaGithub  size={20}/>, href:"https://github.com/aayushkattel",      color:"#b0b3b8" },
    { icon:<FaLinkedin size={20}/>,href:"https://linkedin.com/in/aayushkattel", color:"#0077b5" },
    { icon:<FaTwitter  size={20}/>,href:"https://twitter.com/aayushkattel",     color:"#1da1f2" },
  ];

  return (
    <section id="contact" style={{
      minHeight:"100vh", padding:"100px 0 60px",
      background: c ? "#242526" : "#fffdf7",
      transition:"background 0.6s",
    }}>
      <div style={{maxWidth:1000,margin:"0 auto",padding:"0 24px"}}>
        <p className="reveal" style={{fontSize:11,letterSpacing:3,textTransform:"uppercase",fontFamily:"monospace",color:"#5ba898",marginBottom:8}}>Get in touch</p>
        <h2 className="reveal" style={{fontSize:"clamp(28px,5vw,42px)",fontWeight:700,fontFamily:"Georgia,serif",color:textColor,marginBottom:48,transition:"color 0.6s"}}>
          Contact <span style={{background:"linear-gradient(90deg,#5ba898,#d4935a)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Me</span>
        </h2>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:40,alignItems:"start"}}>

          {/* Left — info + social + map */}
          <div style={{display:"flex",flexDirection:"column",gap:24}}>

            {/* Contact info */}
            <div className="reveal" style={{padding:24,borderRadius:16,border:`1px solid ${border}`,background:cardBg}}>
              <h3 style={{fontSize:16,fontWeight:600,color:textColor,marginBottom:20,fontFamily:"Georgia,serif"}}>Contact Info</h3>
              {INFO.map(({icon,label,val,href})=>(
                <a key={label} href={href} style={{
                  display:"flex",alignItems:"center",gap:14,
                  padding:"10px 0",textDecoration:"none",
                  borderBottom:`1px solid ${border}`,
                  transition:"color 0.2s",
                }}
                  onMouseEnter={e=>e.currentTarget.style.color="#5ba898"}
                  onMouseLeave={e=>e.currentTarget.style.color=""}
                >
                  <div style={{width:34,height:34,borderRadius:"50%",background:"rgba(91,168,152,0.15)",display:"flex",alignItems:"center",justifyContent:"center",color:"#5ba898",flexShrink:0}}>{icon}</div>
                  <div>
                    <p style={{fontSize:11,color:mutedColor,letterSpacing:1,textTransform:"uppercase",fontFamily:"monospace"}}>{label}</p>
                    <p style={{fontSize:13,color:textColor,fontWeight:500}}>{val}</p>
                  </div>
                </a>
              ))}

              {/* Socials */}
              <div style={{display:"flex",gap:12,marginTop:20}}>
                {SOCIALS.map(({icon,href,color},i)=>(
                  <a key={i} href={href} target="_blank" rel="noreferrer" style={{
                    width:38,height:38,borderRadius:"50%",
                    border:`1px solid ${border}`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    color:mutedColor,textDecoration:"none",
                    transition:"all 0.2s",
                  }}
                    onMouseEnter={e=>{e.currentTarget.style.color=color;e.currentTarget.style.borderColor=color;e.currentTarget.style.background=color+"18";}}
                    onMouseLeave={e=>{e.currentTarget.style.color=mutedColor;e.currentTarget.style.borderColor=border;e.currentTarget.style.background="transparent";}}
                  >{icon}</a>
                ))}
              </div>
            </div>

            {/* Map embed */}
            <div className="reveal" style={{borderRadius:16,overflow:"hidden",border:`1px solid ${border}`,height:200}}>
              <iframe
                title="Kathmandu Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56516.31625099728!2d85.29111819771688!3d27.70895590499867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb198a307baabf%3A0xb5137c1bf18db1ea!2sKathmandu%2044600%2C%20Nepal!5e0!3m2!1sen!2sus!4v1705000000000!5m2!1sen!2sus"
                width="100%" height="200"
                style={{border:0,filter:c?"invert(0.9) hue-rotate(180deg)":"none",display:"block"}}
                allowFullScreen="" loading="lazy"
              />
            </div>
          </div>

          {/* Right — contact form */}
          <div className="reveal" style={{padding:28,borderRadius:16,border:`1px solid ${border}`,background:cardBg}}>
            <h3 style={{fontSize:16,fontWeight:600,color:textColor,marginBottom:24,fontFamily:"Georgia,serif"}}>Send a Message</h3>

            {sent && (
              <div style={{padding:"12px 16px",borderRadius:10,background:"rgba(91,168,152,0.15)",border:"1px solid rgba(91,168,152,0.3)",color:"#5ba898",fontSize:14,marginBottom:20}}>
                ✓ Message sent! I'll get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",gap:16}}>
              <div>
                <label style={{fontSize:12,color:mutedColor,letterSpacing:1,textTransform:"uppercase",fontFamily:"monospace",display:"block",marginBottom:6}}>Name</label>
                <input required value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}
                  placeholder="Aayush Kattel" style={inputStyle}
                  onFocus={e=>e.target.style.borderColor="#5ba898"}
                  onBlur={e=>e.target.style.borderColor=border}
                />
              </div>
              <div>
                <label style={{fontSize:12,color:mutedColor,letterSpacing:1,textTransform:"uppercase",fontFamily:"monospace",display:"block",marginBottom:6}}>Email</label>
                <input required type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}
                  placeholder="you@email.com" style={inputStyle}
                  onFocus={e=>e.target.style.borderColor="#5ba898"}
                  onBlur={e=>e.target.style.borderColor=border}
                />
              </div>
              <div>
                <label style={{fontSize:12,color:mutedColor,letterSpacing:1,textTransform:"uppercase",fontFamily:"monospace",display:"block",marginBottom:6}}>Message</label>
                <textarea required rows={5} value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))}
                  placeholder="Hi Aayush, I'd love to work with you..." style={{...inputStyle,resize:"vertical"}}
                  onFocus={e=>e.target.style.borderColor="#5ba898"}
                  onBlur={e=>e.target.style.borderColor=border}
                />
              </div>
              <button type="submit" style={{
                padding:"13px 0",borderRadius:10,border:"none",cursor:"pointer",
                background:"linear-gradient(135deg,#5ba898,#4a8a7a)",
                color:"#fff",fontSize:15,fontWeight:600,
                boxShadow:"0 4px 16px rgba(91,168,152,0.35)",
                transition:"opacity 0.2s, transform 0.2s",
              }}
                onMouseEnter={e=>{e.currentTarget.style.opacity="0.88";e.currentTarget.style.transform="translateY(-1px)";}}
                onMouseLeave={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.transform="translateY(0)";}}
              >
                Send Message →
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <p className="reveal" style={{textAlign:"center",marginTop:60,fontSize:12,color:mutedColor,fontFamily:"monospace",letterSpacing:1}}>
          Built with ❤ by Aayush Kattel · {new Date().getFullYear()}
        </p>
      </div>
    </section>
  );
}
