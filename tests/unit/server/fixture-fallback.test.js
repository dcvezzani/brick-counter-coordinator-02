import { describe, expect, it } from 'vitest'
import { getFixturePartOut } from '../../../server/lib/fixture-fallback.js'

describe('fixture-fallback', () => {
  it('returns storyboard fallback lines', () => {
    const result = getFixturePartOut('10281-1')
    expect(result.source).toBe('fixture')
    expect(result.setNumber).toBe('10281-1')
    expect(result.lines.length).toBeGreaterThan(0)
    expect(result.lines[0]).toMatchObject({ partId: expect.any(String), quantity: expect.any(Number) })
  })
})
