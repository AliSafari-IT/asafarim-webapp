/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: {
    readonly NODE_ENV: string;
    readonly [key: string]: string | boolean | undefined;
  };
}
