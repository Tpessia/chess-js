import { DependencyList, useEffect, useRef } from 'react';

type EffectCountAsyncCallback = (count: number) => Promise<any>;

// Hook that counts the number of executions
export default function useEffectCountAsync(effect: EffectCountAsyncCallback, deps?: DependencyList) {
  const countRef = useRef<number>(0); // useRef vs useState to prevent unnecessary component update
  useEffect(() => {
    countRef.current += 1;
    (async () => effect(countRef.current))();
  }, deps);
}
