import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa6";
import AnimatedBackground from "./AnimatedBackground";
import useTyping from "../hooks/useTyping";
import { useTheme } from "../hooks/useTheme";
import { ROLES } from "../data/constants";
import { apiGetProfile } from "../api";

export default function HeroSection() {
  const { isDark } = useTheme();
  const sectionRef = useRef(null);
  const typedText  = useTyping(ROLES);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    apiGetProfile().then(setProfile).catch(() => {});
  }, []);

  const fullName  = profile?.name     || "Aayush Kattel";
  const bio       = profile?.bio      || "A passionate web developer from Nepal building clean, purposeful digital experiences.";
  const avatarSrc = profile?.logoUrl  || null;
  const [firstName, ...rest] = fullName.split(" ");
  const lastName  = rest.join(" ");

  const socials = [
    { href: profile?.github   || "https://github.com",   Icon: FaGithub,   label: "GitHub",   color: "inherit"  },
    { href: profile?.linkedin || "https://linkedin.com", Icon: FaLinkedin, label: "LinkedIn", color: "#0077b5"  },
    { href: profile?.facebook || "https://facebook.com", Icon: FaFacebook, label: "Facebook", color: "#1877f2"  },
  ];

  return (
    <>
      <style>{`
        .hero-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
        }
        .hero-avatar {
          flex-shrink: 0;
        }
        @media (max-width: 700px) {
          .hero-inner {
            flex-direction: column-reverse;
            align-items: center;
            text-align: center;
            gap: 28px;
          }
          .hero-left {
            align-items: center !important;
          }
          .hero-socials {
            justify-content: center;
          }
          .hero-bio {
            max-width: 100% !important;
          }
          .hero-name {
            white-space: normal !important;
          }
        }
      `}</style>

      <section
        id="home"
        ref={sectionRef}
        style={{
          position: "relative",
          overflow: "hidden",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          background: "transparent",
          padding: "90px clamp(18px, 5vw, 40px) 70px",
        }}
      >
        <AnimatedBackground sectionRef={sectionRef} />
        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "1100px", margin: "0 auto" }}>
          <div className="hero-inner">

            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="hero-left"
              style={{ flex: 1, display: "flex", flexDirection: "column", gap: "18px" }}
            >
              <span style={{ fontSize: "13px", fontFamily: "monospace", letterSpacing: "3px", textTransform: "uppercase", color: "#5ba898" }}>
                👋 Hello, I'm
              </span>

              <h1
                className="hero-name"
                style={{
                  fontSize: "clamp(28px, 5vw, 58px)",
                  fontWeight: 700,
                  fontFamily: "Georgia,serif",
                  letterSpacing: "-1px",
                  lineHeight: 1.1,
                  whiteSpace: "nowrap",
                  color: isDark ? "#e4e6eb" : "#1a1208",
                  transition: "color 0.6s",
                }}
              >
                {firstName} <span className="grad-text">{lastName}</span>
              </h1>

              <div style={{ fontSize: "clamp(13px,1.8vw,18px)", fontFamily: "monospace", height: "26px", display: "flex", alignItems: "center", color: isDark ? "#b0b3b8" : "#5a4a35", transition: "color 0.6s" }}>
                {typedText}
                <span className="animate-blink" style={{ display: "inline-block", width: "2px", height: "1.1em", background: "#5ba898", marginLeft: "2px" }} />
              </div>

              <p
                className="hero-bio"
                style={{ fontSize: "clamp(12px,1.4vw,14px)", lineHeight: 1.8, maxWidth: "460px", color: isDark ? "rgba(228,230,235,0.5)" : "rgba(40,30,10,0.6)", transition: "color 0.6s" }}
              >
                {bio}
              </p>

              <div className="hero-socials" style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                {socials.map(({ href, Icon, label, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: "7px", textDecoration: "none", fontSize: "13px", fontWeight: 500, padding: "8px 14px", borderRadius: "8px", color: isDark ? "#e4e6eb" : "#1a1208", background: isDark ? "rgba(228,230,235,0.06)" : "rgba(26,18,8,0.05)", transition: "background 0.2s,transform 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(91,168,152,0.12)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = isDark ? "rgba(228,230,235,0.06)" : "rgba(26,18,8,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    <Icon style={{ fontSize: "15px", color }} />{label}
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Right — avatar */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="hero-avatar"
            >
              <div style={{ position: "relative", width: "clamp(160px, 25vw, 300px)", aspectRatio: "1" }}>
                <div className="animate-spin-slower" style={{ position: "absolute", inset: "-6px", borderRadius: "50%", border: "2px dashed rgba(91,168,152,0.35)" }} />
                <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", border: "4px solid #5ba898", background: "linear-gradient(135deg,rgba(91,168,152,0.15),rgba(212,147,90,0.1))", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
                  {avatarSrc
                    ? <img src={avatarSrc} alt={fullName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <span className="grad-text-diag" style={{ fontSize: "clamp(40px,8vw,80px)", fontWeight: 700, fontFamily: "Georgia,serif" }}>AK</span>
                  }
                </div>
                <div className="animate-dot-pulse" style={{ position: "absolute", width: "16px", height: "16px", borderRadius: "50%", background: "#d4935a", bottom: "8%", right: "8%", zIndex: 2, border: `3px solid ${isDark ? "#18191a" : "#f0e8d8"}` }} />
              </div>
            </motion.div>

          </div>
          <div className="bottom-bar" style={{ marginTop: "80px" }} />
        </div>
      </section>
    </>
  );
}