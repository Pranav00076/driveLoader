import React, { Component, type ReactNode } from 'react';

export interface DriveErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface DriveErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * DriveErrorBoundary - React Error Boundary component to handle DriveLoader resolution and component errors gracefully.
 */
export class DriveErrorBoundary extends Component<
  DriveErrorBoundaryProps,
  DriveErrorBoundaryState
> {
  public override state: DriveErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): DriveErrorBoundaryState {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  public reset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  public override render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback(this.state.error, this.reset);
      }

      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          style={{
            padding: '1rem',
            borderRadius: '8px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            fontFamily: 'system-ui, sans-serif',
            fontSize: '0.875rem',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>DriveLoader Error</div>
          <div>{this.state.error.message}</div>
          <button
            type="button"
            onClick={this.reset}
            style={{
              marginTop: '0.5rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '4px',
              background: '#ef4444',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
