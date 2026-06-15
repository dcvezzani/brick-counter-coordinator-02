/**
 * @param {{ swatch?: string, hex?: string } | undefined} color
 * @returns {string}
 */
export function colorSwatch(color) {
  return color?.swatch ?? color?.hex ?? '#cccccc'
}

/**
 * @param {Array<{ colorId: number, name: string, hex?: string }> | null | undefined} catalogRows
 * @returns {Array<{ id: number, name: string, hex?: string }>}
 */
export function toPickerColors(catalogRows) {
  if (!catalogRows?.length) return []

  return catalogRows.map((row) => ({
    id: row.colorId,
    name: row.name,
    hex: row.hex,
  }))
}
