import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    external: [
        'aws_amplify', 'aws_amplify_core', 'aws_amplify_react',
        'Buffer', 'CustomEvent', 'HTMLWidgets', 'react', 'Shiny', 'shinyjs'
    ],
    plugins: [
        react()
    ],
    resolve: {
        alias: [
            // {
            //     find: '@', replacement: resolve(__dirname, './src'),
            // },
            {
                find: './runtimeConfig', replacement: './runtimeConfig.browser',
            }
        ]
    }
});
