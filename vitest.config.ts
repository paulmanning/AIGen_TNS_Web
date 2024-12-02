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
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test-setup.ts',
        '.next/',
        '**/*.d.ts',
        '**/*.config.{js,ts}',
        '**/types/**',
        'coverage/**',
        '**/*.test.{js,jsx,ts,tsx}',
        '**/__tests__/**',
        '**/test-utils.tsx'
      ],
      all: true,
      clean: true,
      skipFull: false,
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      reportsDirectory: './coverage'
    },
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true
      }
    },
    testTimeout: 20000,
    hookTimeout: 20000,
    teardownTimeout: 20000
  },
}) 