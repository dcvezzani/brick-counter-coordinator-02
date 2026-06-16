import { describe, expect, it } from 'vitest'
import { workflowGuard } from '@/lib/workflow-guard.js'

describe('workflowGuard', () => {
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
    expect(
      workflowGuard({ name: 'session-my-list', params: { sessionId: 'demo' } }, 'worker'),
    ).toBe(true)
  })
})
