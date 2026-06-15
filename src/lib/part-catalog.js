import { BRICKLINK_COLORS_SUBSET } from '@/fixtures/bricklink-colors-subset.js'
import { PART_COLOR_AVAILABILITY } from '@/fixtures/part-color-availability.js'
import { STORYBOARD_PARTS } from '@/fixtures/storyboard-parts.js'

function asString(value) {
  return typeof value === 'string' ? value : ''
}

function normalizePartId(partId) {
  return asString(partId).toLowerCase()
}

function normalizeQuery(query) {
  return asString(query).trim().toLowerCase()
}

function findCatalogPart(partId) {
  const normalized = normalizePartId(partId)
  return STORYBOARD_PARTS.find((part) => normalizePartId(part.partId) === normalized) ?? null
}

function matchesPartQuery(part, normalizedQuery) {
  if (!normalizedQuery) {
    return true
  }

  return (
    normalizePartId(part.partId).includes(normalizedQuery) ||
    part.name.toLowerCase().includes(normalizedQuery)
  )
}

function matchesPartOutLine(line, normalizedQuery) {
  if (!normalizedQuery) {
    return true
  }

  return (
    normalizePartId(line.partId).includes(normalizedQuery) ||
    asString(line.name).toLowerCase().includes(normalizedQuery)
  )
}

function toColorId(value) {
  if (value == null || value === '') {
    return null
  }

  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : null
}

function colorById(colorId) {
  return BRICKLINK_COLORS_SUBSET.find((entry) => entry.colorId === colorId) ?? null
}

function colorIdFromName(colorName) {
  const normalized = asString(colorName).toLowerCase()
  const match = BRICKLINK_COLORS_SUBSET.find(
    (entry) => entry.name.toLowerCase() === normalized,
  )
  return match?.colorId ?? null
}

function enrichColor(colorId) {
  const subset = colorById(colorId)
  if (!subset) {
    return null
  }

  return {
    colorId: subset.colorId,
    name: subset.name,
    hex: subset.hex,
  }
}

function canonicalPartId(partId) {
  return findCatalogPart(partId)?.partId ?? asString(partId)
}

/**
 * @param {string} query
 * @param {{ session?: object | null }} [options]
 * @returns {Array<{ partId: string, name: string, source: 'part-out' | 'catalog' }>}
 */
export function searchParts(query, options = {}) {
  const normalizedQuery = normalizeQuery(query)
  const session = options.session ?? null
  const partOutLines = session?.partOutLines ?? []
  const results = []
  const seenPartIds = new Set()

  for (const line of partOutLines) {
    if (!matchesPartOutLine(line, normalizedQuery)) {
      continue
    }

    const partId = canonicalPartId(line.partId)
    const normalizedPartId = normalizePartId(partId)
    if (seenPartIds.has(normalizedPartId)) {
      continue
    }

    seenPartIds.add(normalizedPartId)
    results.push({
      partId,
      name: line.name ?? findCatalogPart(partId)?.name ?? partId,
      source: 'part-out',
    })
  }

  for (const part of STORYBOARD_PARTS) {
    if (!matchesPartQuery(part, normalizedQuery)) {
      continue
    }

    const normalizedPartId = normalizePartId(part.partId)
    if (seenPartIds.has(normalizedPartId)) {
      continue
    }

    seenPartIds.add(normalizedPartId)
    results.push({
      partId: part.partId,
      name: part.name,
      source: 'catalog',
    })
  }

  return results
}

/**
 * @param {string} partId
 * @returns {{ partId: string, name: string } | null}
 */
export function lookupPart(partId) {
  const catalogPart = findCatalogPart(partId)
  if (catalogPart) {
    return { partId: catalogPart.partId, name: catalogPart.name }
  }

  return null
}

/**
 * @param {string} input
 * @returns {string | null}
 */
export function resolvePartId(input) {
  const text = asString(input).trim()
  if (!text) {
    return null
  }

  const byId = findCatalogPart(text)
  if (byId) {
    return byId.partId
  }

  const normalizedInput = text.toLowerCase()
  const nameMatches = STORYBOARD_PARTS.filter(
    (part) => part.name.toLowerCase() === normalizedInput,
  )

  if (nameMatches.length === 1) {
    return nameMatches[0].partId
  }

  return null
}

/**
 * @param {string} partId
 * @param {{ session?: object | null }} [options]
 * @returns {Array<{ colorId: number, name: string, hex?: string }>}
 */
export function getColorsForPart(partId, options = {}) {
  const catalogPart = findCatalogPart(partId)
  if (!catalogPart) {
    return []
  }

  const session = options.session ?? null
  const partOutLines = session?.partOutLines ?? []
  const normalizedPartId = normalizePartId(catalogPart.partId)
  const colorIds = new Set()

  for (const line of partOutLines) {
    if (normalizePartId(line.partId) !== normalizedPartId) {
      continue
    }

    const fromLine = toColorId(line.colorId) ?? colorIdFromName(line.color)
    if (fromLine != null) {
      colorIds.add(fromLine)
    }
  }

  const availability = PART_COLOR_AVAILABILITY[catalogPart.partId] ?? []
  for (const colorId of availability) {
    colorIds.add(colorId)
  }

  return [...colorIds]
    .map((colorId) => enrichColor(colorId))
    .filter((entry) => entry != null)
    .sort((left, right) => left.name.localeCompare(right.name))
}
