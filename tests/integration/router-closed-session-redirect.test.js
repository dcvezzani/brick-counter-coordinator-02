import { describe, expect, it, beforeEach } from 'vitest'
import {
  __resetSessionsForTests,
  createDemoSession,
  markSessionComplete,
} from '@/lib/storyboard-session.js'
import router from '@/router/index.js'

describe('integration: router closed-session redirect', () => {
  beforeEach(async () => {
    __resetSessionsForTests()
    await router.push('/')
  })

  it('redirects closed session routes to home', async () => {
    createDemoSession()
    markSessionComplete('demo')
    await router.push('/session/demo/lot')
    expect(router.currentRoute.value.name).toBe('home')
  })
})
