import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          color: 'var(--soft)',
          fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div>
            <h2 style={{ color: 'var(--ember)', marginBottom: '1rem' }}>Something went wrong</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(100deg, var(--amber), var(--ember))',
                color: '#06070b',
                border: 'none',
                borderRadius: '999px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}