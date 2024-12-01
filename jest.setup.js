import '@testing-library/jest-dom'

// Mock MapboxGL
jest.mock('mapbox-gl', () => ({
  Map: jest.fn(() => ({
    on: jest.fn(),
    remove: jest.fn(),
    getCenter: () => ({ lng: 0, lat: 0 }),
    getZoom: () => 5
  })),
  NavigationControl: jest.fn(),
  ScaleControl: jest.fn()
})) 