import { useTheme } from "../hooks/useTheme";
import LogoImage from "../assets/logo.png"; // 👈 Path to your image

export default function AKLogo() {
  const { isDark } = useTheme();

  return (
    <div className="inline-flex items-center gap-[10px] mb-[22px]">
      {/* Circle with spinning ring */}
      <div
        className="relative w-12 h-12 rounded-full border-2 border-[#5ba898] flex items-center justify-center flex-shrink-0"
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        {/* Spinning ring */}
        <div className="absolute inset-[-4px] rounded-full border-[1.5px] border-dashed border-[rgba(91,168,152,0.4)] animate-spin-slow" />
        
        {/* Logo Image */}
        <img
          src={LogoImage}
          alt="AK Logo"
          className="w-8 h-8 rounded-full object-cover"
        />
      </div>

      {/* Label */}
      <div className="flex flex-col">
        <span
          className="text-[13px] font-semibold"
          style={{
            fontFamily: "Georgia,serif",
            color: isDark ? "#e4e6eb" : "#1a1208",
            transition: "color 0.6s",
          }}
        >
          Aayush Kattel
        </span>
        <span className="text-[10px] font-mono tracking-[2px] uppercase text-[#5ba898]">
          Full Stack Developer
        </span>
      </div>
    </div>
  );
}