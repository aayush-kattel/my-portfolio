/* ── Tech keyword color categories ── */
export const LC = [
  { color: [91,168,152],  words: ['React','JSX','useState','useEffect','useRef','useContext','useMemo','useCallback','useReducer','React.memo'] },
  { color: [201,106,106], words: ['Node.js','Express','REST API','middleware','router','cors','dotenv','nodemon','helmet','app.listen()'] },
  { color: [212,147,90],  words: ['MongoDB','Mongoose','Schema','model()','find()','aggregate()','populate()','Atlas','pipeline','$match'] },
  { color: [122,170,106], words: ['Tailwind','flex','grid','sm:','md:','lg:','hover:','transition','animate-','@apply'] },
  { color: [138,122,184], words: ['JavaScript','async/await','Promise','fetch()','map()','filter()','ES6+','closure','module','arrow fn'] },
  { color: [122,154,184], words: ['HTML','CSS','Flexbox','Grid','media query','z-index','transform','transition','animation','position'] },
  { color: [192,122,158], words: ['Three.js','GSAP','framer-motion','WebGL','ScrollTrigger','mesh','camera','renderer','timeline','variant'] },
  { color: [100,148,192], words: ['Git','GitHub','npm','Vite','TypeScript','ESLint','Vercel','API','deploy','build'] },
];

export const DC = LC.map((c, i) => ({
  words: c.words,
  color: [
    [100,200,180],[230,120,120],[240,175,100],[140,210,120],
    [160,145,220],[140,175,225],[220,145,190],[110,165,230],
  ][i],
}));

/* ── Typing roles ── */
export const ROLES = [
  'Full Stack Developer',
  'React Specialist',
  'Node.js Developer',
  'MongoDB Expert',
  'UI/UX Enthusiast',
];

/* ── Nav items ── */
export const NAV_ITEMS = [
  { label: 'Home',     section: 'home' },
  { label: 'About',    section: 'about' },
  { label: 'Skills',   section: 'skills' },
  { label: 'Projects', section: 'projects' },
  { label: 'Contact',  section: 'contact' },
];

/* ── Skills bubbles ── */
export const ALL_SKILLS = [
  { name: 'React',      icon: 'FaReact',        size: 64, color: '#5ba898', url: 'https://react.dev' },
  { name: 'HTML',       icon: 'FaHtml5',         size: 56, color: '#5ba898', url: 'https://developer.mozilla.org/docs/Web/HTML' },
  { name: 'CSS',        icon: 'FaCss3Alt',       size: 56, color: '#5ba898', url: 'https://developer.mozilla.org/docs/Web/CSS' },
  { name: 'Tailwind',   icon: 'SiTailwindcss',   size: 52, color: '#5ba898', url: 'https://tailwindcss.com' },
  { name: 'JavaScript', icon: 'FaJs',            size: 60, color: '#5ba898', url: 'https://developer.mozilla.org/docs/Web/JavaScript' },
  { name: 'Node.js',    icon: 'FaNodeJs',        size: 62, color: '#c96a6a', url: 'https://nodejs.org' },
  { name: 'Express',    icon: 'SiExpress',       size: 52, color: '#c96a6a', url: 'https://expressjs.com' },
  { name: 'MongoDB',    icon: 'SiMongodb',       size: 58, color: '#7aaa6a', url: 'https://www.mongodb.com' },
  { name: 'Mongoose',   icon: 'FaDatabase',      size: 50, color: '#7aaa6a', url: 'https://mongoosejs.com' },
  { name: 'Git',        icon: 'FaGitAlt',        size: 56, color: '#8a7ab8', url: 'https://git-scm.com' },
  { name: 'GitHub',     icon: 'FaGithub',        size: 56, color: '#8a7ab8', url: 'https://github.com' },
  { name: 'Vite',       icon: 'SiVite',          size: 50, color: '#8a7ab8', url: 'https://vitejs.dev' },
  { name: 'TypeScript', icon: 'SiTypescript',    size: 50, color: '#8a7ab8', url: 'https://www.typescriptlang.org' },
  { name: 'Vercel',     icon: 'SiVercel',        size: 48, color: '#8a7ab8', url: 'https://vercel.com' },
  { name: 'Three.js',   icon: 'SiThreedotjs',   size: 56, color: '#d4935a', url: 'https://threejs.org' },
  { name: 'GSAP',       icon: 'SiGreensock',     size: 52, color: '#d4935a', url: 'https://gsap.com' },
  { name: 'Framer',     icon: 'SiFramer',        size: 50, color: '#d4935a', url: 'https://www.framer.com/motion' },
];

/* ── Projects ── */
export const PROJECTS = [
  {
    title: 'E-Commerce Platform',
    category: 'Web App',
    desc: 'Full-stack shopping app with cart, authentication, payments and admin dashboard built end-to-end on the MERN stack.',
    thumb: 'thumb-1',
    stack: ['React','Node.js','MongoDB','Express','Tailwind'],
    preview: '#',
    code: '#',
  },
  {
    title: 'Portfolio Website',
    category: 'Portfolio',
    desc: 'Personal portfolio with animated floating background, ball navbar, typing animation and smooth section transitions.',
    thumb: 'thumb-2',
    stack: ['React','Tailwind','GSAP','Framer Motion','Vite'],
    preview: 'https://ak-connect.vercel.app/',
    code: '#',
  },
  {
    title: 'Real-time Chat App',
    category: 'Web App',
    desc: 'Live messaging with Socket.io, room-based chat, online indicators and message history in MongoDB.',
    thumb: 'thumb-3',
    stack: ['React','Socket.io','Node.js','MongoDB'],
    preview: '#',
    code: '#',
  },
  {
    title: 'Admin Dashboard',
    category: 'Dashboard',
    desc: 'Analytics dashboard with charts, user management, role-based access control, dark mode and real-time data.',
    thumb: 'thumb-4',
    stack: ['React','Tailwind','Express','MongoDB','TypeScript'],
    preview: '#',
    code: '#',
  },
  {
    title: 'AI Blog Generator',
    category: 'AI Tool',
    desc: 'SEO-optimised blog content via AI APIs with a rich text editor, categories and publish workflow.',
    thumb: 'thumb-5',
    stack: ['React','Node.js','OpenAI','MongoDB'],
    preview: '#',
    code: '#',
  },
  {
    title: 'Travel Blog Platform',
    category: 'Blog',
    desc: 'Full-featured blog with markdown editor, image uploads, comment system and Vercel deployment.',
    thumb: 'thumb-6',
    stack: ['React','Tailwind','MongoDB','Node.js','Vercel'],
    preview: '#',
    code: '#',
  },
];
