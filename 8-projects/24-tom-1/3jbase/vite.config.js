import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    // Ensures esbuild does not use eval internally
    legalComments: 'none',
  },
  build: {
    // Minimize the possibility of eval being used in the output
    minify: 'esbuild',
  }
})

