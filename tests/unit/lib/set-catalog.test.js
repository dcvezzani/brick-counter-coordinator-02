import { describe, expect, it } from 'vitest'
import {
  lookupSet,
  normalizeSetNumber,
  resolveSetNumber,
  searchSets,
} from '@/lib/set-catalog'

describe('set-catalog', () => {
  describe('normalizeSetNumber', () => {
    it('appends -1 to bare digits', () => {
      expect(normalizeSetNumber(' 10281 ')).toBe('10281-1')
    })

    it('preserves explicit variant suffix', () => {
      expect(normalizeSetNumber('10281-2')).toBe('10281-2')
    })

    it('returns empty string for empty input', () => {
      expect(normalizeSetNumber('')).toBe('')
      expect(normalizeSetNumber('   ')).toBe('')
    })
  })

  describe('searchSets', () => {
    it('returns all sets for empty query', () => {
      expect(searchSets('')).toHaveLength(6)
    })

    it('filters by set number fragment', () => {
      const results = searchSets('21309')
      expect(results.map((set) => set.setNumber)).toEqual(['21309-1'])
    })

    it('filters by name fragment', () => {
      const results = searchSets('bonsai')
      expect(results.map((set) => set.setNumber)).toEqual(['10281-1', '10281-2'])
    })
  })

  describe('lookupSet', () => {
    it('finds catalog entry by normalized id', () => {
      expect(lookupSet('10281-1')).toEqual({
        setNumber: '10281-1',
        name: 'Bonsai Tree',
      })
    })

    it('returns null for unknown set', () => {
      expect(lookupSet('99999-1')).toBeNull()
    })
  })

  describe('resolveSetNumber', () => {
    it('normalizes bare digits before lookup', () => {
      expect(resolveSetNumber('10281')).toBe('10281-1')
    })

    it('returns null for unknown set', () => {
      expect(resolveSetNumber('unknown')).toBeNull()
    })
  })
})
