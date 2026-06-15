import { describe, expect, it } from 'vitest'
import {
  defaultContainsFilter,
  defaultPrefixFilter,
  findPickerOption,
} from '@/lib/filterable-picker'

const sampleOptions = [
  { value: 1, label: 'Blue' },
  { value: 5, label: 'Red' },
  { value: 11, label: 'Black' },
]

describe('filterable-picker helpers', () => {
  it('defaultPrefixFilter returns all options for empty query', () => {
    expect(defaultPrefixFilter(sampleOptions, '')).toEqual(sampleOptions)
  })

  it('defaultPrefixFilter matches label prefix', () => {
    expect(defaultPrefixFilter(sampleOptions, 'bl')).toEqual([
      { value: 1, label: 'Blue' },
      { value: 11, label: 'Black' },
    ])
  })

  it('defaultContainsFilter matches substring in label', () => {
    expect(defaultContainsFilter(sampleOptions, 'ack')).toEqual([
      { value: 11, label: 'Black' },
    ])
  })

  it('findPickerOption returns undefined for empty value', () => {
    expect(findPickerOption(sampleOptions, null)).toBeUndefined()
    expect(findPickerOption(sampleOptions, '')).toBeUndefined()
  })

  it('findPickerOption finds matching option', () => {
    expect(findPickerOption(sampleOptions, 5)).toEqual({
      value: 5,
      label: 'Red',
    })
  })
})
