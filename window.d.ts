// source: https://www.typescriptlang.org/docs/handbook/declaration-merging.html#global-augmentation
export {};

declare global {
    interface Window {
        moo?: unknown;
        __crawler__email__?: string;
        __crawler__password__?: string;
        __crawler_dry_run__?: boolean;
    }
}