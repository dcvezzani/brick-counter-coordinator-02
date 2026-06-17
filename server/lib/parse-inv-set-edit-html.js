const NAME_FROM_TITLE = /Name:\s*(.+)$/i
const INPUT_TAG_RE = /<input\b[^>]*>/gi
const IMG_TAG_RE = /<img\b[^>]*>/gi

/**
 * @param {string} tag
 * @param {string} attribute
 * @returns {string}
 */
function readTagAttribute(tag, attribute) {
  const pattern = new RegExp(`\\b${attribute}\\s*=\\s*(["'])(.*?)\\1`, 'i')
  const match = pattern.exec(tag)
  return match ? match[2] : ''
}

/**
 * Fast scan of BrickLink invSetEdit HTML — avoids building a full DOM tree.
 *
 * @param {string} html
 * @returns {Map<string, string>}
 */
export function collectNamedInputValues(html) {
  const values = new Map()
  for (const match of html.matchAll(INPUT_TAG_RE)) {
    const tag = match[0]
    const name = readTagAttribute(tag, 'name')
    if (!name) {
      continue
    }
    values.set(name, readTagAttribute(tag, 'value'))
  }
  return values
}

/**
 * @param {string} titleOrAlt
 * @returns {string}
 */
function parseNameFromImageLabel(titleOrAlt) {
  const labelMatch = NAME_FROM_TITLE.exec(String(titleOrAlt ?? '').trim())
  return labelMatch ? labelMatch[1].trim() : ''
}

/**
 * @param {string} html
 * @returns {Map<string, string>}
 */
function collectImageLabels(html) {
  const labels = new Map()
  for (const match of html.matchAll(IMG_TAG_RE)) {
    const tag = match[0]
    const id = readTagAttribute(tag, 'id')
    const indexMatch = /^img(\d+)$/i.exec(id)
    if (!indexMatch) {
      continue
    }
    const title = readTagAttribute(tag, 'title') || readTagAttribute(tag, 'alt')
    labels.set(indexMatch[1], title)
  }
  return labels
}

/**
 * @param {string} html
 * @returns {Array<{ id: string, partId: string, name: string, color: string, colorId: number, quantity: number }>}
 */
export function parseInvSetEditHtml(html) {
  const values = collectNamedInputValues(html)
  const imageLabels = collectImageLabels(html)
  const indices = new Set()

  for (const name of values.keys()) {
    const indexMatch = /^itemNo(\d+)$/i.exec(name)
    if (indexMatch) {
      indices.add(indexMatch[1])
    }
  }

  const sorted = [...indices].sort((left, right) => Number(left) - Number(right))
  const lines = []

  for (const index of sorted) {
    const partId = (values.get(`itemNo${index}`) ?? values.get(`itemno${index}`) ?? '').trim()
    const quantity = Number.parseInt(values.get(`nQ${index}`) ?? values.get(`nq${index}`) ?? '', 10)
    const colorId = Number.parseInt(values.get(`colorID${index}`) ?? values.get(`colorid${index}`) ?? '', 10)
    const color = (values.get(`colorName${index}`) ?? values.get(`colorname${index}`) ?? '').trim()

    if (!partId || !Number.isFinite(quantity)) {
      continue
    }

    const imageLabel = imageLabels.get(index) ?? ''
    const name = parseNameFromImageLabel(imageLabel)

    lines.push({
      id: `po-${index}`,
      partId,
      name,
      color,
      colorId: Number.isFinite(colorId) ? colorId : 0,
      quantity,
    })
  }

  return lines
}

/**
 * @param {string} html
 * @returns {boolean}
 */
export function looksLikeSetNotFound(html) {
  const lower = html.toLowerCase()
  if (lower.includes('will be parted out into') || lower.includes('parts:')) {
    return false
  }
  return !/\bname\s*=\s*["']itemNo0["']/i.test(html)
}
