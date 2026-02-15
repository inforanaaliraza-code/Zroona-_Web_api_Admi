// Global type definitions for window properties and external libraries

interface Window {
  Moyasar?: any;
  MoyasarLoadError?: boolean;
  ApplePaySession?: {
    canMakePayments: () => boolean;
    canMakePaymentsWithActiveCard?: (merchantIdentifier: string) => Promise<boolean>;
    supportsVersion?: (version: number) => boolean;
  };
  [key: string]: any;
}

// Declare global types for external libraries
declare const Moyasar: any;
declare const ApplePaySession: {
  canMakePayments: () => boolean;
  canMakePaymentsWithActiveCard?: (merchantIdentifier: string) => Promise<boolean>;
  supportsVersion?: (version: number) => boolean;
};

// Extend Date type for arithmetic operations
interface Date {
  valueOf(): number;
  getTime(): number;
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
