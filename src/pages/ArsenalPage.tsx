import { Arsenal } from '../sections/Arsenal';
import { SEO } from '../components/SEO';
import { ErrorBoundary } from '../components/ErrorBoundary';

function ArsenalPage() {
  return (
    <ErrorBoundary>
      <>
        <SEO
          title="Arsenal — Tools & Technologies"
          description="The tools I build with: agentic coding tools (Claude Code, OpenAI Codex), models (Gemini, DeepSeek), runtime (LM Studio, Ollama), languages (Python, TypeScript, Dart), frontend (React, Three.js, GSAP), backend (Node.js, NestJS, WebRTC), and creative tools."
          path="/arsenal"
        />
        <Arsenal />
      </>
    </ErrorBoundary>
  );
}

export default ArsenalPage;