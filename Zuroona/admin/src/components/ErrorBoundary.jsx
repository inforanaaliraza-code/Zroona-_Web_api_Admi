'use client';

/**
 * ERROR BOUNDARY COMPONENT
 * Catches React component errors and displays fallback UI
 */

import { Component } from 'react';
import { errorHandler } from '@/lib/errorHandler';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const errorId = `ERROR_${Date.now()}`;
    
    // Log to error handler
    errorHandler.log(error, {
      step: 'ERROR_BOUNDARY',
      componentStack: errorInfo.componentStack,
      errorId,
    });

    this.setState({
      error,
      errorInfo,
      errorId,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 border-2 border-red-200">
            {/* Error Icon */}
            <div className="text-center mb-4">
              <div className="text-5xl mb-2">⚠️</div>
              <h1 className="text-2xl font-bold text-gray-900">Oops! Something went wrong</h1>
            </div>

            {/* Error Details - always coerce to string to avoid "Objects are not valid as a React child" */}
            <div className="bg-red-50 rounded-lg p-4 mb-4 border border-red-200">
              <p className="text-sm text-gray-700 font-mono break-words">
                {typeof this.state.error?.message === 'string'
                  ? this.state.error.message
                  : (this.state.error && typeof this.state.error.toString === 'function'
                    ? this.state.error.toString()
                    : 'Unknown error')}
              </p>
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-3 text-xs text-gray-600">
                  <summary className="cursor-pointer font-semibold hover:text-gray-900">
                    Developer Details
                  </summary>
                  <pre className="mt-2 overflow-auto bg-white p-2 rounded border border-red-200">
                    {typeof this.state.errorInfo?.componentStack === 'string'
                      ? this.state.errorInfo.componentStack
                      : ''}
                  </pre>
                </details>
              )}
            </div>

            {/* Error ID for support */}
            <div className="bg-gray-50 rounded p-3 mb-4">
              <p className="text-xs text-gray-600">
                <strong>Error ID:</strong> {this.state.errorId}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Share this ID with support if problem persists
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={this.handleReset}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Try Again
              </button>
              <button
                onClick={this.handleReload}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
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
