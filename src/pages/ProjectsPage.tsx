import { Projects } from '../sections/Projects';
import { SEO } from '../components/SEO';
import { ErrorBoundary } from '../components/ErrorBoundary';

function ProjectsPage() {
  return (
    <ErrorBoundary>
      <>
        <SEO
          title="Projects — Gnana Rajeswara Reddy"
          description="Selected systems from the build log: AI agents, automation pipelines, realtime communication, IoT dashboards, and production-grade full-stack platforms."
          path="/projects"
        />
        <Projects />
      </>
    </ErrorBoundary>
  );
}

export default ProjectsPage;