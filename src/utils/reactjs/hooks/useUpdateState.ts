import { callOrGet } from '@/utils/function/function-utils';
import { SetState } from '@/utils/reactjs/reactjs-types';
import update, { Spec } from 'immutability-helper';

export type SetStateUpdate<S> = Spec<S> | ((prevState: S) => Spec<S>);
export type SetStateUpdateFunction<S> = ($spec: SetStateUpdate<S>) => void;

// Hook as shortcut for immutability-helper's update
export default function useStateUpdate<S>(setState: SetState<S>): SetStateUpdateFunction<S> {
    return function ($spec: SetStateUpdate<S>) {
        setState(state => update(state, callOrGet($spec, state)));
    };
}
