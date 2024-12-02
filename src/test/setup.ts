import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Extend expect matchers
expect.extend({});

// Clean up after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Mock Redux hooks
vi.mock('react-redux', () => ({
  useDispatch: () => vi.fn(),
  useSelector: vi.fn(),
  Provider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock Next.js router and other navigation utilities
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    pathname: '/',
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
  headers: () => new Headers(),
  cookies: () => new Map(),
}));

// Mock Next.js app
vi.mock('next/app', () => ({
  useApp: () => ({
    router: {
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      pathname: '/',
    },
  }),
}));

// Mock mapbox-gl
vi.mock('mapbox-gl', () => ({
  default: {
    Map: vi.fn(() => ({
      on: vi.fn(),
      off: vi.fn(),
      remove: vi.fn(),
      getCanvas: vi.fn(() => ({
        style: {},
      })),
      getContainer: vi.fn(() => ({
        getBoundingClientRect: vi.fn(() => ({
          width: 800,
          height: 600,
        })),
      })),
      project: vi.fn(() => ({ x: 0, y: 0 })),
      unproject: vi.fn(() => ({ lat: 0, lng: 0 })),
    })),
    Marker: vi.fn(() => ({
      setLngLat: vi.fn().mockReturnThis(),
      addTo: vi.fn().mockReturnThis(),
      remove: vi.fn(),
      getElement: vi.fn(() => document.createElement('div')),
    })),
  },
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
  length: 0,
  key: vi.fn(),
};

vi.stubGlobal('localStorage', localStorageMock);

// Mock ResizeObserver
const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.stubGlobal('ResizeObserver', ResizeObserverMock);

// Mock IntersectionObserver
const IntersectionObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

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
}); 