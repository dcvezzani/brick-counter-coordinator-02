import { describe, expect, it } from 'vitest'
import { createDemoSessionSeed } from '@/fixtures/demo-session.js'
import {
  getColorsForPart,
  lookupPart,
  resolvePartId,
  searchParts,
} from '@/lib/part-catalog.js'

describe('part-catalog', () => {
  const session = createDemoSessionSeed()

  describe('searchParts', () => {
    it('lists part-out hit first when query matches partId', () => {
      const results = searchParts('3023', { session })

      expect(results[0]).toEqual({
        partId: '3023',
        name: 'Plate 1×2',
        source: 'part-out',
      })
    })

    it('returns catalog-only part with source catalog after part-out section', () => {
      const results = searchParts('3003', { session })

      expect(results).toHaveLength(1)
      expect(results[0]).toEqual({
        partId: '3003',
        name: 'Brick 2×2',
        source: 'catalog',
      })
    })

    it('dedupes multiple part-out lines sharing the same partId', () => {
      const duplicateSession = {
        ...session,
        partOutLines: [
          ...session.partOutLines,
          {
            id: 'po-dup',
            partId: '3001',
            name: 'Brick 2×4',
            color: 'Red',
            colorId: 5,
            quantity: 2,
          },
        ],
      }

      const results = searchParts('3001', { session: duplicateSession })

      expect(results.filter((row) => row.partId === '3001')).toHaveLength(1)
      expect(results[0].source).toBe('part-out')
    })

    it('returns all part-out parts then catalog extras for empty query', () => {
      const results = searchParts('', { session })
      const partIds = results.map((row) => row.partId)

      expect(partIds.slice(0, 4)).toEqual(['3001', '3023', '3069b', '3710'])
      expect(partIds).toContain('3003')
      expect(results.find((row) => row.partId === '3003')?.source).toBe('catalog')
    })

    it('matches name substring case-insensitively', () => {
      const results = searchParts('plate', { session })

      expect(results.some((row) => row.partId === '3023')).toBe(true)
      expect(results.some((row) => row.partId === '3710')).toBe(true)
    })
  })

  describe('lookupPart / resolvePartId', () => {
    it('round-trips partId for demo fixture parts', () => {
      for (const partId of ['3001', '3069b']) {
        const part = lookupPart(partId)
        expect(part).toEqual({
          partId,
          name: expect.any(String),
        })
        expect(resolvePartId(partId)).toBe(partId)
        expect(resolvePartId(part?.name ?? '')).toBe(partId)
      }
    })

    it('resolves partId case-insensitively', () => {
      expect(resolvePartId('3069B')).toBe('3069b')
      expect(lookupPart('3069B')).toEqual({
        partId: '3069b',
        name: 'Tile 1×2',
      })
    })

    it('returns null when input does not uniquely resolve', () => {
      expect(resolvePartId('Brick')).toBeNull()
      expect(lookupPart('unknown-part')).toBeNull()
    })
  })

  describe('getColorsForPart', () => {
    it('returns numeric colorId with name and hex from subset and availability', () => {
      const colors = getColorsForPart('3001', { session })
      const red = colors.find((color) => color.colorId === 5)
      const blue = colors.find((color) => color.colorId === 1)

      expect(red).toEqual({
        colorId: 5,
        name: 'Red',
        hex: '#C91A09',
      })
      expect(blue).toEqual({
        colorId: 1,
        name: 'Blue',
        hex: '#0055BF',
      })
      expect(colors.map((color) => color.name)).toEqual([...colors.map((c) => c.name)].sort())
    })

    it('returns empty array for unknown part', () => {
      expect(getColorsForPart('99999', { session })).toEqual([])
    })

    it('coerces string colorId from part-out lines', () => {
      const lineSession = {
        ...session,
        partOutLines: [
          {
            id: 'po-str',
            partId: '3023',
            name: 'Plate 1×2',
            color: 'Blue',
            colorId: '1',
            quantity: 1,
          },
        ],
      }

      const colors = getColorsForPart('3023', { session: lineSession })
      expect(colors.some((color) => color.colorId === 1)).toBe(true)
    })
  })
})
