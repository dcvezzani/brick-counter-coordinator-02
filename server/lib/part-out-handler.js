import { fetchInvSetEditHtml } from './bricklink-inv-set-edit.js'
import { getFixturePartOut } from './fixture-fallback.js'
import { looksLikeSetNotFound, parseInvSetEditHtml } from './parse-inv-set-edit-html.js'
import { normalizeSetNumber } from './parse-set-number.js'
import { createPartOutRequestLog } from './part-out-request-log.js'

/**
 * @param {string | undefined} value
 * @returns {boolean}
 */
function isTruthyEnv(value) {
  return String(value ?? '').toLowerCase() === 'true'
}

/**
 * @param {string} code
 * @param {string} message
 * @param {number} status
 * @returns {{ status: number, body: { code: string, message: string } }}
 */
function errorResponse(code, message, status) {
  return {
    status,
    body: { code, message },
  }
}

/**
 * Read a request header from Node IncomingMessage or Fetch-style Headers.
 * @param {{ headers?: Record<string, string | string[] | undefined> | { get(name: string): string | null | undefined } }} req
 * @param {string} name
 * @returns {string}
 */
export function getRequestHeader(req, name) {
  const headers = req?.headers
  if (!headers) {
    return ''
  }

  if (typeof headers.get === 'function') {
    return headers.get(name) ?? ''
  }

  const lowerName = name.toLowerCase()
  const key = Object.keys(headers).find((headerName) => headerName.toLowerCase() === lowerName)
  if (!key) {
    return ''
  }

  const value = headers[key]
  if (Array.isArray(value)) {
    return value[0] ?? ''
  }
  return value ?? ''
}

/**
 * @typedef {{ step: (name: string, meta?: Record<string, unknown>) => void, finish: (summary?: Record<string, unknown>) => unknown }} PartOutRequestLog
 */

/**
 * @param {URL} requestUrl
 * @param {{ headers?: Record<string, string | string[] | undefined> | { get(name: string): string | null | undefined } }} req
 * @param {{ fetch?: typeof fetch, partOutFallback?: boolean, log?: PartOutRequestLog }} [options]
 */
export async function handlePartOutRequest(requestUrl, req, options = {}) {
  const setNumberRaw = requestUrl.searchParams.get('setNumber')
  const log = options.log ?? createPartOutRequestLog(setNumberRaw ?? 'unknown')

  log.step('handler_start', { rawSetNumber: setNumberRaw ?? '' })

  const setNumber = normalizeSetNumber(setNumberRaw ?? '')
  log.step('normalize_set', { setNumber })

  if (!setNumber) {
    return errorResponse('INVALID_SET', 'setNumber query parameter is required', 400)
  }

  const cookie = getRequestHeader(req, 'x-bricklink-cookie').trim()
  const allowFallback = options.partOutFallback ?? isTruthyEnv(process.env.PART_OUT_FALLBACK)
  log.step('cookie_check', { hasCookie: Boolean(cookie), fallback: allowFallback })

  if (!cookie) {
    if (allowFallback) {
      log.step('fixture_fallback')
      const body = getFixturePartOut(setNumber)
      return { status: 200, body }
    }
    return errorResponse(
      'AUTH_REQUIRED',
      'BrickLink sign-in required. Paste an updated cookie.',
      401,
    )
  }

  const fetchImpl = options.fetch ?? globalThis.fetch
  log.step('bricklink_fetch_start')
  const upstream = await fetchInvSetEditHtml(setNumber, cookie, {
    fetch: fetchImpl,
    log,
  })

  if (upstream.type === 'timeout') {
    return errorResponse(
      'BRICKLINK_UNAVAILABLE',
      'BrickLink took too long to respond. Try again — large sets can take up to two minutes.',
      503,
    )
  }

  if (upstream.type === 'auth_required') {
    return errorResponse(
      'AUTH_REQUIRED',
      'BrickLink sign-in required. Paste an updated cookie.',
      401,
    )
  }

  if (upstream.type === 'error') {
    return errorResponse('BRICKLINK_ERROR', upstream.message, 502)
  }

  log.step('set_not_found_check', { htmlBytes: upstream.html.length })
  if (looksLikeSetNotFound(upstream.html)) {
    return errorResponse('SET_NOT_FOUND', `Set ${setNumber} was not found on BrickLink.`, 404)
  }

  log.step('parse_html')
  const lines = parseInvSetEditHtml(upstream.html)
  log.step('parse_html_done', { lines: lines.length })

  if (lines.length === 0) {
    return errorResponse('EMPTY_PART_OUT', 'No parts found for this set.', 422)
  }

  log.step('build_response', { lines: lines.length })

  return {
    status: 200,
    body: {
      source: 'bricklink',
      setNumber,
      lines,
    },
  }
}
