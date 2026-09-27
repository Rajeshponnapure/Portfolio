import { About } from '../sections/About';
import { SEO } from '../components/SEO';
import { ErrorBoundary } from '../components/ErrorBoundary';

function AboutPage() {
  return (
    <ErrorBoundary>
      <>
        <SEO
          title="About — Gnana Rajeswara Reddy"
          description="Story writer turned systems builder. Building intelligent systems at the edge of product, code, and automation — from local-first AI assistants to smart-city telemetry."
          path="/about"
        />
        <About />
      </>
    </ErrorBoundary>
  );
}

export default AboutPage;