import { useRef } from 'react';

// Hook that counts the number of executions
export default function useLazyRef<T>(initValue: () => T) {
    const instance = useRef<T>(undefined as any);
    if (instance.current == null) instance.current = initValue();
    return instance;
}
