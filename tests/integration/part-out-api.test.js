import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it, vi } from 'vitest'
import { handlePartOutRequest } from '../../server/lib/part-out-handler.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '../..')

function readSnippetHtml() {
  return readFileSync(path.join(repoRoot, 'server/fixtures/inv-set-edit-snippet.html'), 'utf8')
}

function mockRequest(headers = {}) {
  return {
    headers: {
      get(name) {
        const key = Object.keys(headers).find((h) => h.toLowerCase() === name.toLowerCase())
        return key ? headers[key] : null
      },
    },
  }
}

describe('part-out API handler', () => {
  it('returns AUTH_REQUIRED when cookie is missing and fallback is off', async () => {
    const url = new URL('http://127.0.0.1/api/part-out?setNumber=10281-1')
    const result = await handlePartOutRequest(url, mockRequest(), { partOutFallback: false })

    expect(result.status).toBe(401)
    expect(result.body.code).toBe('AUTH_REQUIRED')
  })

  it('reads x-bricklink-cookie from Node-style plain headers', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      status: 200,
      ok: true,
      text: async () => readSnippetHtml(),
    })

    const url = new URL('http://127.0.0.1/api/part-out?setNumber=10281-1')
    const result = await handlePartOutRequest(
      url,
      { headers: { 'x-bricklink-cookie': 'session=abc' } },
      { fetch: fetchMock, partOutFallback: false },
    )

    expect(result.status).toBe(200)
    expect(fetchMock).toHaveBeenCalled()
  })

  it('returns fixture data when cookie is missing and fallback is on', async () => {
    const url = new URL('http://127.0.0.1/api/part-out?setNumber=10281-1')
    const result = await handlePartOutRequest(url, mockRequest(), { partOutFallback: true })

    expect(result.status).toBe(200)
    expect(result.body.source).toBe('fixture')
    expect(result.body.lines.length).toBeGreaterThan(0)
  })

  it('parses BrickLink HTML when upstream succeeds', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      status: 200,
      ok: true,
      text: async () => readSnippetHtml(),
    })

    const url = new URL('http://127.0.0.1/api/part-out?setNumber=10281-1')
    const result = await handlePartOutRequest(url, mockRequest({ 'x-bricklink-cookie': 'session=abc' }), {
      fetch: fetchMock,
      partOutFallback: false,
    })

    expect(result.status).toBe(200)
    expect(result.body.source).toBe('bricklink')
    expect(result.body.lines).toHaveLength(3)
  })

  it('maps upstream timeout to BRICKLINK_UNAVAILABLE', async () => {
    const fetchMock = vi.fn().mockRejectedValue(
      Object.assign(new Error('The operation was aborted'), { name: 'TimeoutError' }),
    )

    const url = new URL('http://127.0.0.1/api/part-out?setNumber=10281-1')
    const result = await handlePartOutRequest(url, mockRequest({ 'x-bricklink-cookie': 'session=abc' }), {
      fetch: fetchMock,
      partOutFallback: false,
    })

    expect(result.status).toBe(503)
    expect(result.body.code).toBe('BRICKLINK_UNAVAILABLE')
  })

  it('maps upstream 302 to AUTH_REQUIRED', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      status: 302,
      ok: false,
      text: async () => '',
    })

    const url = new URL('http://127.0.0.1/api/part-out?setNumber=10281-1')
    const result = await handlePartOutRequest(url, mockRequest({ 'x-bricklink-cookie': 'session=abc' }), {
      fetch: fetchMock,
      partOutFallback: false,
    })

    expect(result.status).toBe(401)
    expect(result.body.code).toBe('AUTH_REQUIRED')
  })
})
