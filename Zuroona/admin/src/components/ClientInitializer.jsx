'use client';

/**
 * CLIENT INITIALIZER
 * Initializes all error handling and monitoring services on app load
 */

import { useEffect } from 'react';
import { errorHandler } from '@/lib/errorHandler';
import { errorLoggingService } from '@/lib/errorLoggingService';
import { networkStatusDetector } from '@/lib/networkStatusDetector';
import { sessionManager } from '@/lib/sessionManager';
import ErrorNotificationContainer from '@/components/ErrorNotificationContainer';

export default function ClientInitializer({ children }) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize error logging
    console.log('[ClientInitializer] Initializing error handling services...');

    try {
      // Initialize session manager
      sessionManager.init();
      
      // Initialize network status detector
      networkStatusDetector.init();

      // Setup global error handler
      window.addEventListener('error', (event) => {
        errorHandler.log(event.error || new Error('Unknown error'), {
          type: 'GLOBAL_ERROR_EVENT',
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        });
      });

      // Setup unhandled promise rejection handler
      window.addEventListener('unhandledrejection', (event) => {
        errorHandler.log(event.reason || new Error('Unhandled promise rejection'), {
          type: 'UNHANDLED_REJECTION',
        });
      });

      // Setup network status notifications
      networkStatusDetector.onChange((isOnline) => {
        if (!isOnline) {
          errorHandler.log(
            {
              code: 'NETWORK_OFFLINE',
              message: 'Lost connection to the internet',
              severity: 'CRITICAL',
              type: 'NETWORK_STATUS',
            }
          );
        } else {
          console.log('[NetworkStatus] Connection restored');
        }
      });

      // Setup session manager notifications
      sessionManager.onChange((event) => {
        console.log('[SessionManager] Event:', event.type);
        
        if (event.type === 'LOGOUT') {
          setTimeout(() => {
            window.location.href = '/auth/login';
          }, 1500);
        }
      });

      // Expose error handler for debugging (development only)
      if (process.env.NODE_ENV === 'development') {
        window.__errorHandler = errorHandler;
        window.__errorLoggingService = errorLoggingService;
        window.__sessionManager = sessionManager;
        window.__networkStatusDetector = networkStatusDetector;
        
        console.log('[ClientInitializer] Debug tools available:');
        console.log('- window.__errorHandler');
        console.log('- window.__errorLoggingService');
        console.log('- window.__sessionManager');
        console.log('- window.__networkStatusDetector');
      }

      console.log('[ClientInitializer] All services initialized successfully');
    } catch (error) {
      console.error('[ClientInitializer] Initialization error:', error);
    }

    return () => {
      // Cleanup
      networkStatusDetector.destroy();
      sessionManager.destroy();
    };
  }, []);

  return (
    <>
      <ErrorNotificationContainer />
      {children}
    </>
  );
}
