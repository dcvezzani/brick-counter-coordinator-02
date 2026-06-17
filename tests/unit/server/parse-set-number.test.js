import { describe, expect, it } from 'vitest'
import { normalizeSetNumber, parseSetNumberForBrickLink } from '../../../server/lib/parse-set-number.js'

describe('parse-set-number', () => {
  it('normalizes bare digits to variant 1', () => {
    expect(normalizeSetNumber('10281')).toBe('10281-1')
  })

  it('preserves explicit variant', () => {
    expect(normalizeSetNumber('10281-2')).toBe('10281-2')
  })

  it('parses itemNo and itemSeq for BrickLink POST', () => {
    expect(parseSetNumberForBrickLink('10281-1')).toEqual({
      itemNo: '10281',
      itemSeq: '1',
    })
    expect(parseSetNumberForBrickLink('10281')).toEqual({
      itemNo: '10281',
      itemSeq: '1',
    })
    expect(parseSetNumberForBrickLink('10281-2')).toEqual({
      itemNo: '10281',
      itemSeq: '2',
    })
  })
})
