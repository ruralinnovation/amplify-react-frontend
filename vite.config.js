import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";

export default {
  define: {
    'process.env.MapboxAccessToken': JSON.stringify(process.env.MapboxAccessToken)
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true
        }),
        NodeModulesPolyfillPlugin()
      ]
    }
  },
  resolve: {
    alias: [
      // {
      //     find: "@", replacement: resolve(__dirname, "./src"),
      // },
      {
        find: "./runtimeConfig", replacement: "./runtimeConfig.browser"
      },
      {
        find: "util",
        replacement: "rollup-plugin-node-polyfills/polyfills/util"
      }
    ]
  }
};
