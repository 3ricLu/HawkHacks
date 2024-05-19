<<<<<<< HEAD
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
=======
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
>>>>>>> 5b4386e14e845e0fb5c7f1675e2dae57e8f1feb9

export default defineConfig({
<<<<<<< HEAD
  plugins: [
    react(),
    NodeGlobalsPolyfillPlugin({
      buffer: true
    }),
    NodeModulesPolyfillPlugin()
  ],
  resolve: {
    alias: {
      global: 'global'
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true
        }),
        NodeModulesPolyfillPlugin()
      ]
    }
  }
});
=======
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
      },
    },
  },
  esbuild: {
    jsxFactory: "React.createElement",
    jsxFragment: "React.Fragment",
  },
  
});
>>>>>>> 5b4386e14e845e0fb5c7f1675e2dae57e8f1feb9
