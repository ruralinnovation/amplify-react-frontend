/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_VERSION: string
  readonly VITE_MAPBOX_TOKEN: string
  readonly VITE_OFFLINE_NOTIFICATION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
  