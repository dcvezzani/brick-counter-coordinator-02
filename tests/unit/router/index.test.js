import { describe, expect, it, beforeEach } from 'vitest'
import {
  __resetSessionsForTests,
  createDemoSession,
  markSessionComplete,
} from '@/lib/storyboard-session.js'
import { setWorkflowProfileSnapshot } from '@/lib/workflow-profile-state.js'
import router from '@/router/index.js'
import { stubMatchMedia } from '../../setup.js'

describe('router', () => {
  beforeEach(async () => {
    localStorage.clear()
    stubMatchMedia(true)
    setWorkflowProfileSnapshot({ isMdUp: true, storedProfile: 'coordinator' })
    __resetSessionsForTests()
    await router.push('/')
  })

  it('redirects closed session routes to home', async () => {
    createDemoSession()
    markSessionComplete('demo')
    await router.push('/session/demo/lot')
    expect(router.currentRoute.value.name).toBe('home')
  })

  it('allows active demo session routes', async () => {
    createDemoSession()
    await router.push('/session/demo/import')
    expect(router.currentRoute.value.name).toBe('session-import')
  })

  it('hides session nav on import route via meta', async () => {
    createDemoSession()
    await router.push('/session/demo/import')
    expect(router.currentRoute.value.meta.hideSessionNav).toBe(true)
  })

  it('assigns worker shell meta on lot route', async () => {
    createDemoSession()
    await router.push('/session/demo/lot')
    expect(router.currentRoute.value.meta.sessionShell).toBe('worker')
  })

  it('assigns coordinator shell meta on lots route', async () => {
    createDemoSession()
    await router.push('/session/demo/lots')
    expect(router.currentRoute.value.meta.sessionShell).toBe('coordinator')
  })
})
