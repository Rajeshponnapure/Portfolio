import { Lock } from '../components/Lock';
import { SEO } from '../components/SEO';
import { ErrorBoundary } from '../components/ErrorBoundary';

function HomePage() {
  return (
    <ErrorBoundary>
      <>
        <SEO
          title="Gnana Rajeswara Reddy — AI Engineer & Builder"
          description="Full-stack AI builder specializing in agentic systems, realtime platforms, IoT telemetry, and automation pipelines. Production-grade engineering with React, Node, Python, and LLMs."
          path="/"
        />
        <Lock />
      </>
    </ErrorBoundary>
  );
}

export default HomePage;