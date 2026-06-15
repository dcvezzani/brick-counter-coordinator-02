import {
  getColorById,
  getColorByName,
} from '@/fixtures/bricklink-colors-subset'
import { partColorAvailability } from '@/fixtures/part-color-availability'
import { storyboardParts } from '@/fixtures/storyboard-parts'

function normalizeQuery(query) {
  return String(query ?? '').trim().toLowerCase()
}

function normalizePartId(partId) {
  return String(partId ?? '').trim()
}

function partOutLineColorId(line) {
  if (line.colorId != null && line.colorId !== '') {
    return Number(line.colorId)
  }

  const byName = getColorByName(line.color)
  return byName?.colorId
}

function enrichColor(colorId) {
  const color = getColorById(colorId)
  if (!color) return null

  return {
    colorId: color.colorId,
    name: color.name,
    hex: color.hex,
  }
}

/**
 * @param {string} query
 * @param {{ session?: object | null }} [options]
 */
export function searchParts(query, options = {}) {
  const normalized = normalizeQuery(query)
  const session = options.session ?? null
  const results = []
  const seen = new Set()

  const partOutLines = session?.partOutLines ?? []

  for (const line of partOutLines) {
    const partId = normalizePartId(line.partId)
    if (!partId || seen.has(partId)) continue

    const name = line.name ?? ''
    const matches =
      !normalized ||
      partId.toLowerCase().includes(normalized) ||
      name.toLowerCase().includes(normalized)

    if (!matches) continue

    seen.add(partId)
    results.push({ partId, name, source: 'part-out' })
  }

  for (const part of storyboardParts) {
    if (seen.has(part.partId)) continue

    const matches =
      !normalized ||
      part.partId.toLowerCase().includes(normalized) ||
      part.name.toLowerCase().includes(normalized)

    if (!matches) continue

    seen.add(part.partId)
    results.push({ partId: part.partId, name: part.name, source: 'catalog' })
  }

  return results
}

export function lookupPart(partId) {
  const normalized = normalizePartId(partId)
  if (!normalized) return null

  const catalogPart = storyboardParts.find(
    (part) => part.partId.toLowerCase() === normalized.toLowerCase(),
  )
  if (catalogPart) return { partId: catalogPart.partId, name: catalogPart.name }

  return null
}

export function resolvePartId(input) {
  const normalized = normalizePartId(input)
  if (!normalized) return null

  const exactCatalog = storyboardParts.find(
    (part) => part.partId.toLowerCase() === normalized.toLowerCase(),
  )
  if (exactCatalog) return exactCatalog.partId

  const nameMatches = storyboardParts.filter(
    (part) => part.name.toLowerCase() === normalized.toLowerCase(),
  )
  if (nameMatches.length === 1) return nameMatches[0].partId

  return null
}

/**
 * @param {string} partId
 * @param {{ session?: object | null }} [options]
 */
export function getColorsForPart(partId, options = {}) {
  const normalizedPartId = normalizePartId(partId)
  if (!normalizedPartId) return []

  const session = options.session ?? null
  const colorIds = new Set()

  for (const line of session?.partOutLines ?? []) {
    if (normalizePartId(line.partId) !== normalizedPartId) continue
    const colorId = partOutLineColorId(line)
    if (colorId != null && !Number.isNaN(colorId)) {
      colorIds.add(colorId)
    }
  }

  for (const colorId of partColorAvailability[normalizedPartId] ?? []) {
    colorIds.add(colorId)
  }

  return [...colorIds]
    .map((colorId) => enrichColor(colorId))
    .filter(Boolean)
    .sort((left, right) => left.name.localeCompare(right.name))
}
