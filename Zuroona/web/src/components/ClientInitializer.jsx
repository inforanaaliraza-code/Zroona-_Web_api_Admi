'use client';

/**
 * Client Initializer Component
 * Initializes all error handling services on app load
 */

import { useEffect } from 'react';
import errorHandler from '@/lib/errorHandler';
import sessionManager from '@/lib/sessionManager';
import networkStatusDetector from '@/lib/networkStatusDetector';
import errorLoggingService from '@/lib/errorLoggingService';

function ClientInitializer() {
  useEffect(() => {
    // Initialize all services
    if (typeof window !== 'undefined') {
      // Initialize session manager
      sessionManager.init();

      // Initialize network detector
      networkStatusDetector.init();

      // Set up global error listener
      window.addEventListener('error', (event) => {
        errorHandler.log(event.error || event, {
          type: 'uncaughtError',
          filename: event.filename,
          lineno: event.lineno,
        });
      });

      // Set up unhandled promise rejection listener
      window.addEventListener('unhandledrejection', (event) => {
        errorHandler.log(event.reason, {
          type: 'unhandledPromiseRejection',
        });
      });

      // Listen for session events
      const unsubscribeSession = sessionManager.onChange((event) => {
        if (event.type === 'LOGOUT') {
          // User will be redirected by session timeout event
          console.log('Session ended:', event.message);
        }
        if (event.type === 'WARNING') {
          // Show warning via error handler to trigger notification
          errorHandler.log(new Error(event.message), {
            severity: 'WARNING',
            type: 'SESSION_WARNING',
          });
        }
      });

      // Listen for network status changes
      const unsubscribeNetwork = networkStatusDetector.onChange((isOnline, data) => {
        if (!isOnline) {
          errorHandler.log(new Error('You are offline'), {
            severity: 'WARNING',
            type: 'OFFLINE',
            isOnline,
          });
        }
      });

      // Development logging
      if (process.env.NODE_ENV === 'development') {
        console.log('[ClientInitializer] Error handling services initialized');
        console.log('Available debug tools:');
        console.log('  - window.__errorHandler');
        console.log('  - window.__errorLoggingService');
        console.log('  - window.__sessionManager');
        console.log('  - window.__networkStatusDetector');
        console.log('  - window.__errorParser');
      }

      // Cleanup on unmount
      return () => {
        unsubscribeSession?.();
        unsubscribeNetwork?.();
        networkStatusDetector.destroy();
        sessionManager.destroy();
      };
    }
  }, []);

  return null;
}

export default ClientInitializer;
