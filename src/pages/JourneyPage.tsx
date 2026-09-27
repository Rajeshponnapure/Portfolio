import { Journey } from '../sections/Journey';
import { SEO } from '../components/SEO';
import { ErrorBoundary } from '../components/ErrorBoundary';

function JourneyPage() {
  return (
    <ErrorBoundary>
      <>
        <SEO
          title="Journey — Career Log"
          description="From story writer to production-grade AI systems engineer. Career log: full-stack foundations, realtime communication, IoT smart-city telemetry, AI agents & automation, production-intent platforms."
          path="/journey"
        />
        <Journey />
      </>
    </ErrorBoundary>
  );
}

export default JourneyPage;