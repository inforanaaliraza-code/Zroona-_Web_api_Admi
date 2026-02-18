/**
 * NETWORK STATUS DETECTOR
 * Detects internet connectivity and offline scenarios
 */

class NetworkStatusDetector {
  constructor() {
    this.isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    this.listeners = [];
    this.pingUrl = '/api/health';
    this.pingInterval = null;
  }

  /**
   * Initialize network status monitoring
   */
  init() {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));

    // Periodic ping to verify connection
    this.startPingCheck();
  }

  /**
   * Start periodic ping to verify actual connection
   */
  startPingCheck() {
    this.pingInterval = setInterval(() => {
      this.verifyConnection();
    }, 30000); // Check every 30 seconds
  }

  /**
   * Stop ping check
   */
  stopPingCheck() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  /**
   * Verify actual server connectivity
   */
  async verifyConnection() {
    try {
      const response = await fetch(this.pingUrl, {
        method: 'GET',
        cache: 'no-cache',
        timeout: 5000,
      });
      
      if (!this.isOnline && response.ok) {
        this.setOnline(true);
      }
    } catch (error) {
      if (this.isOnline) {
        this.setOnline(false);
      }
    }
  }

  /**
   * Handle online event
   */
  handleOnline() {
    this.setOnline(true);
  }

  /**
   * Handle offline event
   */
  handleOffline() {
    this.setOnline(false);
  }

  /**
   * Set online status and notify listeners
   */
  setOnline(status) {
    if (this.isOnline === status) return;

    this.isOnline = status;
    this.notifyListeners(status);

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Network] Status changed: ${status ? 'ONLINE' : 'OFFLINE'}`);
    }
  }

  /**
   * Subscribe to network status changes
   */
  onChange(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  /**
   * Notify all listeners
   */
  notifyListeners(status) {
    this.listeners.forEach((callback) => {
      try {
        callback(status);
      } catch (error) {
        console.error('[NetworkStatusDetector] Listener error:', error);
      }
    });
  }

  /**
   * Get current status
   */
  getStatus() {
    return this.isOnline;
  }

  /**
   * Cleanup
   */
  destroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.handleOnline);
      window.removeEventListener('offline', this.handleOffline);
    }
    this.stopPingCheck();
    this.listeners = [];
  }
}

export const networkStatusDetector = new NetworkStatusDetector();

/**
 * React Hook for network status
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = React.useState(networkStatusDetector.getStatus());

  React.useEffect(() => {
    const unsubscribe = networkStatusDetector.onChange((status) => {
      setIsOnline(status);
    });

    return unsubscribe;
  }, []);

  return isOnline;
};

export default networkStatusDetector;
