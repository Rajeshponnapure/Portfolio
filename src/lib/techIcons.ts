/** Resolves a skill/tool label to a real logo URL (devicon or simple-icons CDN).
 *  Returns null when no logo is mapped — the tile then shows a clean monogram.
 *  A 404 on a mapped URL is handled by an onError fallback in the rendering tile. */
const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons';
const SI = 'https://cdn.simpleicons.org';

const DEVICON_MAP: Record<string, string> = {
  Python: 'python/python-original.svg',
  TypeScript: 'typescript/typescript-original.svg',
  JavaScript: 'javascript/javascript-original.svg',
  Dart: 'dart/dart-original.svg',
  'C++': 'cplusplus/cplusplus-original.svg',
  FastAPI: 'fastapi/fastapi-original.svg',
  React: 'react/react-original.svg',
  'Next.js': 'nextjs/nextjs-original.svg',
  'Three.js': 'threejs/threejs-original.svg',
  Flutter: 'flutter/flutter-original.svg',
  Tailwind: 'tailwindcss/tailwindcss-original.svg',
  'Node.js': 'nodejs/nodejs-original.svg',
  NestJS: 'nestjs/nestjs-original.svg',
  Express: 'express/express-original.svg',
  'Socket.io': 'socketio/socketio-original.svg',
  MongoDB: 'mongodb/mongodb-original.svg',
  SQLite: 'sqlite/sqlite-original.svg',
  Blender: 'blender/blender-original.svg',
  Canva: 'canva/canva-original.svg',
  Ollama: 'ollama/ollama-original.svg',
  Docker: 'docker/docker-original.svg',
  SQL: 'azuresqldatabase/azuresqldatabase-original.svg',
};

// simple-icons slugs (brand-coloured, visible on a light tile)
const SIMPLE_MAP: Record<string, string> = {
  'OpenAI Codex': 'openai',
  'Claude Code': 'anthropic',
  'Claude Cowork': 'anthropic',
  Gemini: 'googlegemini',
  Perplexity: 'perplexity',
  Mistral: 'mistralai',
  DeepSeek: 'deepseek',
  'GitHub MCP / Skills': 'github',
  Windsurf: 'windsurf',
  WebRTC: 'webrtc',
  GSAP: 'greensock',
  WebGL: 'webgl',
  MQTT: 'mqtt',
  'Auth / JWT': 'jsonwebtokens',
  Razorpay: 'razorpay',
  Vercel: 'vercel',
  'CI/CD': 'githubactions',
  SEO: 'googlesearchconsole',
};

export function techIcon(label: string): string | null {
  if (DEVICON_MAP[label]) return `${DEVICON}/${DEVICON_MAP[label]}`;
  if (SIMPLE_MAP[label]) return `${SI}/${SIMPLE_MAP[label]}`;
  return null;
}

export function monogram(label: string): string {
  return label
    .replace(/[/.+]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}
