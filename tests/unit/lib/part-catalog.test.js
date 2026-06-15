import { describe, expect, it } from 'vitest'
import { createDemoSessionSeed } from '@/fixtures/demo-session'
import { getColorsForPart } from '@/lib/part-catalog'

describe('part-catalog getColorsForPart', () => {
  it('returns Red for part 3001 with session colors and availability', () => {
    const session = createDemoSessionSeed()
    const colors = getColorsForPart('3001', { session })

    expect(colors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ colorId: 5, name: 'Red', hex: '#C91A09' }),
        expect.objectContaining({ colorId: 1, name: 'Blue', hex: '#0055BF' }),
      ]),
    )
  })
})
