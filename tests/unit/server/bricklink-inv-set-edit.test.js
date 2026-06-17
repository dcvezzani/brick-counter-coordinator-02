import { describe, expect, it, vi } from 'vitest'
import { buildInvSetEditBody } from '../../../server/lib/bricklink-inv-set-edit.js'
import { fetchInvSetEditHtml } from '../../../server/lib/bricklink-inv-set-edit.js'

describe('bricklink-inv-set-edit', () => {
  it('builds POST body with incInstr=N and incParts=N', () => {
    const body = buildInvSetEditBody({ itemNo: '10281', itemSeq: '1' })
    const params = new URLSearchParams(body)

    expect(params.get('itemNo')).toBe('10281')
    expect(params.get('itemSeq')).toBe('1')
    expect(params.get('incInstr')).toBe('N')
    expect(params.get('incParts')).toBe('N')
  })

  it('treats BrickLink 302 as auth required', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      status: 302,
      ok: false,
      text: async () => '',
    })

    const result = await fetchInvSetEditHtml('10281-1', 'session=abc', { fetch: fetchMock })
    expect(result).toEqual({ type: 'auth_required' })
    expect(fetchMock.mock.calls[0][1].redirect).toBe('manual')
  })

  it('treats fetch timeout as timeout result', async () => {
    const fetchMock = vi.fn().mockRejectedValue(
      Object.assign(new Error('The operation was aborted'), { name: 'TimeoutError' }),
    )

    const result = await fetchInvSetEditHtml('10281-1', 'session=abc', { fetch: fetchMock })
    expect(result).toEqual({ type: 'timeout' })
  })
})
