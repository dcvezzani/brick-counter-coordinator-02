import { describe, expect, it, beforeEach, vi } from 'vitest'
import { ref } from 'vue'
import { usePhaseNavigation } from '@/composables/usePhaseNavigation.js'
import {
  __resetSessionsForTests,
  createDemoSession,
  DEMO_SESSION_ID,
  getSession,
  landingRouteLocation,
  setPhase,
} from '@/lib/storyboard-session.js'

const push = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({ push }),
}))

describe('usePhaseNavigation', () => {
  beforeEach(() => {
    __resetSessionsForTests()
    push.mockClear()
  })

  it('goBack from reconciling to counting navigates without confirm', () => {
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'reconciling')
    const sessionId = ref(DEMO_SESSION_ID)
    const { goBack, confirmOpen } = usePhaseNavigation(sessionId)

    goBack('counting')

    expect(confirmOpen.value).toBe(false)
    expect(getSession(DEMO_SESSION_ID).phase).toBe('counting')
    expect(push).toHaveBeenCalledWith(landingRouteLocation(DEMO_SESSION_ID, 'counting'))
  })

  it('goBack from updating_inventory to counting opens confirm before navigate', () => {
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'updating_inventory')
    const sessionId = ref(DEMO_SESSION_ID)
    const { goBack, confirmOpen, pendingTargetPhase } = usePhaseNavigation(sessionId)

    goBack('counting')

    expect(confirmOpen.value).toBe(true)
    expect(pendingTargetPhase.value).toBe('counting')
    expect(getSession(DEMO_SESSION_ID).phase).toBe('updating_inventory')
    expect(push).not.toHaveBeenCalled()
  })
})
