import { randomUUID } from 'node:crypto'

/**
 * @param {Record<string, unknown>} meta
 * @returns {string}
 */
function formatMeta(meta) {
  const parts = Object.entries(meta)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${key}=${value}`)
  return parts.length ? ` ${parts.join(' ')}` : ''
}

/**
 * Structured per-request timing log for part-out API diagnostics.
 * Never pass cookie values or other secrets in meta.
 *
 * @param {string} setNumber
 */
export function createPartOutRequestLog(setNumber) {
  const requestId = randomUUID().slice(0, 8)
  const startedAt = performance.now()
  let lastMark = startedAt
  /** @type {Array<{ step: string, ms: number, totalMs: number }>} */
  const steps = []

  /**
   * @param {string} name
   * @param {Record<string, unknown>} [meta]
   */
  function step(name, meta = {}) {
    const now = performance.now()
    const entry = {
      step: name,
      ms: Math.round(now - lastMark),
      totalMs: Math.round(now - startedAt),
    }
    steps.push(entry)
    lastMark = now
    console.log(
      `part-out[${requestId}] ${name} +${entry.ms}ms total=${entry.totalMs}ms setNumber=${setNumber}${formatMeta(meta)}`,
    )
  }

  /**
   * @param {Record<string, unknown>} [summary]
   */
  function finish(summary = {}) {
    const totalMs = Math.round(performance.now() - startedAt)
    console.log(
      `part-out[${requestId}] complete totalMs=${totalMs} setNumber=${setNumber}${formatMeta(summary)}`,
    )
    return { requestId, totalMs, steps }
  }

  return { requestId, step, finish }
}
