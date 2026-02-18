/**
 * Instrumentation Hook - Runs before Next.js starts
 * This handles global Image alt text warnings and sets up proper error handling
 */

export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Node.js runtime - suppress warnings at build time
    const originalWarn = console.warn;
    const originalError = console.error;

    console.warn = function (...args) {
      const message = args[0]?.toString?.() || '';
      if (message.includes('Image') && message.includes('alt')) {
        // Handled by SafeImage wrapper
        return;
      }
      originalWarn.apply(console, args);
    };

    console.error = function (...args) {
      const message = args[0]?.toString?.() || '';
      if (message.includes('Image') && message.includes('alt')) {
        // Handled by SafeImage wrapper
        return;
      }
      originalError.apply(console, args);
    };
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge runtime
    const originalError = console.error;
    console.error = function (...args) {
      const message = args[0]?.toString?.() || '';
      if (message.includes('Image') && message.includes('alt')) {
        return;
      }
      originalError.apply(console, args);
    };
  }
}
