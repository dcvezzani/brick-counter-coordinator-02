import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchPartOutLines } from '@/lib/part-out-client.js'
import { saveBrickLinkCookie, clearBrickLinkCookie } from '@/lib/bricklink-auth.js'

describe('part-out-client', () => {
  beforeEach(() => {
    clearBrickLinkCookie()
    vi.restoreAllMocks()
  })

  it('maps 401 to AUTH_REQUIRED', async () => {
    saveBrickLinkCookie('session=abc')
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        status: 401,
        ok: false,
        json: async () => ({ code: 'AUTH_REQUIRED', message: 'Sign in required' }),
      }),
    )

    const result = await fetchPartOutLines('10281-1')
    expect(result).toEqual({
      ok: false,
      code: 'AUTH_REQUIRED',
      message: 'Sign in required',
    })
    expect(fetch).toHaveBeenCalledWith(
      '/api/part-out?setNumber=10281-1',
      expect.objectContaining({
        redirect: 'manual',
        headers: { 'X-BrickLink-Cookie': 'session=abc' },
      }),
    )
  })

  it('maps 302 to AUTH_REQUIRED', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        status: 302,
        ok: false,
        json: async () => ({}),
      }),
    )

    const result = await fetchPartOutLines('10281-1')
    expect(result.ok).toBe(false)
    expect(result.code).toBe('AUTH_REQUIRED')
  })

  it('returns lines on success', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        status: 200,
        ok: true,
        json: async () => ({
          source: 'bricklink',
          lines: [{ id: 'po-0', partId: '3001', quantity: 1 }],
        }),
      }),
    )

    const result = await fetchPartOutLines('10281-1')
    expect(result.ok).toBe(true)
    expect(result.lines).toHaveLength(1)
    expect(result.source).toBe('bricklink')
  })
})
