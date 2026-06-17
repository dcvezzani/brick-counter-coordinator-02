import { createServer } from 'node:http'
import { handlePartOutRequest } from './lib/part-out-handler.js'
import { createPartOutRequestLog } from './lib/part-out-request-log.js'

const apiPort = Number(process.env.API_PORT || process.env.AIDLC_API_PORT || 3001)
const appOrigin = process.env.AIDLC_APP_URL ?? `http://localhost:${process.env.PORT || process.env.AIDLC_APP_PORT || 5173}`

/**
 * @param {import('node:http').IncomingMessage} req
 * @param {import('node:http').ServerResponse} res
 * @param {{ status: number, body: unknown }} result
 * @param {{ step: (name: string, meta?: Record<string, unknown>) => void, finish: (summary?: Record<string, unknown>) => unknown }} log
 */
function sendJson(res, result, log) {
  const serializeStartedAt = performance.now()
  const payload = JSON.stringify(result.body)
  log.step('json_serialize', {
    status: result.status,
    payloadBytes: Buffer.byteLength(payload, 'utf8'),
    serializeMs: Math.round(performance.now() - serializeStartedAt),
  })

  res.writeHead(result.status, {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': appOrigin,
    'access-control-allow-headers': 'content-type, x-bricklink-cookie',
    'access-control-allow-methods': 'GET, OPTIONS',
  })
  res.end(payload)
}

/**
 * @param {unknown} body
 */
function summarizeResult(status, body) {
  if (!body || typeof body !== 'object') {
    return { status, code: 'unknown' }
  }
  const record = /** @type {Record<string, unknown>} */ (body)
  const summary = {
    status,
    code: typeof record.code === 'string' ? record.code : 'ok',
  }
  if (typeof record.source === 'string') {
    summary.source = record.source
  }
  if (Array.isArray(record.lines)) {
    summary.lines = record.lines.length
  }
  return summary
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://127.0.0.1:${apiPort}`)

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'access-control-allow-origin': appOrigin,
      'access-control-allow-headers': 'content-type, x-bricklink-cookie',
      'access-control-allow-methods': 'GET, OPTIONS',
    })
    res.end()
    return
  }

  if (req.method === 'GET' && url.pathname === '/api/health') {
    sendJson(res, { status: 200, body: { ok: true } })
    return
  }

  if (req.method === 'GET' && url.pathname === '/api/part-out') {
    const setNumber = url.searchParams.get('setNumber') ?? 'unknown'
    const log = createPartOutRequestLog(setNumber)
    log.step('http_request_received', { method: req.method, path: url.pathname })

    try {
      const result = await handlePartOutRequest(url, req, { log })
      sendJson(res, result, log)
      log.step('http_response_sent', { status: result.status })
      log.finish(summarizeResult(result.status, result.body))
    } catch (error) {
      log.step('handler_threw', { error: error instanceof Error ? error.message : String(error) })
      const result = {
        status: 503,
        body: {
          code: 'BRICKLINK_UNAVAILABLE',
          message: 'Part-out service is temporarily unavailable.',
        },
      }
      sendJson(res, result, log)
      log.finish({ ...summarizeResult(result.status, result.body), reason: 'exception' })
    }
    return
  }

  sendJson(res, { status: 404, body: { code: 'NOT_FOUND', message: 'Not found' } })
})

server.listen(apiPort, '127.0.0.1', () => {
  console.log(`part-out API listening on http://127.0.0.1:${apiPort}`)
})
