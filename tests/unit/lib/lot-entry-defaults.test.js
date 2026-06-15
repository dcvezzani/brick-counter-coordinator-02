import { describe, expect, it } from 'vitest'
import {
  CONDITION_OPTIONS,
  LOT_CONDITION,
  PART_OUT_CONDITION_MODE,
  conditionDisplayLabel,
  getPartOutConditionMode,
  isConditionChoosable,
  isConditionReadOnly,
  resolveDefaultLotCondition,
} from '@/lib/lot-entry-defaults.js'

describe('lot-entry-defaults', () => {
  describe('getPartOutConditionMode', () => {
    it('returns new, used, or mixed from seed', () => {
      expect(getPartOutConditionMode({ partOutOptions: { condition: 'new' } })).toBe('new')
      expect(getPartOutConditionMode({ partOutOptions: { condition: 'used' } })).toBe('used')
      expect(getPartOutConditionMode({ partOutOptions: { condition: 'mixed' } })).toBe('mixed')
    })

    it('defaults missing partOutOptions to mixed', () => {
      expect(getPartOutConditionMode({})).toBe('mixed')
      expect(getPartOutConditionMode({ partOutOptions: {} })).toBe('mixed')
    })

    it('normalizes invalid condition to mixed', () => {
      expect(getPartOutConditionMode({ partOutOptions: { condition: 'bogus' } })).toBe('mixed')
    })
  })

  describe('resolveDefaultLotCondition', () => {
    it('all-new part-out defaults to New', () => {
      const session = { partOutOptions: { condition: 'new' } }
      expect(resolveDefaultLotCondition(session)).toBe('N')
      expect(isConditionReadOnly(session)).toBe(true)
      expect(isConditionChoosable(session)).toBe(false)
    })

    it('all-used part-out defaults to Used and is read-only', () => {
      const session = { partOutOptions: { condition: 'used' } }
      expect(resolveDefaultLotCondition(session)).toBe('U')
      expect(isConditionReadOnly(session)).toBe(true)
      expect(isConditionChoosable(session)).toBe(false)
    })

    it('mixed session allows choice with Used initial default', () => {
      const session = { partOutOptions: { condition: 'mixed' } }
      expect(isConditionChoosable(session)).toBe(true)
      expect(isConditionReadOnly(session)).toBe(false)
      expect(resolveDefaultLotCondition(session)).toBe('U')
    })
  })

  describe('conditionDisplayLabel', () => {
    it('maps N and U to display labels', () => {
      expect(conditionDisplayLabel('N')).toBe('New')
      expect(conditionDisplayLabel('U')).toBe('Used')
    })

    it('falls back to Used for unknown values', () => {
      expect(conditionDisplayLabel('X')).toBe('Used')
    })
  })

  describe('exports', () => {
    it('exposes lot condition constants', () => {
      expect(LOT_CONDITION).toEqual({ NEW: 'N', USED: 'U' })
      expect(PART_OUT_CONDITION_MODE).toEqual({
        NEW: 'new',
        USED: 'used',
        MIXED: 'mixed',
      })
    })

    it('exposes CONDITION_OPTIONS for form controls', () => {
      expect(CONDITION_OPTIONS).toEqual([
        { value: 'N', label: 'New' },
        { value: 'U', label: 'Used' },
      ])
    })
  })
})
