import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { hasError: boolean; error?: unknown };

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: unknown, errorInfo: ErrorInfo) {
    console.error('App error boundary caught an error:', error, errorInfo);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Check the console for details. Reloading the page may help.
        </p>
        {import.meta.env.MODE === 'development' ? (
          <pre className="mt-4 whitespace-pre-wrap rounded-md bg-muted p-4 text-xs overflow-auto">
            {String(this.state.error)}
          </pre>
        ) : null}
      </div>
    );
  }
}

