import { getBrickLinkCookie } from '@/lib/bricklink-auth.js'

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api'
const CLIENT_TIMEOUT_MS = Number(import.meta.env.VITE_PART_OUT_TIMEOUT_MS) || 130_000

/**
 * @param {Response} res
 * @param {{ code?: string }} body
 */
function isAuthRequiredResponse(res, body) {
  return res.status === 401 || res.status === 302 || body?.code === 'AUTH_REQUIRED'
}

/**
 * @param {string} setNumber
 * @returns {Promise<
 *   | { ok: true, lines: Array<Record<string, unknown>>, source: string }
 *   | { ok: false, code: string, message: string }
 * >}
 */
export async function fetchPartOutLines(setNumber) {
  let res
  try {
    res = await fetch(`${API_BASE}/part-out?setNumber=${encodeURIComponent(setNumber)}`, {
      headers: {
        'X-BrickLink-Cookie': getBrickLinkCookie(),
      },
      redirect: 'manual',
      signal: AbortSignal.timeout(CLIENT_TIMEOUT_MS),
    })
  } catch (error) {
    if (error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError')) {
      return {
        ok: false,
        code: 'BRICKLINK_UNAVAILABLE',
        message:
          'Part-out load timed out. BrickLink can be slow for large sets — wait a moment and tap Retry.',
      }
    }
    return {
      ok: false,
      code: 'BRICKLINK_UNAVAILABLE',
      message: 'Could not reach the part-out service. Is the API server running?',
    }
  }

  const body = await res.json().catch(() => ({}))

  if (isAuthRequiredResponse(res, body)) {
    return {
      ok: false,
      code: 'AUTH_REQUIRED',
      message: body.message ?? 'BrickLink sign-in required. Paste an updated cookie.',
    }
  }

  if (!res.ok) {
    return {
      ok: false,
      code: body.code ?? 'BRICKLINK_ERROR',
      message: body.message ?? 'Failed to load part-out list.',
    }
  }

  return {
    ok: true,
    lines: body.lines ?? [],
    source: body.source ?? 'bricklink',
  }
}
