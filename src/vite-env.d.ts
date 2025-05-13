/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string,
  readonly VITE_CONTENT_LOGO: string,
  readonly VITE_CONTENT_TITLE: string,
  readonly VITE_CONTENT_FOOTER: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
