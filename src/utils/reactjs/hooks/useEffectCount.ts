import { DependencyList, useEffect, useRef } from 'react';

type EffectCountCallback = (count: number) => (any | (() => any));

// Hook that counts the number of executions
export default function useEffectCount(effect: EffectCountCallback, deps?: DependencyList) {
  const countRef = useRef<number>(0); // useRef vs useState to prevent unnecessary component update
  useEffect(() => {
    countRef.current += 1;
    return effect(countRef.current);
  }, deps);
}
