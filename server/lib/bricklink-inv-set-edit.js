import { parseSetNumberForBrickLink } from './parse-set-number.js'

const BRICKLINK_URL = 'https://www.bricklink.com/invSetEdit.asp'
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36'
const DEFAULT_TIMEOUT_MS = Number(process.env.BRICKLINK_FETCH_TIMEOUT_MS) || 120_000

/**
 * @param {unknown} error
 * @returns {boolean}
 */
export function isFetchTimeoutError(error) {
  if (!error || typeof error !== 'object') {
    return false
  }
  const name = 'name' in error ? String(error.name) : ''
  const code = 'code' in error ? String(error.code) : ''
  return name === 'TimeoutError' || name === 'AbortError' || code === 'ABORT_ERR'
}

/**
 * @param {{ itemNo: string, itemSeq: string }} parsed
 * @returns {string}
 */
export function buildInvSetEditBody(parsed) {
  const params = new URLSearchParams({
    itemType: 'S',
    sellerOptionCost: '',
    sellerOptionMyWeight: '',
    sellerOptionStock: '',
    itemNo: parsed.itemNo,
    itemSeq: parsed.itemSeq,
    incInstr: 'N',
    incParts: 'N',
    itemQty: '1',
    breakType: 'M',
    breakSets: 'Y',
    itemCondition: 'U',
    itemPrice: 'I',
    itemRound: '2',
    itemBulk: '1',
    itemDesc: '',
    itemRemarks: '',
    TQ1: '',
    TS1: '',
    TQ2: '',
    TS2: '',
    TQ3: '',
    TS3: '',
    invDup: 'Y',
    invAdjustPrice: 'N',
    invAdjustBulk: 'O',
    invAdjustSale: 'O',
    invAdjustRemarks: 'N',
    invAdjustExtended: 'O',
    invAdjustStock: 'O',
    invAdjustRetain: 'O',
    invAdjustCost: 'O',
    invAdjustWeight: 'O',
    ItemInvSort: '1',
    ItemInvAsc: 'A',
  })
  return params.toString()
}

/**
 * @typedef {{ type: 'auth_required' } | { type: 'html', status: number, html: string } | { type: 'timeout' } | { type: 'error', status: number, message: string }} BrickLinkFetchResult
 */

/**
 * @param {string} setNumber
 * @param {string} cookie
 * @param {{ fetch?: typeof fetch, timeoutMs?: number, log?: { step: (name: string, meta?: Record<string, unknown>) => void } }} [options]
 * @returns {Promise<BrickLinkFetchResult>}
 */
export async function fetchInvSetEditHtml(setNumber, cookie, options = {}) {
  const fetchImpl = options.fetch ?? globalThis.fetch
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS
  const log = options.log
  const parsed = parseSetNumberForBrickLink(setNumber)
  if (!parsed) {
    return { type: 'error', status: 400, message: 'Invalid set number' }
  }

  const body = buildInvSetEditBody(parsed)
  log?.step('bricklink_post', { itemNo: parsed.itemNo, itemSeq: parsed.itemSeq, timeoutMs })

  let response
  try {
    response = await fetchImpl(BRICKLINK_URL, {
      method: 'POST',
      headers: {
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'content-type': 'application/x-www-form-urlencoded',
        cookie,
        origin: 'https://www.bricklink.com',
        referer: 'https://www.bricklink.com/invSet.asp?utm_content=subnav',
        'user-agent': USER_AGENT,
      },
      body,
      redirect: 'manual',
      signal: AbortSignal.timeout(timeoutMs),
    })
  } catch (error) {
    if (isFetchTimeoutError(error)) {
      log?.step('bricklink_timeout')
      return { type: 'timeout' }
    }
    throw error
  }

  log?.step('bricklink_response_headers', { httpStatus: response.status })

  if (response.status >= 300 && response.status < 400) {
    log?.step('bricklink_auth_redirect', { httpStatus: response.status })
    return { type: 'auth_required' }
  }

  if (!response.ok) {
    log?.step('bricklink_http_error', { httpStatus: response.status })
    return {
      type: 'error',
      status: response.status,
      message: `BrickLink returned HTTP ${response.status}`,
    }
  }

  const html = await response.text()
  log?.step('bricklink_response_body', { htmlBytes: html.length })

  return { type: 'html', status: response.status, html }
}
