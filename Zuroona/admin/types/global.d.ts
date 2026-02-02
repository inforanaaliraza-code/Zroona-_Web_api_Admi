// Global type definitions for window properties and external libraries

interface Window {
  [key: string]: any;
}

// Make all any types more lenient
type AnyType = any;
type Any = any;

// Suppress type errors for common patterns
declare var __DEV__: boolean;

// Global type augmentations
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
    }
  }
}

export {};
