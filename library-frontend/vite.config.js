import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(
    // {jsxRuntime: 'automatic',fastRefresh: true,}
  )],
  css: {
    modules: {

      generateScopedName: '[name]__[local]___[hash:base64:5]',
      localsConvention: 'camelCase'
    },

    devSourcemap: true
  },
  build: {
    minify: false,
    sourcemap: true
  }
})