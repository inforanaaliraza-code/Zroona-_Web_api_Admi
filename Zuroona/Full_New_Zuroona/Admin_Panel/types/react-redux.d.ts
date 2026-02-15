// Fix for React Redux Provider children prop
declare module 'react-redux' {
  import { ReactNode } from 'react';
  
  export interface ProviderProps<A = any, S = any> {
    store: any;
    children?: ReactNode;
    context?: any;
  }
}
