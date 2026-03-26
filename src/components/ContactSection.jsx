import { useRef, useState } from "react";
import { FaEnvelope, FaLocationDot, FaGithub, FaLinkedin, FaFacebook, FaPaperPlane } from "react-icons/fa6";
import AnimatedBackground from "./AnimatedBackground";
import AKLogo from "./AKLogo";
import { useTheme } from "../hooks/useTheme";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiSendMessage } from "../api";

export default function ContactSection() {
  const { isDark } = useTheme();
  const sectionRef = useRef(null);
  const [form, setForm]       = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const t = (l, d) => isDark ? d : l;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.", { position: "top-right", autoClose: 3000, theme: isDark ? "dark" : "light" });
      return;
    }
    setSending(true);
    try {
      await apiSendMessage(form);
      setForm({ name: "", email: "", subject: "", message: "" });
      toast.success("Message sent! Check your email for confirmation.", { position: "top-right", autoClose: 4500, theme: isDark ? "dark" : "light" });
    } catch (err) {
      toast.error(err.message || "Failed to send message. Please try again.", { position: "top-right", autoClose: 4000, theme: isDark ? "dark" : "light" });
    } finally { setSending(false); }
  };

  const inputStyle = {
    padding: "12px 16px", borderRadius: "9px", fontSize: "13px",
    fontFamily: "system-ui,sans-serif", outline: "none", width: "100%", resize: "none",
    background: t("#ffffff", "rgba(255,255,255,0.05)"),
    border: `1px solid ${t("rgba(26,18,8,0.12)", "rgba(228,230,235,0.12)")}`,
    color: t("#1a1208", "#e4e6eb"),
    transition: "border-color 0.2s,background 0.6s,color 0.6s,box-shadow 0.2s",
    boxSizing: "border-box",
  };

  const contactItems = [
    { href: "mailto:aayushkattel@email.com", Icon: FaEnvelope,    label: "Email",    value: "aayushkattel@email.com",       iconBg: "rgba(91,168,152,0.12)",  iconColor: "#5ba898" },
    { href: "#",                              Icon: FaLocationDot, label: "Location", value: "Kathmandu, Nepal",             iconBg: "rgba(212,147,90,0.12)",  iconColor: "#d4935a" },
    { href: "https://github.com",             Icon: FaGithub,     label: "GitHub",   value: "github.com/aayushkattel",      iconBg: "rgba(138,122,184,0.12)", iconColor: "#8a7ab8" },
    { href: "https://linkedin.com",           Icon: FaLinkedin,   label: "LinkedIn", value: "linkedin.com/in/aayushkattel", iconBg: "rgba(100,148,192,0.12)", iconColor: "#0077b5" },
    { href: "https://facebook.com",           Icon: FaFacebook,   label: "Facebook", value: "facebook.com/aayushkattel",    iconBg: "rgba(24,119,242,0.12)",  iconColor: "#1877f2" },
  ];

  return (
    <>
      <style>{`
        @keyframes borderSlide { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        .contact-grid        { display: grid; grid-template-columns: 1fr 1.4fr; gap: 48px; align-items: start; }
        .contact-name-email  { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

        /* Desktop: show full rows, hide icon strip */
        .contact-item-full { display: flex !important; }
        .contact-icons-row { display: none !important; }

        @media (max-width: 820px) {
          .contact-grid { grid-template-columns: 1fr; gap: 28px; }
          /* Mobile: hide full rows, show icon strip */
          .contact-item-full { display: none !important; }
          .contact-icons-row { display: flex !important; }
        }
        @media (max-width: 480px) {
          .contact-name-email { grid-template-columns: 1fr; }
        }
      `}</style>

      <section
        id="contact"
        ref={sectionRef}
        style={{ position: "relative", overflow: "hidden", background: "transparent", padding: "90px clamp(18px,5vw,40px) 70px" }}
      >
        <AnimatedBackground sectionRef={sectionRef} />
        <ToastContainer />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "1100px", margin: "0 auto" }}>

          <div className="reveal">
            <AKLogo />
            <p style={{ fontSize: "11px", fontFamily: "monospace", letterSpacing: "3px", textTransform: "uppercase", color: "#5ba898", marginBottom: "8px" }}>Get In Touch</p>
            <h2 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 700, fontFamily: "Georgia,serif", letterSpacing: "-0.5px", marginBottom: "10px", color: t("#1a1208", "#e4e6eb"), transition: "color 0.6s" }}>
              Contact <span className="grad-text">Me</span>
            </h2>
            <div style={{ width: "48px", height: "3px", borderRadius: "2px", background: "linear-gradient(90deg,#5ba898,#d4935a)", marginBottom: "40px" }} />
          </div>

          <div className="reveal">
            <div style={{ position: "relative", borderRadius: "22px" }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: "22px", background: "linear-gradient(90deg,transparent,#5ba898,#d4935a,#c96a6a,#7aaa6a,#8a7ab8,#5ba898,transparent)", backgroundSize: "200% 100%", animation: "borderSlide 3s linear infinite" }} />
              <div style={{ position: "relative", zIndex: 1, margin: "2px", borderRadius: "20px", padding: "clamp(20px,4vw,40px)", background: t("rgba(255,253,247,0.92)", "rgba(36,37,38,0.92)"), boxShadow: t("0 4px 32px rgba(26,18,8,0.06)", "0 4px 32px rgba(0,0,0,0.25)"), transition: "background 0.6s" }}>

                <div className="contact-grid">

                  {/* ── Left ── */}
                  <div className="reveal-left">
                    <h3 style={{ fontSize: "clamp(20px,3vw,30px)", fontWeight: 700, fontFamily: "Georgia,serif", lineHeight: 1.3, marginBottom: "14px", color: t("#1a1208", "#e4e6eb") }}>
                      Let's work <span className="grad-text">together</span>
                    </h3>
                    <p style={{ fontSize: "13.5px", lineHeight: 1.78, marginBottom: "28px", color: t("rgba(40,30,10,0.62)", "rgba(228,230,235,0.52)") }}>
                      I am open to freelance projects, full-time opportunities, and collaborations. Whether you have a project in mind or just want to say hello — my inbox is always open.
                    </p>

                    {/* Desktop: full label + value rows */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
                      {contactItems.map(({ href, Icon, label, value, iconBg, iconColor }) => (
                        <a
                          key={label}
                          href={href}
                          target={href.startsWith("http") ? "_blank" : undefined}
                          rel="noopener noreferrer"
                          className="contact-item-full"
                          style={{ alignItems: "center", gap: "14px", padding: "12px 16px", borderRadius: "12px", textDecoration: "none", background: t("rgba(26,18,8,0.04)", "rgba(228,230,235,0.05)"), border: `0.5px solid ${t("rgba(26,18,8,0.07)", "rgba(228,230,235,0.08)")}`, transition: "background 0.2s,transform 0.15s" }}
                          onMouseEnter={e => { e.currentTarget.style.background = "rgba(91,168,152,0.1)"; e.currentTarget.style.transform = "translateX(4px)"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = t("rgba(26,18,8,0.04)", "rgba(228,230,235,0.05)"); e.currentTarget.style.transform = "translateX(0)"; }}
                        >
                          <div style={{ width: "38px", height: "38px", borderRadius: "10px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", background: iconBg, color: iconColor }}><Icon /></div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: "10px", fontFamily: "monospace", letterSpacing: "1.5px", textTransform: "uppercase", color: "#5ba898", marginBottom: "2px" }}>{label}</div>
                            <div style={{ fontSize: "13px", fontWeight: 500, color: t("#1a1208", "#e4e6eb"), overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</div>
                          </div>
                        </a>
                      ))}
                    </div>

                    {/* Mobile: icon-only strip */}
                    <div className="contact-icons-row" style={{ gap: "10px", flexWrap: "wrap", marginBottom: "24px" }}>
                      {contactItems.map(({ href, Icon, label, iconBg, iconColor }) => (
                        <a
                          key={label}
                          href={href}
                          target={href.startsWith("http") ? "_blank" : undefined}
                          rel="noopener noreferrer"
                          title={label}
                          style={{ width: "48px", height: "48px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "19px", background: iconBg, color: iconColor, textDecoration: "none", transition: "transform 0.15s,box-shadow 0.15s", flexShrink: 0 }}
                          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px) scale(1.1)"; e.currentTarget.style.boxShadow = `0 6px 16px ${iconColor}44`; }}
                          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0) scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
                        >
                          <Icon />
                        </a>
                      ))}
                    </div>

                    {/* Social icon buttons */}
                    {/* <div style={{ display: "flex", gap: "10px" }}>
                      {[
                        { href: "https://github.com",   Icon: FaGithub,   bg: "rgba(138,122,184,0.12)", color: "#8a7ab8" },
                        { href: "https://linkedin.com",  Icon: FaLinkedin, bg: "rgba(100,148,192,0.12)", color: "#0077b5" },
                        { href: "https://facebook.com",  Icon: FaFacebook, bg: "rgba(24,119,242,0.12)",  color: "#1877f2" },
                      ].map(({ href, Icon, bg, color }) => (
                        <a
                          key={href}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ width: "42px", height: "42px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "17px", background: bg, color, textDecoration: "none", transition: "transform 0.15s" }}
                          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px) scale(1.08)"; }}
                          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0) scale(1)"; }}
                        ><Icon /></a>
                      ))}
                    </div> */}
                  </div>

                  {/* ── Right — form ── */}
                  <div className="reveal-right">
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div className="contact-name-email">
                        {[
                          { id: "name",  label: "Your Name",  type: "text",  placeholder: "John Doe"        },
                          { id: "email", label: "Your Email", type: "email", placeholder: "john@email.com"  },
                        ].map(({ id, label, type, placeholder }) => (
                          <div key={id} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <label style={{ fontSize: "11px", fontFamily: "monospace", letterSpacing: "1.5px", textTransform: "uppercase", color: "#5ba898" }}>{label}</label>
                            <input
                              type={type} placeholder={placeholder} value={form[id]}
                              onChange={e => setForm({ ...form, [id]: e.target.value })}
                              style={inputStyle}
                              onFocus={e => { e.target.style.borderColor = "#5ba898"; e.target.style.boxShadow = "0 0 0 3px rgba(91,168,152,0.12)"; }}
                              onBlur={e  => { e.target.style.borderColor = t("rgba(26,18,8,0.12)", "rgba(228,230,235,0.12)"); e.target.style.boxShadow = "none"; }}
                            />
                          </div>
                        ))}
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontSize: "11px", fontFamily: "monospace", letterSpacing: "1.5px", textTransform: "uppercase", color: "#5ba898" }}>Subject</label>
                        <input
                          type="text" placeholder="Project Inquiry" value={form.subject}
                          onChange={e => setForm({ ...form, subject: e.target.value })}
                          style={inputStyle}
                          onFocus={e => { e.target.style.borderColor = "#5ba898"; e.target.style.boxShadow = "0 0 0 3px rgba(91,168,152,0.12)"; }}
                          onBlur={e  => { e.target.style.borderColor = t("rgba(26,18,8,0.12)", "rgba(228,230,235,0.12)"); e.target.style.boxShadow = "none"; }}
                        />
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontSize: "11px", fontFamily: "monospace", letterSpacing: "1.5px", textTransform: "uppercase", color: "#5ba898" }}>Message</label>
                        <textarea
                          placeholder="Tell me about your project or just say hello..."
                          value={form.message}
                          onChange={e => setForm({ ...form, message: e.target.value })}
                          style={{ ...inputStyle, minHeight: "120px" }}
                          onFocus={e => { e.target.style.borderColor = "#5ba898"; e.target.style.boxShadow = "0 0 0 3px rgba(91,168,152,0.12)"; }}
                          onBlur={e  => { e.target.style.borderColor = t("rgba(26,18,8,0.12)", "rgba(228,230,235,0.12)"); e.target.style.boxShadow = "none"; }}
                        />
                      </div>

                      <button
                        type="submit" disabled={sending}
                        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", padding: "13px 28px", borderRadius: "9px", border: "none", cursor: sending ? "not-allowed" : "pointer", fontSize: "14px", fontWeight: 600, fontFamily: "system-ui,sans-serif", background: "#5ba898", color: "#fff", letterSpacing: "0.3px", opacity: sending ? 0.7 : 1, transition: "opacity 0.2s,transform 0.15s" }}
                        onMouseEnter={e => !sending && (e.currentTarget.style.opacity = ".88")}
                        onMouseLeave={e => !sending && (e.currentTarget.style.opacity = "1")}
                      >
                        <FaPaperPlane /> {sending ? "Sending…" : "Send Message"}
                      </button>
                    </form>
                  </div>

                </div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: "40px", fontSize: "12px", fontFamily: "monospace", color: "rgba(91,168,152,0.7)" }}>
            Designed &amp; Built by <span style={{ color: "#5ba898", fontWeight: 600 }}>Aayush Kattel</span> &nbsp;·&nbsp; Nepal &nbsp;·&nbsp; 2026
          </div>
          <div className="bottom-bar" style={{ marginTop: "24px" }} />
        </div>
      </section>
    </>
  );
}