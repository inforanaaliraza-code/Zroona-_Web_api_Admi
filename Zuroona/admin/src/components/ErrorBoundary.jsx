'use client';

/**
 * ERROR BOUNDARY COMPONENT
 * Catches React component errors and displays fallback UI.
 * Handles "Objects are not valid as a React child (HTMLImageElement)" with auto-reload once.
 */

import { Component } from 'react';
import { errorHandler } from '@/lib/errorHandler';

const INVALID_CHILD_RELOAD_KEY = 'admin_error_boundary_invalid_child_reloaded';

function isInvalidReactChildError(error) {
  if (!error || !error.message) return false;
  const msg = typeof error.message === 'string' ? error.message : String(error.message);
  return msg.includes('Objects are not valid as a React child') || msg.includes('HTMLImageElement');
}

function safeErrorDisplay(error) {
  if (error == null) return 'Unknown error';
  if (typeof error.message === 'string') return error.message;
  if (typeof error.toString === 'function') return error.toString();
  return 'Unknown error';
}

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

    if (typeof window !== 'undefined' && isInvalidReactChildError(error)) {
      try {
        const alreadyReloaded = sessionStorage.getItem(INVALID_CHILD_RELOAD_KEY);
        if (!alreadyReloaded) {
          sessionStorage.setItem(INVALID_CHILD_RELOAD_KEY, '1');
          errorHandler.log(error, { step: 'ERROR_BOUNDARY_INVALID_CHILD', componentStack: errorInfo?.componentStack, errorId });
          window.location.reload();
          return;
        }
        sessionStorage.removeItem(INVALID_CHILD_RELOAD_KEY);
      } catch (e) {
        // ignore
      }
    }

    errorHandler.log(error, {
      step: 'ERROR_BOUNDARY',
      componentStack: errorInfo?.componentStack,
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
      const errorText = safeErrorDisplay(this.state.error);
      const stackText = typeof this.state.errorInfo?.componentStack === 'string'
        ? this.state.errorInfo.componentStack
        : '';

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 border-2 border-red-200">
            <div className="text-center mb-4">
              <div className="text-5xl mb-2">⚠️</div>
              <h1 className="text-2xl font-bold text-gray-900">Oops! Something went wrong</h1>
            </div>

            <div className="bg-red-50 rounded-lg p-4 mb-4 border border-red-200">
              <p className="text-sm text-gray-700 font-mono break-words">{errorText}</p>
              {process.env.NODE_ENV === 'development' && stackText && (
                <details className="mt-3 text-xs text-gray-600">
                  <summary className="cursor-pointer font-semibold hover:text-gray-900">Developer Details</summary>
                  <pre className="mt-2 overflow-auto bg-white p-2 rounded border border-red-200">{stackText}</pre>
                </details>
              )}
            </div>

            <div className="bg-gray-50 rounded p-3 mb-4">
              <p className="text-xs text-gray-600">
                <strong>Error ID:</strong> {this.state.errorId}
              </p>
              <p className="text-xs text-gray-500 mt-1">Share this ID with support if problem persists</p>
            </div>

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
