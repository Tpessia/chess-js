import { useEffect, useRef } from 'react';

// Hook to get previous state value
export default function usePrevious<T>(value: T) {
    const ref = useRef<T>();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}
