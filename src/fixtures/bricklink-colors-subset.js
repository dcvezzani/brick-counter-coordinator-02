/** Minimal BrickLink color ids for storyboard fixtures. */
export const BRICKLINK_COLORS = [
  { colorId: 1, name: 'Blue', hex: '#0055BF' },
  { colorId: 5, name: 'Red', hex: '#C91A09' },
  { colorId: 11, name: 'Black', hex: '#05131D' },
]

const BY_NAME = new Map(BRICKLINK_COLORS.map((color) => [color.name.toLowerCase(), color]))

export function colorByName(name) {
  return BY_NAME.get(String(name ?? '').toLowerCase()) ?? null
}

export function colorById(colorId) {
  const id = Number(colorId)
  return BRICKLINK_COLORS.find((color) => color.colorId === id) ?? null
}
