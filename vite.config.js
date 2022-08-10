import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    external: [
        "aws_amplify", "aws_amplify_react", "aws_amplify_core",
        "@aws-amplify/analytics", "@aws-amplify/api", "@aws-amplify/auth", "@aws-amplify/core", "@aws-amplify/interactions", "@aws-amplify/storage", "@aws-amplify/ui", "@aws-amplify/xr",
        'Buffer', 'CustomEvent', 'HTMLWidgets', "react", 'Shiny', 'shinyjs' ],
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
