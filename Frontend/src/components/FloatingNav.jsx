import { useState, useEffect, useRef, useCallback } from "react";
import {
  FaHouse, FaUser, FaCode, FaLayerGroup, FaEnvelope,
} from "react-icons/fa6";
import { useTheme } from "../hooks/useTheme";

const NAV_ITEMS = [
  { label: "Home",     id: "home",     Icon: FaHouse },
  { label: "About",    id: "about",    Icon: FaUser },
  { label: "Skills",   id: "skills",   Icon: FaCode },
  { label: "Projects", id: "projects", Icon: FaLayerGroup },
  { label: "Contact",  id: "contact",  Icon: FaEnvelope },
];

const SECTIONS = NAV_ITEMS.map((n) => n.id);

function getBreakpoint(w) {
  if (w >= 1024) return { itemW: 80, navH: 76, ballSize: 74, iconSize: 26, labelSz: 11, borderW: 6 };
  if (w >= 768)  return { itemW: 72, navH: 70, ballSize: 66, iconSize: 23, labelSz: 10, borderW: 5 };
  if (w >= 430)  return { itemW: 62, navH: 64, ballSize: 58, iconSize: 20, labelSz: 9,  borderW: 5 };
  if (w >= 375)  return { itemW: 54, navH: 58, ballSize: 50, iconSize: 17, labelSz: 8,  borderW: 4 };
  return          { itemW: 46, navH: 52, ballSize: 44, iconSize: 14, labelSz: 7,  borderW: 4 };
}

export default function FloatingNav() {
  const { isDark } = useTheme();
  const [activeIdx, setActiveIdx] = useState(0);
  const [bp, setBp] = useState(() => getBreakpoint(window.innerWidth));
  const indicatorRef = useRef(null);

  const ballHalf  = Math.round(bp.ballSize / 2);
  const iconLift  = -(ballHalf + 4);
  const navTop    = ballHalf;
  const ballTop   = -ballHalf;
  const ballLeft  = Math.round((bp.itemW - bp.ballSize) / 2);
  const curveW    = Math.round(bp.ballSize * 0.30);
  const csx       = Math.round(curveW * 0.15);
  const csy       = -Math.round(curveW * 0.55);
  const navBg     = isDark ? "#242526" : "#fffdf7";
  const borderClr = isDark ? "#18191a" : "#f0e8d8";

  // Total nav width — used to guard against overflow on very small screens
  const totalNavW = bp.itemW * NAV_ITEMS.length + 4; // +4 for padding

  useEffect(() => {
    const onResize = () => setBp(getBreakpoint(window.innerWidth));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY + window.innerHeight / 3;
      let active = 0;
      SECTIONS.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) active = i;
      });
      setActiveIdx(active);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (indicatorRef.current) {
      indicatorRef.current.style.transform = `translateX(${activeIdx * bp.itemW}px)`;
    }
  }, [activeIdx, bp.itemW]);

  const handleClick = useCallback((e, id, idx) => {
    e.preventDefault();
    setActiveIdx(idx);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const cshl = `${csx}px ${csy}px 0 0 ${navBg}`;
  const cshr = `-${csx}px ${csy}px 0 0 ${navBg}`;

  return (
    <div
      style={{
        position: "fixed",
        top: navTop + "px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        // Ensure nav never overflows viewport edges
        maxWidth: `min(${totalNavW}px, calc(100vw - 16px))`,
        width: "max-content",
      }}
    >
      <div
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          borderRadius: "14px",
          overflow: "visible",
          padding: "0 2px",
          height: bp.navH + "px",
          background: navBg,
          boxShadow: isDark
            ? "0 4px 24px rgba(0,0,0,0.45)"
            : "0 4px 24px rgba(26,18,8,0.12),0 1px 4px rgba(26,18,8,0.06)",
          transition: "background 0.6s, box-shadow 0.6s",
        }}
      >
        <ul style={{ display: "flex", listStyle: "none", position: "relative", padding: 0, margin: 0, alignItems: "center" }}>
          {NAV_ITEMS.map(({ label, id, Icon }, idx) => {
            const isActive = activeIdx === idx;
            return (
              <li
                key={id}
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  zIndex: 2,
                  flexShrink: 0,
                  width: bp.itemW + "px",
                  height: bp.navH + "px",
                }}
              >
                <a
                  href={`#${id}`}
                  onClick={(e) => handleClick(e, id, idx)}
                  style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", textDecoration: "none" }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: bp.iconSize + "px",
                      color: isActive ? "#ffffff" : isDark ? "#b0b3b8" : "#5a4a35",
                      transform: isActive ? `translateY(${iconLift}px)` : "translateY(0)",
                      transition: "transform 0.45s cubic-bezier(.34,1.56,.64,1), color 0.3s",
                      zIndex: 3,
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    <Icon />
                  </span>
                  <span
                    style={{
                      position: "absolute",
                      bottom: "4px",
                      fontWeight: 500,
                      fontFamily: "system-ui,sans-serif",
                      letterSpacing: "0.03em",
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? "translateY(0)" : "translateY(4px)",
                      transition: "opacity 0.4s, transform 0.4s",
                      whiteSpace: "nowrap",
                      zIndex: 3,
                      pointerEvents: "none",
                      width: "100%",
                      textAlign: "center",
                      fontSize: bp.labelSz + "px",
                      color: isDark ? "#b0b3b8" : "#3a2e1a",
                    }}
                  >
                    {label}
                  </span>
                </a>
              </li>
            );
          })}

          {/* Ball indicator */}
          <div
            ref={indicatorRef}
            style={{
              position: "absolute",
              borderRadius: "50%",
              zIndex: 1,
              pointerEvents: "none",
              background: "#5ba898",
              width: bp.ballSize + "px",
              height: bp.ballSize + "px",
              top: ballTop + "px",
              left: ballLeft + "px",
              borderWidth: bp.borderW + "px",
              borderStyle: "solid",
              borderColor: borderClr,
              boxShadow: "0 6px 20px rgba(91,168,152,0.4)",
              transition: "transform 0.45s cubic-bezier(.34,1.56,.64,1), border-color 0.6s",
            }}
          >
            <span style={{
              content: "", position: "absolute", top: "50%",
              left: -curveW + "px", width: curveW + "px", height: curveW + "px",
              background: "transparent", borderTopRightRadius: curveW + "px",
              boxShadow: cshl, transition: "box-shadow 0.6s",
            }} />
            <span style={{
              content: "", position: "absolute", top: "50%",
              right: -curveW + "px", width: curveW + "px", height: curveW + "px",
              background: "transparent", borderTopLeftRadius: curveW + "px",
              boxShadow: cshr, transition: "box-shadow 0.6s",
            }} />
          </div>
        </ul>
      </div>
    </div>
  );
}