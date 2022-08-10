import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  external: [ 'aws_amplify', 'Buffer', 'CustomEvent', 'HTMLWidgets', 'process', 'Shiny', 'shinyjs' ],
  plugins: [
      react()
  ]
});
