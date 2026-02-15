// Redux Toolkit type fixes
declare module '@reduxjs/toolkit' {
  export interface CreateSliceOptions<State, CaseReducers = any, Name extends string = string> {
    name: Name;
    initialState: State;
    reducers?: CaseReducers | ((creators: any) => CaseReducers);
    extraReducers?: ((builder: any) => void) | Record<string, any>;
  }
}
