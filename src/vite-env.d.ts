/// <reference types="vite/client" />

declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.wav' {
  const value: string;
  export default value;
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly MODE: string;
  // Add other environment variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
