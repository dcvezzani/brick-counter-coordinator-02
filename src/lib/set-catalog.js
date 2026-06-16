import { STORYBOARD_SETS } from '@/fixtures/storyboard-sets.js'

function asString(value) {
  return typeof value === 'string' ? value : ''
}

function normalizeQuery(query) {
  return asString(query).trim().toLowerCase()
}

function findCatalogSet(setNumber) {
  const normalized = normalizeSetNumber(setNumber)
  if (!normalized) {
    return null
  }
  return STORYBOARD_SETS.find((set) => set.setNumber === normalized) ?? null
}

/**
 * Trim; bare digits → `{digits}-1`; `{digits}-{variant}` preserved.
 * @param {string} input
 * @returns {string}
 */
export function normalizeSetNumber(input) {
  const text = asString(input).trim()
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
 * @param {string} query
 * @returns {Array<{ setNumber: string, name: string }>}
 */
export function searchSets(query) {
  const normalizedQuery = normalizeQuery(query)
  return STORYBOARD_SETS.filter((set) => {
    if (!normalizedQuery) {
      return true
    }
    return (
      set.setNumber.toLowerCase().includes(normalizedQuery) ||
      set.name.toLowerCase().includes(normalizedQuery)
    )
  })
}

/**
 * @param {string} setNumber
 * @returns {{ setNumber: string, name: string } | null}
 */
export function lookupSet(setNumber) {
  return findCatalogSet(setNumber)
}

/**
 * @param {string} input
 * @returns {string | null}
 */
export function resolveSetNumber(input) {
  const normalized = normalizeSetNumber(input)
  if (!normalized) {
    return null
  }
  return findCatalogSet(normalized)?.setNumber ?? null
}
