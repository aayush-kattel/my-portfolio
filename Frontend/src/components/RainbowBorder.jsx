// components/RainbowBorder.jsx
// Exact same sliding rainbow border as AdminLogin
// For "outer outline" usage: wrap your content, set padding="2px" (default)
// For "inner card" usage (About stats/education): same, just smaller radius

export default function RainbowBorder({ children, radius = "20px", padding = "2px", style = {} }) {
  return (
    <div style={{ position: "relative", borderRadius: radius, ...style }}>
      {/* The animated gradient IS the border — sits behind content */}
      <div style={{
        position: "absolute",
        inset: 0,
        borderRadius: radius,
        background: "linear-gradient(90deg,transparent,#5ba898,#d4935a,#c96a6a,#7aaa6a,#8a7ab8,#5ba898,transparent)",
        backgroundSize: "200% 100%",
        animation: "rbSlide 3s linear infinite",
      }} />
      {/* Content — inset by padding to reveal the gradient as a border */}
      <div style={{
        position: "relative",
        zIndex: 1,
        margin: padding,
        borderRadius: `calc(${radius} - ${padding})`,
      }}>
        {children}
      </div>
      <style>{`
        @keyframes rbSlide {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}