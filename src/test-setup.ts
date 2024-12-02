import '@testing-library/jest-dom'
import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// Extend Vitest's expect with testing-library matchers
expect.extend(matchers)

// Clean up after each test
afterEach(() => {
  cleanup()
})

// Mock Next.js App Router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    pathname: '/',
    query: {},
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock MapboxGL
const mockMapInstance = {
  getCenter: vi.fn(() => ({ lng: -155.5, lat: 19.5 })),
  getZoom: vi.fn(() => 5),
  dragRotate: {
    disable: vi.fn()
  },
  touchZoomRotate: {
    disableRotation: vi.fn()
  },
  on: vi.fn((event, callback) => {
    if (event === 'load') {
      callback({ type: 'load', target: mockMapInstance })
    }
  }),
  addControl: vi.fn(),
  setCenter: vi.fn(),
  setZoom: vi.fn(),
  remove: vi.fn(),
  addLayer: vi.fn(),
  removeLayer: vi.fn(),
  getLayer: vi.fn(),
  getSource: vi.fn(),
  removeSource: vi.fn(),
  flyTo: vi.fn(),
  easeTo: vi.fn(),
  project: vi.fn(coords => ({ x: 0, y: 0 })),
  unproject: vi.fn(point => ({ lng: 0, lat: 0 })),
  addSource: vi.fn(),
  setLayoutProperty: vi.fn(),
  setPaintProperty: vi.fn(),
  getBounds: vi.fn(() => ({
    getNorth: () => 20,
    getSouth: () => 19,
    getEast: () => -155,
    getWest: () => -156
  })),
  fitBounds: vi.fn(),
  setStyle: vi.fn(),
  once: vi.fn(),
  off: vi.fn()
}

vi.mock('mapbox-gl', () => ({
  default: {
    Map: vi.fn(() => mockMapInstance),
    NavigationControl: vi.fn(),
    ScaleControl: vi.fn()
  }
}))

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    clear: vi.fn()
  }
})

// Mock crypto for UUID generation
Object.defineProperty(window, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid'
  }
})

// Mock next/font
vi.mock('next/font/google', () => ({
  Inter: () => ({
    className: 'mock-inter'
  })
})) 