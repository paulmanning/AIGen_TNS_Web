/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    reporters: ['default'],
    silent: true,
    onConsoleLog: (log) => {
      if (!log.includes('Warning:') && 
          !log.includes('The CJS build') &&
          !log.includes('Mapbox token')) {
        return log
      }
      return false
    },
    outputStyle: 'minimal',
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test-setup.ts',
      ],
    },
  },
}) 