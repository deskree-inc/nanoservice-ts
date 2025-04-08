// Global type declarations for test environment
declare const describe: (name: string, fn: () => void) => void;
declare const it: (name: string, fn: (done?: () => void) => void) => void;
declare const expect: (value: any) => any;
declare const fail: (message?: string) => never;
