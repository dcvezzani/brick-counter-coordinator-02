import { PART_OUT_FALLBACK_LINES } from '../../src/fixtures/part-out-fallback.js'

/**
 * @param {string} setNumber
 * @returns {{ source: 'fixture', setNumber: string, lines: typeof PART_OUT_FALLBACK_LINES }}
 */
export function getFixturePartOut(setNumber) {
  return {
    source: 'fixture',
    setNumber,
    lines: PART_OUT_FALLBACK_LINES.map((line) => ({ ...line })),
  }
}
