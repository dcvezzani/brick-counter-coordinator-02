import { describe, expect, it, vi } from 'vitest'
import { createPartOutRequestLog } from '../../../server/lib/part-out-request-log.js'

describe('part-out-request-log', () => {
  it('records step timings with a shared request id', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const log = createPartOutRequestLog('10281-1')

    log.step('alpha', { foo: 1 })
    const summary = log.finish({ status: 200, code: 'ok' })

    expect(summary.requestId).toHaveLength(8)
    expect(summary.totalMs).toBeGreaterThanOrEqual(0)
    expect(summary.steps).toHaveLength(1)
    expect(logSpy.mock.calls[0][0]).toContain(`part-out[${summary.requestId}] alpha`)
    expect(logSpy.mock.calls[1][0]).toContain(`part-out[${summary.requestId}] complete`)

    logSpy.mockRestore()
  })
})
