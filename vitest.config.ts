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
    setupFiles: ['./src/test/setup.ts'],
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
      reporter: ['text', 'json', 'lcov', 'html'],
      exclude: [
        'node_modules/**',
        'dist/**',
        '**/*.d.ts',
        '**/*.test.{ts,tsx}',
        '**/test/**',
        '.next/**',
        'coverage/**',
      ],
      include: ['src/**/*.{ts,tsx}'],
      all: true,
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80,
      reportsDirectory: './coverage',
      clean: true,
    },
  },
}) 