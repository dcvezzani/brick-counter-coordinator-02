/**
 * Mirrors src/lib/set-catalog.js normalizeSetNumber + BrickLink itemNo/itemSeq split.
 * Keep in sync with set-catalog rules (see set-catalog.js).
 */

/**
 * @param {string} input
 * @returns {string}
 */
export function normalizeSetNumber(input) {
  const text = String(input ?? '').trim()
  if (!text) {
    return ''
  }
  if (/^\d+$/.test(text)) {
    return `${text}-1`
  }
  if (/^\d+-\d+$/.test(text)) {
    return text
  }
  return text
}

/**
 * @param {string} setNumber
 * @returns {{ itemNo: string, itemSeq: string } | null}
 */
export function parseSetNumberForBrickLink(setNumber) {
  const normalized = normalizeSetNumber(setNumber)
  if (!normalized) {
    return null
  }

  const match = /^(\d+)-(\d+)$/.exec(normalized)
  if (match) {
    return { itemNo: match[1], itemSeq: match[2] }
  }

  if (/^\d+$/.test(normalized)) {
    return { itemNo: normalized, itemSeq: '1' }
  }

  return null
}
