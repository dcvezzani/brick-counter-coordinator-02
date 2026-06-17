import { beforeEach, describe, expect, it } from 'vitest'
import {
  BRICKLINK_COOKIE_STORAGE_KEY,
  clearBrickLinkCookie,
  getBrickLinkCookie,
  hasBrickLinkCookie,
  saveBrickLinkCookie,
} from '@/lib/bricklink-auth.js'

describe('bricklink-auth', () => {
  beforeEach(() => {
    localStorage.clear()
    clearBrickLinkCookie()
  })

  it('stores and reads cookie from localStorage', () => {
    expect(hasBrickLinkCookie()).toBe(false)
    saveBrickLinkCookie('  session=abc; path=/  ')
    expect(getBrickLinkCookie()).toBe('session=abc; path=/')
    expect(hasBrickLinkCookie()).toBe(true)
    expect(localStorage.getItem(BRICKLINK_COOKIE_STORAGE_KEY)).toBe('session=abc; path=/')
  })

  it('clears cookie', () => {
    saveBrickLinkCookie('session=abc')
    clearBrickLinkCookie()
    expect(hasBrickLinkCookie()).toBe(false)
  })
})
