import { isFunction } from 'lodash-es';

export function callOrGet(value: Function | any, ...params: any[]) {
    return isFunction(value) ? value(...params) : value;
}
