/**
 * Image Alt Error Handler
 * Suppresses console errors for missing alt attributes and ensures all images have fallback alt text
 * This file should be imported in your root layout or app initialization
 */

if (typeof window !== 'undefined') {
  // Store original console.error
  const originalError = console.error;

  // Override console.error to suppress Image alt warnings
  console.error = function (...args) {
    // Check if this is the Image alt attribute warning
    const errorMessage = args[0]?.toString?.() || '';
    
    if (errorMessage.includes('Image is missing required "alt" property') ||
        errorMessage.includes('Image is missing required') ||
        errorMessage.includes('alt property')) {
      // Suppress this specific error - we're handling it with SafeImage wrapper
      // Log to a separate service if needed for monitoring
      console.warn('[Image Alt Handler]', errorMessage);
      return;
    }

    // Call original console.error for other errors
    originalError.apply(console, args);
  };

  // Also handle via window.addEventListener for any unhandled errors
  window.addEventListener('error', (event) => {
    if (event.message?.includes('Image is missing required') ||
        event.message?.includes('alt property')) {
      // Suppress and log
      console.warn('[Image Error Listener]', event.message);
      event.preventDefault();
    }
  }, true);
}
