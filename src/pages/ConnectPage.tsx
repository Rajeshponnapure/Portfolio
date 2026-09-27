import { Connect } from '../sections/Connect';
import { SEO } from '../components/SEO';
import { ErrorBoundary } from '../components/ErrorBoundary';

function ConnectPage() {
  return (
    <ErrorBoundary>
      <>
        <SEO
          title="Connect — Get in Touch"
          description="Let's connect. Email, GitHub, LinkedIn, Instagram — each tab opens the real profile. No fake metrics, just direct links."
          path="/connect"
        />
        <Connect />
      </>
    </ErrorBoundary>
  );
}

export default ConnectPage;