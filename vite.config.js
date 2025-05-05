import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env.MapboxAccessToken': JSON.stringify(process.env.MapboxAccessToken)
  },
  plugins: [react()],
});
