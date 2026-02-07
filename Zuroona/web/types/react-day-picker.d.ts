// React Day Picker type fixes
declare module 'react-day-picker' {
  import { ComponentType } from 'react';
  
  export type DateRange = {
    from?: Date;
    to?: Date;
  };
  
  export interface CustomComponents {
    IconLeft?: ComponentType<any>;
    IconRight?: ComponentType<any>;
    [key: string]: ComponentType<any> | undefined;



    
  }
  
  export interface DayPickerProps {
    mode?: string;
    selected?: Date | DateRange;
    onSelect?: (date: any) => void;
    className?: string;
    classNames?: any;
    showOutsideDays?: boolean;
    [key: string]: any;
  }
}
