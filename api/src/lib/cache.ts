/* eslint-disable @typescript-eslint/no-explicit-any */

export const cached = <F extends (...args: any[]) => any>(func: F) => {
    const cache: Record<string, unknown> = {};

    return async (...args: Parameters<F>) => {
        const key = JSON.stringify(args);

        const cachedValue = cache[key];
        if (cachedValue) {
            return cachedValue as Awaited<ReturnType<F>>;
        }

        const result = await func(...args);
        cache[key] = result;
        return result as Awaited<ReturnType<F>>;
    };
};
