import { describe, expect, it } from 'vitest'
import { colorSwatch, toPickerColors } from '@/lib/bricklink-colors'

describe('bricklink-colors', () => {
  it('colorSwatch returns fallback gray when color is missing', () => {
    expect(colorSwatch(undefined)).toBe('#cccccc')
    expect(colorSwatch({})).toBe('#cccccc')
  })

  it('colorSwatch prefers swatch then hex', () => {
    expect(colorSwatch({ swatch: '#111111', hex: '#222222' })).toBe('#111111')
    expect(colorSwatch({ hex: '#222222' })).toBe('#222222')
  })

  it('toPickerColors maps catalog rows to picker shape', () => {
    expect(
      toPickerColors([
        { colorId: 5, name: 'Red', hex: '#C91A09' },
        { colorId: 1, name: 'Blue' },
      ]),
    ).toEqual([
      { id: 5, name: 'Red', hex: '#C91A09' },
      { id: 1, name: 'Blue', hex: undefined },
    ])
  })

  it('toPickerColors returns empty array for nullish input', () => {
    expect(toPickerColors(null)).toEqual([])
    expect(toPickerColors(undefined)).toEqual([])
    expect(toPickerColors([])).toEqual([])
  })
})
