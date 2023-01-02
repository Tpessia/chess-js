export function defaultStr<T extends { toString: () => string }>(value: T | undefined | null) {
    return value != null ? value.toString() : '';
}

export function castBoolean<T>(value: T | undefined | null) {
    if (value != null) return !!value;
    return value as undefined | null;
}
