import { useEffect, useRef } from "react";
import { useTheme } from "../hooks/useTheme";

/* Light mode — DARKER colors so visible on cream #f0e8d8 */
const LC = [
  { color: [34,120,100],  words: ['React','JSX','useState','useEffect','useRef','useMemo','useCallback'] },
  { color: [160,55,55],   words: ['Node.js','Express','REST API','middleware','router','cors','dotenv'] },
  { color: [160,95,30],   words: ['MongoDB','Mongoose','Schema','aggregate()','populate()','Atlas'] },
  { color: [60,120,50],   words: ['Tailwind','flex','grid','sm:','hover:','transition','animate-'] },
  { color: [85,70,160],   words: ['JavaScript','async/await','Promise','fetch()','ES6+','closure'] },
  { color: [50,90,160],   words: ['HTML','CSS','Flexbox','Grid','media query','z-index'] },
  { color: [140,55,110],  words: ['Three.js','GSAP','framer-motion','WebGL','ScrollTrigger'] },
  { color: [40,100,160],  words: ['Git','GitHub','npm','Vite','TypeScript','Vercel'] },
];

/* Dark mode — lighter/brighter colors */
const DC = [
  { color: [100,200,180], words: LC[0].words },
  { color: [230,120,120], words: LC[1].words },
  { color: [240,175,100], words: LC[2].words },
  { color: [140,210,120], words: LC[3].words },
  { color: [160,145,220], words: LC[4].words },
  { color: [140,175,225], words: LC[5].words },
  { color: [220,145,190], words: LC[6].words },
  { color: [110,165,230], words: LC[7].words },
];

function lerpC(a, b, t) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

export default function AnimatedBackground({ sectionRef }) {
  const canvasRef = useRef(null);
  const { isDark } = useTheme();
  const isDarkRef = useRef(isDark);

  useEffect(() => {
    isDarkRef.current = isDark;
  }, [isDark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let rafId;

    function resize() {
      const sec = sectionRef?.current || canvas.parentElement;
      canvas.width  = sec ? sec.offsetWidth  : window.innerWidth;
      canvas.height = sec ? sec.offsetHeight : window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.width;
    const H = () => canvas.height;

    function getAllTokens() {
      const cats = isDarkRef.current ? DC : LC;
      const arr = [];
      cats.forEach((c) => c.words.forEach((w) => arr.push({ text: w, rgb: [...c.color] })));
      return arr;
    }

    let allTokens = getAllTokens();

    function spawn(sc) {
      allTokens = getAllTokens();
      const src = allTokens[Math.floor(Math.random() * allTokens.length)];
      let x, y, vx, vy;
      const spd = 0.17 + Math.random() * 0.15;
      if (sc) {
        x = Math.random() * W(); y = Math.random() * H();
        vx = (Math.random() - 0.5) * 0.18; vy = -0.1 - Math.random() * 0.12;
      } else {
        const e = Math.floor(Math.random() * 4);
        if      (e === 0) { x = Math.random() * W(); y = H() + 20; vx = (Math.random() - 0.5) * 0.11; vy = -spd; }
        else if (e === 1) { x = -40; y = Math.random() * H(); vx = spd; vy = (Math.random() - 0.5) * 0.09; }
        else if (e === 2) { x = W() + 40; y = Math.random() * H(); vx = -spd; vy = (Math.random() - 0.5) * 0.09; }
        else              { x = Math.random() * W(); y = -20; vx = (Math.random() - 0.5) * 0.11; vy = spd; }
      }
      return {
        text: src.text, rgb: [...src.rgb], targetRgb: [...src.rgb],
        x, y, vx, vy,
        size: 10 + Math.floor(Math.random() * 4),
        alpha: sc ? Math.random() * 0.08 : 0,
        targetAlpha: isDarkRef.current ? 0.22 + Math.random() * 0.14 : 0.55 + Math.random() * 0.25,
        fadeSpeed: 0.003 + Math.random() * 0.003,
        life: 0, maxLife: 300 + Math.random() * 300,
        rotation: (Math.random() - 0.5) * 0.2,
        rotSpeed: (Math.random() - 0.5) * 0.0006,
        delay: sc ? Math.random() * 60 : 30 + Math.random() * 130,
      };
    }

    const COUNT = 36;
    const tokens = Array.from({ length: COUNT }, () => spawn(true));

    const particles = [];
    function initParticles() {
      particles.length = 0;
      const cats = isDarkRef.current ? DC : LC;
      for (let i = 0; i < 32; i++) {
        const c = cats[Math.floor(Math.random() * cats.length)];
        particles.push({
          x: Math.random() * W(), y: Math.random() * H(),
          r: 0.6 + Math.random() * 0.8,
          vx: (Math.random() - 0.5) * 0.09, vy: -0.06 - Math.random() * 0.08,
          alpha: isDarkRef.current ? 0.07 + Math.random() * 0.09 : 0.18 + Math.random() * 0.15,
          rgb: [...c.color],
        });
      }
    }
    initParticles();

    /* re-init on theme change */
    const observer = new MutationObserver(() => {
      initParticles();
      tokens.forEach((t) => {
        allTokens = getAllTokens();
        const s = allTokens[Math.floor(Math.random() * allTokens.length)];
        t.targetRgb = [...s.rgb];
        t.targetAlpha = isDarkRef.current ? 0.22 + Math.random() * 0.14 : 0.55 + Math.random() * 0.25;
      });
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["style"] });

    function draw() {
      ctx.clearRect(0, 0, W(), H());

      /* particles + connecting lines */
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.y < -4)  { p.y = H() + 4; p.x = Math.random() * W(); }
        if (p.x < 0)   p.x = W();
        if (p.x > W()) p.x = 0;

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 65) {
            const lineAlpha = isDarkRef.current ? (1 - d / 65) * 0.04 : (1 - d / 65) * 0.12;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${p.rgb[0]},${p.rgb[1]},${p.rgb[2]},${lineAlpha.toFixed(3)})`;
            ctx.lineWidth = 0.35;
            ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.rgb[0]},${p.rgb[1]},${p.rgb[2]},${p.alpha})`;
        ctx.fill();
      }

      /* floating text tokens */
      for (let i = 0; i < COUNT; i++) {
        const t = tokens[i];
        if (t.delay > 0) { t.delay--; continue; }
        t.life++; t.x += t.vx; t.y += t.vy; t.rotation += t.rotSpeed;
        t.rgb = lerpC(t.rgb, t.targetRgb, 0.04);
        const lr = t.life / t.maxLife;
        if (lr < 0.14) t.alpha = Math.min(t.targetAlpha, t.alpha + t.fadeSpeed);
        else if (lr > 0.76) t.alpha = Math.max(0, t.alpha - t.fadeSpeed * 1.1);
        if (t.life >= t.maxLife || (t.alpha <= 0.001 && t.life > 80)) {
          tokens[i] = spawn(false);
          continue;
        }
        ctx.save();
        ctx.translate(t.x, t.y);
        ctx.rotate(t.rotation);
        ctx.globalAlpha = t.alpha;
        ctx.font = `600 ${t.size}px monospace`;
        ctx.fillStyle = `rgb(${t.rgb[0]},${t.rgb[1]},${t.rgb[2]})`;
        ctx.fillText(t.text, 0, 0);
        ctx.restore();
      }

      rafId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="section-canvas"
    />
  );
}
