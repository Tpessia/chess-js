export const rndNumber = () => Math.round(Math.random() * 9999999999);

// https://0.30000000000000004.com/
export const castPercent = (num: number) => {
    const precision = num.toString().replace('.', '').length;
    const result = num / 100;
    return +result.toPrecision(precision);
};
