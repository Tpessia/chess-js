import { SetState } from '@/utils/reactjs/reactjs-types';
import React from 'react';

export interface GlobalContextState {
    test?: string | null;
}

export type GlobalContextData = [GlobalContextState, SetState<GlobalContextState>];

export const GlobalContext = React.createContext<GlobalContextData>({} as any);

export function initGlobalContext(): GlobalContextState {
    return { };
}
