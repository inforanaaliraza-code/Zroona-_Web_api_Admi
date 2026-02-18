/**
 * Network Status Detector
 * Detects online/offline status with periodic health checks
 */

import { useEffect, useState } from 'react';

class NetworkStatusDetector {
  constructor() {
    this.isOnline = typeof navigator !== 'undefined' && navigator.onLine;
    this.listeners = [];
    this.pingInterval = null;
    this.pingEndpoint = '/api/health';
    this.pingIntervalTime = 30000; // 30 seconds
  }

  /**
   * Initialize network detection
   */
  init() {
    if (typeof window === 'undefined') return;

    // Listen for online/offline events
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());

    // Start periodic ping checks
    this.startPingCheck();
  }

  /**
   * Handle online event
   */
  handleOnline() {
    if (!this.isOnline) {
      this.isOnline = true;
      this.notifyListeners({ isOnline: true, type: 'ONLINE' });
    }
  }

  /**
   * Handle offline event
   */
  handleOffline() {
    if (this.isOnline) {
      this.isOnline = false;
      this.notifyListeners({ isOnline: false, type: 'OFFLINE' });
    }
  }

  /**
   * Start periodic ping checks
   */
  startPingCheck() {
    if (typeof window === 'undefined') return;

    this.pingInterval = setInterval(async () => {
      try {
        const response = await fetch(this.pingEndpoint, {
          method: 'HEAD',
          cache: 'no-cache',
          timeout: 5000,
        });

        if (response.ok && !this.isOnline) {
          // We're back online
          this.handleOnline();
        }
      } catch (error) {
        // Ping failed
        if (this.isOnline && navigator.onLine === false) {
          this.handleOffline();
        }
      }
    }, this.pingIntervalTime);
  }

  /**
   * Stop ping checks
   */
  stopPingCheck() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  /**
   * Get current network status
   */
  getStatus() {
    return this.isOnline;
  }

  /**
   * Set online status (for testing)
   */
  setOnline(status) {
    if (status !== this.isOnline) {
      this.isOnline = status;
      this.notifyListeners({
        isOnline: status,
        type: status ? 'ONLINE' : 'OFFLINE',
      });
    }
  }

  /**
   * Subscribe to network status changes
   */
  onChange(callback) {
    this.listeners.push(callback);

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  /**
   * Notify all listeners of status change
   */
  notifyListeners(data) {
    this.listeners.forEach((listener) => {
      try {
        listener(data.isOnline, data);
      } catch (error) {
        console.error('Error in network status listener:', error);
      }
    });
  }

  /**
   * Cleanup
   */
  destroy() {
    this.stopPingCheck();
    this.listeners = [];
  }
}

// Singleton instance
const networkStatusDetector = new NetworkStatusDetector();

/**
 * React hook for network status
 */
function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const unsubscribe = networkStatusDetector.onChange((status) => {
      setIsOnline(status);
    });

    return unsubscribe;
  }, []);

  return isOnline;
}

// Expose to window for debugging
if (typeof window !== 'undefined') {
  window.__networkStatusDetector = networkStatusDetector;
}

export default networkStatusDetector;
export { networkStatusDetector, useNetworkStatus };
