import { useRef, useEffect, useState } from "react";
import {
  FaChartSimple, FaMugHot, FaLocationDot, FaGamepad,
  FaPencil, FaGithub, FaDownload, FaCalendar, FaStar,
  FaGraduationCap, FaBriefcase,
} from "react-icons/fa6";
import AnimatedBackground from "./AnimatedBackground";
import AKLogo from "./AKLogo";
import RainbowBorder from "./RainbowBorder";
import { useTheme } from "../hooks/useTheme";
import { apiGetProfile, apiGetEducation, apiGetExperience } from "../api";

export default function AboutSection() {
  const { isDark } = useTheme();
  const sectionRef  = useRef(null);

  const [profile,    setProfile]    = useState(null);
  const [education,  setEducation]  = useState([]);
  const [experience, setExperience] = useState([]);

  const t = (l, d) => isDark ? d : l;

  useEffect(() => {
    apiGetProfile().then(setProfile).catch(() => {});
    apiGetEducation().then(setEducation).catch(() => {});
    apiGetExperience().then(setExperience).catch(() => {});
  }, []);

  const glance = [
    { n: profile?.stats?.totalProjects || "10+", l: "Projects"     },
    { n: "3+",                                    l: "Yrs Coding"   },
    { n: profile?.stats?.skillsListed  || "8+",  l: "Technologies" },
  ];

  /* ── Download CV button ──────────────────────────────────────── */
  const CVButton = () => {
    if (!profile) return null; // still loading — render nothing

    const commonStyle = {
      display: "inline-flex", alignItems: "center", gap: "9px",
      padding: "11px 26px", borderRadius: "8px", fontWeight: 600,
      fontSize: "13px", marginTop: "6px", textDecoration: "none",
      transition: "opacity 0.2s, transform 0.15s",
    };

    if (profile.cvUrl) {
      return (
        <a
          href={profile.cvUrl}        /* fl_attachment=Resume.pdf already appended by backend */
          target="_blank"
          rel="noreferrer"
          style={{ ...commonStyle, background: "#5ba898", color: "#fff", cursor: "pointer" }}
          onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = "1";    e.currentTarget.style.transform = "translateY(0)";    }}
        >
          <FaDownload /> Download CV
        </a>
      );
    }

    /* CV not uploaded yet — show disabled button so layout doesn't shift */
    return (
      <button
        disabled
        title="CV not available yet"
        style={{
          ...commonStyle,
          background: t("rgba(91,168,152,0.15)", "rgba(91,168,152,0.12)"),
          color: t("rgba(40,30,10,0.35)", "rgba(228,230,235,0.3)"),
          border: `1px dashed ${t("rgba(91,168,152,0.25)", "rgba(91,168,152,0.2)")}`,
          cursor: "not-allowed",
        }}
      >
        <FaDownload /> Download CV
      </button>
    );
  };

  return (
    <>
      <style>{`
        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 52px;
        }
        @media (max-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr;
            gap: 36px;
          }
        }
      `}</style>

      <section
        id="about"
        ref={sectionRef}
        style={{
          position: "relative", overflow: "hidden",
          background: "transparent",
          padding: "90px clamp(18px, 5vw, 40px) 70px",
        }}
      >
        <AnimatedBackground sectionRef={sectionRef} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "1100px", margin: "0 auto" }}>

          {/* ── Heading ── */}
          <div className="reveal">
            <AKLogo />
            <p style={{
              fontSize: "11px", fontFamily: "monospace", letterSpacing: "3px",
              textTransform: "uppercase", color: "#5ba898", marginBottom: "8px",
            }}>
              Who I Am
            </p>
            <h2 style={{
              fontSize: "clamp(26px,4vw,42px)", fontWeight: 700,
              fontFamily: "Georgia,serif", letterSpacing: "-0.5px",
              marginBottom: "10px", color: t("#1a1208", "#e4e6eb"), transition: "color 0.6s",
            }}>
              About <span className="grad-text">Me</span>
            </h2>
            <div style={{
              width: "48px", height: "3px", borderRadius: "2px",
              background: "linear-gradient(90deg,#5ba898,#d4935a)", marginBottom: "40px",
            }} />
          </div>

          <div className="about-grid">

            {/* ── Left column ── */}
            <div className="reveal-left">
              <p style={{
                fontSize: "14px", lineHeight: 1.88, marginBottom: "14px",
                color: t("rgba(40,30,10,0.68)", "rgba(228,230,235,0.58)"), transition: "color 0.6s",
              }}>
                {profile?.bio || "I am a dedicated Full Stack Web Developer based in Nepal with a strong foundation in modern web technologies."}
              </p>

              {/* ── Download CV button (dynamic) ── */}
              <CVButton />

              {/* ── Fun facts ── */}
              <p style={{
                fontSize: "11px", fontFamily: "monospace", letterSpacing: "2.5px",
                textTransform: "uppercase", color: "#5ba898",
                margin: "26px 0 12px", display: "flex", alignItems: "center", gap: "8px",
              }}>
                <FaStar style={{ fontSize: "10px" }} /> Fun Facts
              </p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {[
                  { icon: <FaMugHot      style={{ fontSize: "11px" }} />, text: "Coffee-driven"    },
                  { icon: <FaLocationDot style={{ fontSize: "11px" }} />, text: profile?.location || "Nepal" },
                  { icon: <FaGamepad    style={{ fontSize: "11px" }} />, text: "Gamer"            },
                  { icon: <FaPencil     style={{ fontSize: "11px" }} />, text: "UI Perfectionist" },
                  { icon: <FaGithub     style={{ fontSize: "11px" }} />, text: "Open Source"      },
                ].map(({ icon, text }) => (
                  <div
                    key={text}
                    style={{
                      display: "flex", alignItems: "center", gap: "6px",
                      padding: "7px 13px", borderRadius: "20px",
                      fontSize: "12px", fontFamily: "monospace",
                      background: t("rgba(91,168,152,0.1)", "rgba(91,168,152,0.12)"),
                      color: t("#2d6a5e", "#5ba898"),
                      border: `1px solid ${t("rgba(91,168,152,0.2)", "rgba(91,168,152,0.25)")}`,
                    }}
                  >
                    {icon} {text}
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right column ── */}
            <div className="reveal-right" style={{ display: "flex", flexDirection: "column", gap: "36px" }}>

              {/* At a Glance */}
              <div>
                <p style={{
                  fontSize: "11px", fontFamily: "monospace", letterSpacing: "2.5px",
                  textTransform: "uppercase", color: "#5ba898", marginBottom: "14px",
                  display: "flex", alignItems: "center", gap: "8px",
                }}>
                  <FaChartSimple /> At a Glance
                </p>
                <RainbowBorder radius="12px" padding="2px">
                  <div style={{
                    display: "grid", gridTemplateColumns: "repeat(3,1fr)",
                    gap: "1px", borderRadius: "10px", overflow: "hidden",
                  }}>
                    {glance.map(({ n, l }) => (
                      <div
                        key={l}
                        style={{
                          padding: "18px 12px", textAlign: "center",
                          background: t("#fffdf7", "#242526"), transition: "background 0.6s",
                        }}
                      >
                        <div className="grad-text" style={{ fontSize: "26px", fontWeight: 700, fontFamily: "Georgia,serif", lineHeight: 1 }}>{n}</div>
                        <div style={{ fontSize: "10px", fontFamily: "monospace", letterSpacing: "1px", marginTop: "5px", color: t("rgba(40,30,10,0.5)", "rgba(228,230,235,0.4)") }}>{l}</div>
                      </div>
                    ))}
                  </div>
                </RainbowBorder>
              </div>

              {/* Education */}
              <div>
                <p style={{
                  fontSize: "11px", fontFamily: "monospace", letterSpacing: "2.5px",
                  textTransform: "uppercase", color: "#5ba898", marginBottom: "14px",
                  display: "flex", alignItems: "center", gap: "8px",
                }}>
                  <FaGraduationCap /> Education
                </p>
                {education.length === 0
                  ? (
                    <p style={{ fontSize: "12px", fontFamily: "monospace", color: t("rgba(40,30,10,0.4)", "rgba(228,230,235,0.35)") }}>
                      No entries yet.
                    </p>
                  )
                  : education.map(item => (
                    <RainbowBorder key={item._id} radius="12px" padding="2px" style={{ marginBottom: "10px" }}>
                      <div style={{
                        padding: "16px 18px", borderRadius: "10px",
                        display: "flex", alignItems: "flex-start", gap: "14px",
                        background: t("#fffdf7", "#242526"),
                        borderLeft: "3px solid #5ba898", transition: "background 0.6s",
                      }}>
                        <div style={{
                          width: "34px", height: "34px", borderRadius: "8px", flexShrink: 0,
                          background: "rgba(91,168,152,0.12)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "#5ba898", fontSize: "15px",
                        }}>
                          <FaGraduationCap />
                        </div>
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "2px", color: t("#1a1208", "#e4e6eb") }}>{item.degree}</div>
                          <div style={{ fontSize: "12px", marginBottom: "3px", color: t("rgba(40,30,10,0.55)", "rgba(228,230,235,0.45)") }}>
                            {item.institution}{item.location ? ` · ${item.location}` : ""}
                          </div>
                          <div style={{ fontSize: "10px", fontFamily: "monospace", color: "#5ba898" }}>{item.startYear} — {item.endYear}</div>
                          {item.description && (
                            <p style={{ fontSize: "12px", marginTop: "6px", color: t("rgba(40,30,10,0.5)", "rgba(228,230,235,0.45)"), lineHeight: 1.6 }}>
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </RainbowBorder>
                  ))
                }
              </div>

              {/* Experience */}
              <div>
                <p style={{
                  fontSize: "11px", fontFamily: "monospace", letterSpacing: "2.5px",
                  textTransform: "uppercase", color: "#5ba898", marginBottom: "14px",
                  display: "flex", alignItems: "center", gap: "8px",
                }}>
                  <FaBriefcase /> Experience
                </p>
                {experience.length === 0
                  ? (
                    <p style={{ fontSize: "12px", fontFamily: "monospace", color: t("rgba(40,30,10,0.4)", "rgba(228,230,235,0.35)") }}>
                      No entries yet.
                    </p>
                  )
                  : (
                    <div style={{ position: "relative", paddingLeft: "22px" }}>
                      <div style={{
                        position: "absolute", left: "7px", top: "6px", bottom: "6px",
                        width: "1.5px",
                        background: "linear-gradient(180deg,#5ba898,rgba(91,168,152,0.08))",
                      }} />
                      {experience.map(item => (
                        <div key={item._id} style={{ position: "relative", marginBottom: "22px" }}>
                          <div style={{
                            position: "absolute", left: "-19px", top: "4px",
                            width: "11px", height: "11px", borderRadius: "50%",
                            background: "#5ba898",
                            border: `2.5px solid ${t("#f0e8d8", "#18191a")}`,
                          }} />
                          <div style={{
                            display: "flex", alignItems: "center", gap: "8px",
                            marginBottom: "2px", flexWrap: "wrap",
                          }}>
                            <span style={{ fontSize: "13.5px", fontWeight: 600, color: t("#1a1208", "#e4e6eb") }}>
                              {item.title}
                            </span>
                            {item.endDate === "Present" && (
                              <span style={{
                                fontSize: "10px", fontFamily: "monospace",
                                padding: "2px 8px", borderRadius: "10px",
                                background: "rgba(91,168,152,0.12)", color: "#5ba898",
                              }}>
                                Current
                              </span>
                            )}
                          </div>
                          <div style={{
                            fontSize: "11px", fontFamily: "monospace", color: "#5ba898",
                            marginBottom: "5px",
                            display: "flex", alignItems: "center", gap: "5px", flexWrap: "wrap",
                          }}>
                            <FaCalendar style={{ fontSize: "9px" }} />
                            {item.company}{item.location ? ` · ${item.location}` : ""} &nbsp;·&nbsp; {item.startDate} — {item.endDate}
                          </div>
                          {item.description && (
                            <div style={{
                              fontSize: "12.5px", lineHeight: 1.65, marginBottom: "6px",
                              color: t("rgba(40,30,10,0.58)", "rgba(228,230,235,0.48)"),
                            }}>
                              {item.description}
                            </div>
                          )}
                          <span style={{
                            fontSize: "10px", fontFamily: "monospace",
                            padding: "3px 9px", borderRadius: "10px",
                            background: t("rgba(91,168,152,0.1)", "rgba(91,168,152,0.15)"),
                            color: t("#2d6a5e", "#5ba898"),
                          }}>
                            {item.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  )
                }
              </div>

            </div>
          </div>

          <div className="bottom-bar" style={{ marginTop: "60px" }} />
        </div>
      </section>
    </>
  );
}