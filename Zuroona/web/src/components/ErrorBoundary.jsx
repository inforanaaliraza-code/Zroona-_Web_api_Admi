'use client';

/**
 * Error Boundary Component
 * Catches and displays React component errors gracefully
 */

import React from 'react';
import errorHandler from '@/lib/errorHandler';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      errorId: null,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const errorId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    this.setState({
      errorId,
      error,
      errorInfo,
    });

    // Log to error handler
    errorHandler.log(error, {
      boundary: 'ErrorBoundary',
      component: this.props.name || 'Unknown',
      stack: errorInfo.componentStack,
    });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      errorId: null,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      const isDev = process.env.NODE_ENV === 'development';

      return (
        <div className="error-boundary-container">
          <div className="error-boundary-card">
            <div className="error-boundary-icon">⚠️</div>
            <h2 className="error-boundary-title">Oops! Something went wrong</h2>
            <p className="error-boundary-message">
              An unexpected error occurred. We&apos;re sorry for the inconvenience.
            </p>

            {isDev && (
              <div className="error-boundary-details">
                <details>
                  <summary>Error Details (Development Only)</summary>
                  <div className="error-boundary-error-id">
                    Error ID: <code>{this.state.errorId}</code>
                  </div>
                  {this.state.error && (
                    <div className="error-boundary-error-message">
                      <strong>Error:</strong>
                      <pre>
                        {typeof this.state.error.toString === 'function'
                          ? this.state.error.toString()
                          : String(this.state.error)}
                      </pre>
                    </div>
                  )}
                  {this.state.errorInfo && (
                    <div className="error-boundary-stack">
                      <strong>Stack Trace:</strong>
                      <pre>
                        {typeof this.state.errorInfo.componentStack === 'string'
                          ? this.state.errorInfo.componentStack
                          : ''}
                      </pre>
                    </div>
                  )}
                </details>
              </div>
            )}

            {!isDev && (
              <p className="error-boundary-error-id">
                Error Code: <code>{this.state.errorId}</code>
              </p>
            )}

            <div className="error-boundary-actions">
              <button className="error-boundary-btn retry" onClick={this.handleRetry}>
                Try Again
              </button>
              <button
                className="error-boundary-btn reload"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
