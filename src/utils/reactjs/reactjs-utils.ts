import { DeepPartial } from '@/utils/types/deep-partial';
import { isArray, mergeWith } from 'lodash-es';

export function mergeState<T>(oldState: T, newState: DeepPartial<T>, overwrite: boolean = true) {
    return mergeWith(oldState, newState, (a, b) => isArray(b) ? overwrite ? b : a.concat(b) : undefined);
}
