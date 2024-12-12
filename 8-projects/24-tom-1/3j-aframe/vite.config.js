import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
  optimizeDeps: {
    esbuildOptions: {
      legalComments: 'none',
    },
  },
  server: {
    hmr: {
      clientPort: 443,
      protocol: 'wss',
    },
  },
});