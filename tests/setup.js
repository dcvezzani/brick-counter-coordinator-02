import { vi } from 'vitest'

/**
 * Stub window.matchMedia for VueUse useMediaQuery and component mounts.
 * @param {boolean} mdUp - when true, `(min-width: 768px)` queries match
 */
export function stubMatchMedia(mdUp = false) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: query.includes('min-width') ? mdUp : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

stubMatchMedia(false)
