export interface Dictionary<T> {
    [key: string]: T;
}

export interface NumberDictionary<T> {
    [key: number]: T | undefined;
}

export type EnumDictionary<T extends string | symbol | number, U> = {
    [K in T]?: U;
}

export type StrictEnumDictionary<T extends string | symbol | number, U> = {
    [K in T]: U;
}

export type ArrDictionary<T extends string | symbol | number, U> = {
    key: T;
    value: U;
}[];
