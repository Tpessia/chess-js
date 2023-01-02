export const valueSign = (value: number | string | null | undefined, space: string = ' ') => {
    if (!value) return '0';
    const valueAbs = Math.abs(+value);
    return value > 0 ? `+${space}${valueAbs}` : `-${space}${valueAbs}`;
};
