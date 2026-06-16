import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const devEnvPath = resolve(process.cwd(), '.aidlc/dev.env')

if (existsSync(devEnvPath)) {
  for (const line of readFileSync(devEnvPath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq)
    const value = trimmed.slice(eq + 1)
    process.env[key] = value
  }
}

// Port role mapping — see AGENTS.md § Port role mapping (AIDLC)
if (process.env.AIDLC_APP_PORT && !process.env.PORT) {
  process.env.PORT = process.env.AIDLC_APP_PORT
}
if (process.env.AIDLC_API_PORT && !process.env.API_PORT) {
  process.env.API_PORT = process.env.AIDLC_API_PORT
}
if (process.env.AIDLC_DEBUG_PORT && !process.env.DEBUG_PORT) {
  process.env.DEBUG_PORT = process.env.AIDLC_DEBUG_PORT
}
