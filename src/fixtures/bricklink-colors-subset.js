/** @type {Array<{ colorId: number, name: string, hex: string }>} */
export const bricklinkColorsSubset = [
  { colorId: 1, name: 'Blue', hex: '#0055BF' },
  { colorId: 5, name: 'Red', hex: '#C91A09' },
  { colorId: 11, name: 'Black', hex: '#05131D' },
]

const colorsById = new Map(
  bricklinkColorsSubset.map((color) => [color.colorId, color]),
)

const colorsByName = new Map(
  bricklinkColorsSubset.map((color) => [color.name.toLowerCase(), color]),
)

export function getColorById(colorId) {
  const normalized = Number(colorId)
  if (Number.isNaN(normalized)) return undefined
  return colorsById.get(normalized)
}

export function getColorByName(name) {
  return colorsByName.get(String(name ?? '').trim().toLowerCase())
}
