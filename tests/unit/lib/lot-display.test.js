import { describe, expect, it } from 'vitest'
import { colorNameForId, formatLotCondition } from '@/lib/lot-display.js'

describe('formatLotCondition', () => {
  it('maps N and U to New and Used', () => {
    expect(formatLotCondition('N')).toBe('New')
    expect(formatLotCondition('U')).toBe('Used')
  })

  it('returns em dash for unknown or missing condition', () => {
    expect(formatLotCondition(null)).toBe('—')
    expect(formatLotCondition('X')).toBe('X')
  })
})

describe('colorNameForId', () => {
  it('resolves demo fixture color ids to names', () => {
    expect(colorNameForId(5)).toBe('Red')
    expect(colorNameForId(1)).toBe('Blue')
    expect(colorNameForId(11)).toBe('Black')
  })

  it('returns em dash for unknown color id', () => {
    expect(colorNameForId(999)).toBe('—')
    expect(colorNameForId(null)).toBe('—')
  })
})
