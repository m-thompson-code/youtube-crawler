export type PromiseFunction<T=unknown> = () => Promise<T>;

export const iteratePromiseFunctions = async (promiseFunctions: PromiseFunction<boolean>[], beforeFunc?: PromiseFunction): Promise<boolean>  => {
    if (!promiseFunctions.length) {
        return Promise.resolve(true);
    }

    if (beforeFunc) {
        await beforeFunc();
    }

    const result = await promiseFunctions[0]();

    if (!result) {
        return iteratePromiseFunctions(promiseFunctions, beforeFunc);
    }

    return iteratePromiseFunctions(promiseFunctions.slice(1), beforeFunc);
}

export const delay = (milliseconds: number): Promise<void> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, milliseconds * 10);
    })
}
