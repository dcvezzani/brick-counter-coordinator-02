import { ref } from 'vue'

const STORAGE_KEY = 'bricklink.sessionCookie'

/** Bumps when cookie is saved/cleared so Vue computeds can react. */
export const brickLinkCookieRevision = ref(0)

/**
 * @returns {string}
 */
export function getBrickLinkCookie() {
  if (typeof localStorage === 'undefined') {
    return ''
  }
  return localStorage.getItem(STORAGE_KEY) ?? ''
}

/**
 * @returns {boolean}
 */
export function hasBrickLinkCookie() {
  void brickLinkCookieRevision.value
  return getBrickLinkCookie().trim().length > 0
}

/**
 * @param {string} cookie
 */
export function saveBrickLinkCookie(cookie) {
  if (typeof localStorage === 'undefined') {
    return
  }
  localStorage.setItem(STORAGE_KEY, cookie.trim())
  brickLinkCookieRevision.value += 1
}

export function clearBrickLinkCookie() {
  if (typeof localStorage === 'undefined') {
    return
  }
  localStorage.removeItem(STORAGE_KEY)
  brickLinkCookieRevision.value += 1
}

export { STORAGE_KEY as BRICKLINK_COOKIE_STORAGE_KEY }
