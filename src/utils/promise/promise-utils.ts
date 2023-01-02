// Similar to Promise.all, but parallel
export function promiseParallel<T>(tasks: (() => Promise<T>)[], concurrencyLimit: number): Promise<T[]> {
    return new Promise<T[]>((res, rej) => {
        if (tasks.length === 0) res([]);

        const results: T[] = [];
        const pool: Promise<T>[] = [];
        let canceled: boolean = false;

        tasks.slice(0, concurrencyLimit).map(e => runPromise(e));

        function runPromise(task: () => Promise<T>): Promise<T> {
            const promise = task();

            pool.push(promise);

            promise.then(r => {
                if (canceled) return;

                results.push(r);

                const poolIndex = pool.indexOf(promise);
                pool.splice(poolIndex, 1);

                if (tasks.length === results.length)
                    res(results);

                const nextIndex = concurrencyLimit + results.length - 1;
                const nextTask = tasks[nextIndex];

                if (!nextTask) return;

                runPromise(nextTask);
            }).catch(err => {
                canceled = true;
                rej(err);
            });

            return promise;
        }
    });
}

// Similar to Promise.all, but parallel and without rejection
export function promiseParallelAll<T, TRej = Error>(tasks: (() => Promise<T>)[], concurrencyLimit: number): Promise<(T | TRej)[]> {
    return new Promise<(T | TRej)[]>((res, rej) => {
        if (tasks.length === 0) res([]);

        const results: (T | TRej)[] = [];
        const pool: Promise<T>[] = [];
        let canceled: boolean = false;

        tasks.slice(0, concurrencyLimit).map(e => runPromise(e));

        function runPromise(task: () => Promise<T>): Promise<T> {
            const promise = task();

            pool.push(promise);

            promise.catch((e: TRej) => e)
            .then(r => {
                if (canceled) return;

                results.push(r);

                const poolIndex = pool.indexOf(promise);
                pool.splice(poolIndex, 1);

                if (tasks.length === results.length)
                    res(results);

                const nextIndex = concurrencyLimit + results.length - 1;
                const nextTask = tasks[nextIndex];

                if (!nextTask) return;

                runPromise(nextTask);
            });

            return promise;
        }
    });
}

export async function promiseRetry<T>(func: () => Promise<T>, maxRetries: number, retries: number = 0): Promise<T> {
    try {
        return await func();
    } catch (err) {
        retries++;
        if (retries >= maxRetries) throw err;
        else return await promiseRetry(func, maxRetries, retries);
    }
}
