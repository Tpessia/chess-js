export function timeoutAsync(callback: () => void | Promise<void>, timeout: number) {
    return new Promise<void>((res, rej) => {
        setTimeout(async () => {
            await callback();
            res();
        }, timeout);
    });
}

export function intervalAsync(callback: () => boolean | Promise<boolean>, timeout: number, eager: boolean = false) {
    return new Promise<void>(async (res, rej) => {
        if (eager && await callback()) return res();
        const interval = setInterval(async () => {
            if (await callback()) {
                clearInterval(interval);
                return res();
            }
        }, timeout);
    });
}

export function sleep(duration: number) {
    return new Promise<void>(async (res, rej) => setTimeout(res, duration));
}
