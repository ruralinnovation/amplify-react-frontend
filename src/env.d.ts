/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_VERSION: string
  readonly VITE_MAPBOX_TOKEN: string
  readonly VITE_OFFLINE_NOTIFICATION: string
  readonly VITE_TABLEAU_CLIENT_ID: string
  readonly VITE_TABLEAU_SECRET_ID: string
  readonly VITE_TABLEAU_SECRET_VALUE: string
  readonly VITE_TABLEAU_USER: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
