// source: https://www.typescriptlang.org/docs/handbook/declaration-merging.html#global-augmentation
export {};

declare global {
    interface Window {
        moo?: unknown;
    }
}