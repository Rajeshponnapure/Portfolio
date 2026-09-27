/**
 * Narrative + identity content for the RAJESH OS portfolio.
 * Project records live in ./projects.ts — this file holds everything else:
 * profile copy, the category system that drives the themed project visuals,
 * the AI/tool arsenal, the journey log and the "connect" channels.
 */

export const PROFILE = {
  fullName: 'P. Gnana Rajeswara Reddy',
  display: ['GNANA', 'RAJESWARA', 'REDDY'],
  short: 'Rajesh',
  handle: 'rajesh.os',
  roles: [
    'Full-stack AI builder',
    'Agentic systems engineer',
    'Machine-learning explorer',
    'IoT & automation maker',
    'Story-driven creator',
  ],
  // one-line "what I do", shown reflected on the water surface under the name
  tagline: 'I build intelligent systems — and tell their story.',
  lockHint: 'Move across the portrait to x-ray the mask · press Enter to log in',
  bio: [
    'I build intelligent systems at the edge of product, code and automation — from local-first AI assistants and multi-agent command surfaces to realtime communication, smart-city telemetry and production-grade full-stack platforms.',
    'Before the code, there was a story. I spent years writing and posting fiction in my native language — that instinct for narrative is now wired into how I design products and interfaces.',
  ],
  // contact details
  phone: '+91-9381265797',
  email: 'gnanarajeswarareddy1607@gmail.com',
  location: 'Jammalamadugu, AndhraPradesh, India',
  // non-technical / human side
  facets: [
    { k: 'Story writer', v: 'Years of original fiction posted in my native language' },
    { k: '3D via code', v: 'Blender scenes built programmatically, not by hand' },
    { k: 'Design', v: 'Posters, decks & carousels in Canva' },
    { k: 'Video', v: 'Editing cuts for YouTube' },
    { k: 'Endurance', v: "Once a task grabs me, I don't sleep until it ships" },
  ],
} as const;

/** Category system — each project category renders its own animated visual + accent. */
export interface CategoryMeta {
  id: string;
  label: string;
  /** base hue for the accent gradient */
  hue: number;
  /** which animated motif to render in the project card / window */
  visual: 'agents' | 'automation' | 'iot' | 'realtime' | 'fullstack';
  blurb: string;
}

export const CATEGORIES: Record<string, CategoryMeta> = {
  ai: { id: 'ai', label: 'AI · Agents', hue: 268, visual: 'agents', blurb: 'Local-first LLMs, multi-agent orchestration & knowledge graphs.' },
  auto: { id: 'auto', label: 'Automation', hue: 158, visual: 'automation', blurb: 'Autonomous pipelines that read, reason and publish on their own.' },
  iot: { id: 'iot', label: 'IoT · Smart City', hue: 28, visual: 'iot', blurb: 'Sensor telemetry, congestion scoring and edge dashboards.' },
  rt: { id: 'rt', label: 'Realtime', hue: 200, visual: 'realtime', blurb: 'WebRTC, sockets and disguised secure-messaging systems.' },
  full: { id: 'full', label: 'Full-Stack', hue: 330, visual: 'fullstack', blurb: 'Production platforms with auth, payments, CRMs and APIs.' },
};

export const CATEGORY_ORDER = ['ai', 'auto', 'iot', 'rt', 'full'] as const;

/** AI / tooling arsenal — the cockpit Rajesh actually works from. */
export const ARSENAL = [
  {
    title: 'Agentic coding',
    items: ['Claude Code', 'Claude Cowork', 'OpenAI Codex', 'Windsurf', 'Antigravity'],
  },
  {
    title: 'Models',
    items: ['Gemini', 'DeepSeek', 'Qwen Coder', 'MiniMax', 'Mistral', 'Flash'],
  },
  {
    title: 'Runtime & research',
    items: ['LM Studio', 'Perplexity', 'GitHub MCP / Skills', 'Ollama'],
  },
] as const;

export const SKILL_GROUPS = [
  { title: 'Languages', items: ['Python', 'TypeScript', 'JavaScript', 'Dart', 'SQL', 'C++'] },
  { title: 'AI / ML', items: ['LLMs', 'RAG', 'Agents', 'FastAPI', 'Computer Vision', 'Knowledge Graphs'] },
  { title: 'Frontend', items: ['React', 'Next.js', 'Three.js', 'WebGL', 'GSAP', 'Flutter', 'Tailwind'] },
  { title: 'Backend', items: ['Node.js', 'NestJS', 'Express', 'Socket.io', 'WebRTC', 'MongoDB', 'SQLite'] },
  { title: 'IoT / Edge', items: ['Edge Devices', 'Telemetry', 'MQTT', 'Local-First', 'Realtime Streams'] },
  { title: 'Creative', items: ['Blender', 'Canva', 'Video Editing', 'Story Writing'] },
] as const;

export interface JourneyEntry {
  tag: string;
  title: string;
  desc: string;
}

export const JOURNEY: JourneyEntry[] = [
  {
    tag: 'LOG 01 · Foundations',
    title: 'Full-stack intern',
    desc: 'Joined a company as a full-stack developer intern and shipped two systems: a backend for an NGO trust — designing the API routes, authentication and data layer — and a services website covering web development, CRM and client delivery.',
  },
  {
    tag: 'LOG 02 · Realtime',
    title: 'Communication & security',
    desc: 'Built realtime messaging with WebRTC audio/video, file sharing and presence, plus a Sudoku game that secretly disguises identity-based secure messaging with biometrics.',
  },
  {
    tag: 'LOG 03 · IoT',
    title: 'Smart-city telemetry',
    desc: 'Designed traffic-monitoring dashboards with congestion scoring, citizen reports and incident workflows — sensors to cloud.',
  },
  {
    tag: 'LOG 04 · AI',
    title: 'Agents & automation',
    desc: 'Built local-first agent runtimes, multi-agent command surfaces, a knowledge-graph engine, AI usage analytics and autonomous content pipelines.',
  },
  {
    tag: 'LOG 05 · Now',
    title: 'Production-intent platforms',
    desc: 'Consulting platforms with client portals, admin CRMs, NestJS APIs and post-purchase support — engineering at production scale.',
  },
];

export interface Channel {
  id: string;
  label: string;
  /** browser-style domain shown in the address bar */
  domain: string;
  href: string;
  icon: 'gmail' | 'github' | 'linkedin' | 'instagram' | 'x';
  blurb: string;
  /** true while the real handle is still a placeholder */
  pending?: boolean;
}

export const CHANNELS: Channel[] = [
  {
    id: 'gmail',
    label: 'Email',
    domain: 'mail.google.com',
    href: 'mailto:gnanarajeswarareddy1607@gmail.com',
    icon: 'gmail',
    blurb: 'gnanarajeswarareddy1607@gmail.com',
  },
  {
    id: 'github',
    label: 'GitHub',
    domain: 'github.com/Rajeshponnapure',
    href: 'https://github.com/Rajeshponnapure',
    icon: 'github',
    blurb: '@Rajeshponnapure · code, agents & experiments',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    domain: 'linkedin.com/in/gnanarajeswarareddy',
    href: 'https://www.linkedin.com/in/gnanarajeswarareddy/',
    icon: 'linkedin',
    blurb: 'Gnana Rajeswara Reddy · work & network',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    domain: 'instagram.com/_rajeshponnapureddy_',
    href: 'https://www.instagram.com/_rajeshponnapureddy_',
    icon: 'instagram',
    blurb: '@_rajeshponnapureddy_ · stories & the creator side',
  },
];

export const FAQS = [
  {
    q: 'What kind of products does Rajesh build?',
    a: 'AI agents, full-stack platforms, realtime systems, IoT dashboards and automation pipelines — with implementation-grade architecture, not just concepts.',
  },
  {
    q: 'Is this only concept design?',
    a: 'No. The portfolio includes shipped code, working prototypes and production-intent platforms with documented architecture.',
  },
  {
    q: 'Where is the strongest focus?',
    a: 'Local-first AI, agent orchestration, React/Node product systems, realtime communication and smart-city telemetry.',
  },
];

/** Dock / navigation apps. */
export const DOCK = [
  { id: 'home', label: 'Home', glyph: '⌂' },
  { id: 'projects', label: 'Projects', glyph: '◳' },
  { id: 'arsenal', label: 'Arsenal', glyph: '⌘' },
  { id: 'journey', label: 'Journey', glyph: '◷' },
  { id: 'connect', label: 'Connect', glyph: '◎' },
] as const;
