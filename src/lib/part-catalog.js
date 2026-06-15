import { STORYBOARD_PARTS } from '@/fixtures/storyboard-parts.js'
import { colorById, colorByName } from '@/fixtures/bricklink-colors-subset.js'
import { PART_COLOR_AVAILABILITY } from '@/fixtures/part-color-availability.js'

function normalizePartId(partId) {
  return String(partId ?? '').trim().toLowerCase()
}

function canonicalPartId(partId) {
  const normalized = normalizePartId(partId)
  if (!normalized) return null
  const match = STORYBOARD_PARTS.find((part) => normalizePartId(part.partId) === normalized)
  return match?.partId ?? null
}

function partOutRow(line) {
  return {
    partId: line.partId,
    name: line.name,
    source: 'part-out',
  }
}

function matchesQuery(part, query) {
  const q = query.toLowerCase()
  return part.partId.toLowerCase().includes(q) || part.name.toLowerCase().includes(q)
}

/**
 * @param {string} query
 * @param {{ session?: object | null }} [options]
 */
export function searchParts(query, options = {}) {
  const session = options.session ?? null
  const partOutLines = session?.partOutLines ?? []
  const q = String(query ?? '').trim().toLowerCase()
  const results = []
  const seen = new Set()

  function addPart(part) {
    const key = normalizePartId(part.partId)
    if (!key || seen.has(key)) return
    seen.add(key)
    results.push(part)
  }

  if (!q) {
    for (const line of partOutLines) {
      addPart(partOutRow(line))
    }
    for (const part of STORYBOARD_PARTS) {
      if (!seen.has(normalizePartId(part.partId))) {
        addPart({ ...part, source: 'catalog' })
      }
    }
    return results
  }

  for (const line of partOutLines) {
    if (matchesQuery(line, q)) {
      addPart(partOutRow(line))
    }
  }

  for (const part of STORYBOARD_PARTS) {
    if (matchesQuery(part, q) && !seen.has(normalizePartId(part.partId))) {
      addPart({ ...part, source: 'catalog' })
    }
  }

  return results
}

/**
 * @param {string} partId
 */
export function lookupPart(partId) {
  const canonical = canonicalPartId(partId)
  if (!canonical) return null
  const part = STORYBOARD_PARTS.find((row) => row.partId === canonical)
  return part ? { partId: part.partId, name: part.name } : null
}

/**
 * @param {string} input
 */
export function resolvePartId(input) {
  const trimmed = String(input ?? '').trim()
  if (!trimmed) return null

  const byId = canonicalPartId(trimmed)
  if (byId) return byId

  const byName = STORYBOARD_PARTS.filter(
    (part) => part.name.toLowerCase() === trimmed.toLowerCase(),
  )
  if (byName.length === 1) return byName[0].partId

  return null
}

function colorIdsFromPartOut(partId, session) {
  const ids = new Set()
  const lines = session?.partOutLines ?? []
  for (const line of lines) {
    if (normalizePartId(line.partId) !== normalizePartId(partId)) continue
    if (line.colorId != null) {
      ids.add(Number(line.colorId))
      continue
    }
    const mapped = colorByName(line.color)
    if (mapped) ids.add(mapped.colorId)
  }
  return ids
}

/**
 * @param {string} partId
 * @param {{ session?: object | null }} [options]
 */
export function getColorsForPart(partId, options = {}) {
  const canonical = canonicalPartId(partId)
  if (!canonical) return []

  const session = options.session ?? null
  const colorIds = colorIdsFromPartOut(canonical, session)
  for (const id of PART_COLOR_AVAILABILITY[canonical] ?? []) {
    colorIds.add(Number(id))
  }

  return [...colorIds]
    .map((colorId) => {
      const color = colorById(colorId)
      if (!color) return null
      return { colorId: color.colorId, name: color.name, hex: color.hex }
    })
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name))
}
