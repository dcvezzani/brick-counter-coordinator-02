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

  it('goBack from updating_inventory to organizing navigates without confirm', () => {
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'updating_inventory')
    const sessionId = ref(DEMO_SESSION_ID)
    const { goBack, confirmOpen } = usePhaseNavigation(sessionId)

    goBack('organizing')

    expect(confirmOpen.value).toBe(false)
    expect(getSession(DEMO_SESSION_ID).phase).toBe('organizing')
    expect(push).toHaveBeenCalledWith(landingRouteLocation(DEMO_SESSION_ID, 'organizing'))
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

  it('confirmBack completes pending navigation; cancel leaves phase unchanged', () => {
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'updating_inventory')
    const sessionId = ref(DEMO_SESSION_ID)
    const { goBack, confirmBack, cancelBack, confirmOpen } = usePhaseNavigation(sessionId)

    goBack('counting')
    cancelBack()
    expect(confirmOpen.value).toBe(false)
    expect(getSession(DEMO_SESSION_ID).phase).toBe('updating_inventory')
    expect(push).not.toHaveBeenCalled()

    goBack('counting')
    confirmBack()
    expect(getSession(DEMO_SESSION_ID).phase).toBe('counting')
    expect(push).toHaveBeenCalledWith(landingRouteLocation(DEMO_SESSION_ID, 'counting'))
  })

  it('navigateWithPhaseSync regresses phase for Lot from reconciling', () => {
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'reconciling')
    const sessionId = ref(DEMO_SESSION_ID)
    const { navigateWithPhaseSync } = usePhaseNavigation(sessionId)

    navigateWithPhaseSync({ name: 'session-lot', params: { sessionId: DEMO_SESSION_ID } })

    expect(getSession(DEMO_SESSION_ID).phase).toBe('counting')
    expect(push).toHaveBeenCalledWith(landingRouteLocation(DEMO_SESSION_ID, 'counting'))
  })

  it('navigateWithPhaseSync does not change phase for Lots browse', () => {
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'organizing')
    const sessionId = ref(DEMO_SESSION_ID)
    const { navigateWithPhaseSync } = usePhaseNavigation(sessionId)
    const to = { name: 'session-lots', params: { sessionId: DEMO_SESSION_ID } }

    navigateWithPhaseSync(to)

    expect(getSession(DEMO_SESSION_ID).phase).toBe('organizing')
    expect(push).toHaveBeenCalledWith(to)
  })
})
