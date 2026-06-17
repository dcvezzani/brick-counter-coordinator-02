import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { parseInvSetEditHtml } from '../../../server/lib/parse-inv-set-edit-html.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '../../..')

function readFixture(relativePath) {
  return readFileSync(path.join(repoRoot, relativePath), 'utf8')
}

describe('parse-inv-set-edit-html', () => {
  it('parses the single-row contract fragment', () => {
    const html = readFixture('feature/load-part-out-import/invSetEdit.asp.html.md')
    const lines = parseInvSetEditHtml(html)

    expect(lines).toHaveLength(1)
    expect(lines[0]).toEqual({
      id: 'po-0',
      partId: '88292',
      name: 'Arch 1 x 3 x 2 with Curved End',
      color: 'Reddish Brown',
      colorId: 88,
      quantity: 2,
    })
  })

  it('parses the three-row server snippet', () => {
    const html = readFixture('server/fixtures/inv-set-edit-snippet.html')
    const lines = parseInvSetEditHtml(html)

    expect(lines).toHaveLength(3)
    expect(lines[0].partId).toBe('88292')
    expect(lines[1].partId).toBe('30099')
    expect(lines[2].partId).toBe('98313')
    expect(lines[2].quantity).toBe(9)
  })

  it('parses the full 10281 capture within one second', () => {
    const html = readFixture('feature/load-part-out-import/invSetEdit.asp.html')
    const startedAt = performance.now()
    const lines = parseInvSetEditHtml(html)
    const elapsedMs = performance.now() - startedAt

    expect(lines.length).toBeGreaterThan(90)
    expect(elapsedMs).toBeLessThan(1000)
  })
})
