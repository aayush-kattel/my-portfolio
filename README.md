# Aayush Kattel — Portfolio

A modern, animated personal portfolio built with **React + Vite + Tailwind CSS v4**.

## Tech Stack
- **React 18** — UI components
- **Vite 6** — build tool
- **Tailwind CSS v4** — utility-first styling (no config file, uses `@tailwindcss/vite` plugin)
- **Framer Motion** — slide/fade animations on project carousel
- **GSAP** — available for additional animations
- **react-icons v5** — `fa6` + `si` icon sets
- **Canvas API** — animated floating tech keyword background

## Quick Start

```bash
# 1. Install
npm install

# 2. Dev server
npm run dev

# 3. Build
npm run build
```

## Project Structure
```
src/
├── components/
│   ├── AnimatedBackground.jsx  ← canvas floating keywords
│   ├── AKLogo.jsx              ← shared AK badge
│   ├── FloatingNav.jsx         ← ball navbar (fixed)
│   ├── ThemeToggle.jsx         ← sun/moon toggle (fixed)
│   ├── HeroSection.jsx
│   ├── AboutSection.jsx
│   ├── SkillsSection.jsx       ← floating bubbles arena
│   ├── ProjectsSection.jsx     ← single-project carousel
│   └── ContactSection.jsx      ← contact form
├── data/
│   └── constants.js            ← all data (skills, projects, etc.)
├── hooks/
│   ├── useTheme.jsx            ← dark/light context
│   ├── useTyping.jsx           ← typing animation
│   └── useScrollReveal.js      ← intersection observer
├── App.jsx
├── main.jsx
└── index.css                   ← Tailwind v4 + custom keyframes
```

## Customisation
- **Projects** → edit `src/data/constants.js` → `PROJECTS` array
- **Skills** → edit `src/data/constants.js` → `ALL_SKILLS` array
- **Social links** → update hrefs in `HeroSection.jsx` and `ContactSection.jsx`
- **CV link** → update `href` in `AboutSection.jsx` cv-btn anchor
- **Colors** → all brand colors defined in `src/index.css` under `@theme {}`

## Notes
- Tailwind v4: NO `tailwind.config.js` — tokens live in `@theme {}` in `index.css`
- Tailwind v4: NO `postcss.config.js` — uses `@tailwindcss/vite` plugin directly
- Background animation text is **darker in light mode** so it's visible on the cream canvas



