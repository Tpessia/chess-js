import { isEqual } from 'lodash-es';
import { useEffect } from 'react';

// Hook to update state on props update
export default function usePropsInjection<P, S>(props: P, state: S, setState: (state: S) => void, stateFromProps: (props: P) => S) {
    useEffect(() => {
        const newState = { ...state, ...stateFromProps(props) };
        if (!isEqual(state, newState)) setState(newState);
    }, [props]);
}
