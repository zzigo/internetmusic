// vite.config.js
export default {
  optimizeDeps: {
    include: ['three/examples/jsm/loaders/GLTFLoader.js'],
  },
    server: {
      proxy: {
        '/ws': {
          target: 'ws://localhost:8080',
          ws: true, // Enable WebSocket proxying
        },
      },
    },
    resolve: {
    alias: {
      // Explicitly resolve empty modules for Node.js polyfills
      stream: false,
    },
  },
  };