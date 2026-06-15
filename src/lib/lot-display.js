import { BRICKLINK_COLORS_SUBSET } from '@/fixtures/bricklink-colors-subset.js'

const colorById = new Map(
  BRICKLINK_COLORS_SUBSET.map((entry) => [entry.colorId, entry.name]),
)

export function formatLotCondition(condition) {
  if (condition === 'N') return 'New'
  if (condition === 'U') return 'Used'
  return condition ?? '—'
}

export function colorNameForId(colorId) {
  if (colorId == null) return '—'
  const id = Number(colorId)
  return colorById.get(id) ?? '—'
}
