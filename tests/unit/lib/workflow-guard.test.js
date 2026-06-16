import { beforeEach, describe, expect, it } from 'vitest'
import {
  __resetSessionsForTests,
  createDemoSession,
  DEMO_SESSION_ID,
  setPhase,
} from '@/lib/storyboard-session.js'
import { workflowGuard } from '@/lib/workflow-guard.js'

const myListRoute = {
  name: 'session-my-list',
  params: { sessionId: DEMO_SESSION_ID },
  meta: { workerOnly: true },
}

describe('workflowGuard', () => {
  beforeEach(() => {
    __resetSessionsForTests()
  })

  it('allows coordinator profile on coordinator-only routes', () => {
    expect(
      workflowGuard({ name: 'session-import', params: { sessionId: 'demo' } }, 'coordinator'),
    ).toBe(true)
    expect(
      workflowGuard(
        { name: 'session-lots', params: { sessionId: 'demo' }, query: { mode: 'organizer' } },
        'coordinator',
      ),
    ).toBe(true)
  })

  it('redirects coordinator from my-list to phase-appropriate landing during organizing', () => {
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'organizing')

    expect(workflowGuard(myListRoute, 'coordinator')).toEqual({
      name: 'session-lots',
      params: { sessionId: DEMO_SESSION_ID },
      query: { mode: 'organizer' },
    })
  })

  it('redirects coordinator from my-list to lot entry during counting', () => {
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'counting')

    expect(workflowGuard(myListRoute, 'coordinator')).toEqual({
      name: 'session-lot',
      params: { sessionId: DEMO_SESSION_ID },
    })
  })

  it('redirects coordinator from my-list to home when session is missing', () => {
    expect(workflowGuard(myListRoute, 'coordinator')).toEqual({ name: 'home' })
  })

  it('redirects worker from session import to wait view', () => {
    expect(
      workflowGuard({ name: 'session-import', params: { sessionId: 'demo' } }, 'worker'),
    ).toEqual({
      name: 'session-wait',
      params: { sessionId: 'demo' },
      query: { reason: 'importing' },
    })
  })

  it('redirects worker from reconciliation to wait view', () => {
    expect(
      workflowGuard(
        { name: 'session-reconciliation', params: { sessionId: 'demo' } },
        'worker',
      ),
    ).toEqual({
      name: 'session-wait',
      params: { sessionId: 'demo' },
      query: { reason: 'reconciling' },
    })
  })

  it('redirects worker from organizer lots to wait view', () => {
    expect(
      workflowGuard(
        { name: 'session-lots', params: { sessionId: 'demo' }, query: { mode: 'organizer' } },
        'worker',
      ),
    ).toEqual({
      name: 'session-wait',
      params: { sessionId: 'demo' },
      query: { reason: 'importing' },
    })
  })

  it('sends worker away from session-new', () => {
    expect(workflowGuard({ name: 'session-new' }, 'worker')).toEqual({ name: 'home' })
  })

  it('allows worker on counting routes', () => {
    expect(
      workflowGuard({ name: 'session-lot', params: { sessionId: 'session-counting' } }, 'worker'),
    ).toBe(true)
    expect(workflowGuard(myListRoute, 'worker')).toBe(true)
  })
})
