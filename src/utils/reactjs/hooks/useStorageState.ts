import { jsonDateReviver, tryParseJson, tryStringifyJson } from '@/utils';
import { callOrGet } from '@/utils/function/function-utils';
import { InitialState, SetState, SetStateParam } from '@/utils/reactjs/reactjs-types';
import { omit, pick } from 'lodash-es';
import { useState } from 'react';

type ReturnType<S> = [S, SetState<S>, () => void];

// Hook as shortcut for localStorage + State
export default function useStorageState<S>(key: string, initStateFallback?: InitialState<S>, pickProps?: string[], omitProps?: string[]): ReturnType<S> {
    const [state, setState] = useState<S>(() => loadFromStorage() as any);

    const setStateWrapper = (stateSetter: SetStateParam<S>) => {
        setState(state => {
            const newState = callOrGet(stateSetter, state) as S;
            const filteredState: Partial<S> = omit<Partial<S>>(pickProps?.length ? pick(newState, ...pickProps) : newState, ...(omitProps ?? []));
            saveToStorage(filteredState);
            return newState;
        });
    };

    const clearStorageState = () => localStorage.removeItem(key);

    return [state, setStateWrapper, clearStorageState];

    function loadFromStorage(): S | null {
        const objStr = localStorage.getItem(key);

        const initObj = callOrGet(initStateFallback);

        let storageObj = tryParseJson<S>(objStr, jsonDateReviver);
        if (initObj != null && storageObj != null) storageObj = { ...initObj, ...storageObj };

        return storageObj != null ? storageObj : initObj;
    }

    function saveToStorage(state: Partial<S> | null | undefined) {
        const objStr = tryStringifyJson(state);
        if (objStr != null) localStorage.setItem(key, objStr);
        else localStorage.removeItem(key);
    }
}
