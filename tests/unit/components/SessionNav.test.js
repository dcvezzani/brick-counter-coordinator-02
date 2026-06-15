import { describe, expect, it, beforeEach, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import SessionNav from '@/components/SessionNav.vue'
import {
  __resetSessionsForTests,
  createDemoSession,
  DEMO_SESSION_ID,
  getSession,
  landingRouteLocation,
  setPhase,
} from '@/lib/storyboard-session.js'

const ConfirmDialogStub = {
  name: 'ConfirmDialog',
  props: ['open', 'title', 'description', 'cancelLabel', 'confirmLabel'],
  emits: ['update:open', 'confirm', 'cancel'],
  template: `
    <div v-if="open" data-testid="confirm-dialog">
      <button type="button" data-testid="confirm-cancel" @click="$emit('update:open', false); $emit('cancel')">Cancel</button>
      <button type="button" data-testid="confirm-go-back" @click="$emit('confirm')">Go back</button>
    </div>
  `,
}

function createTestRouter() {
  return createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div />' } },
      { path: '/session/:sessionId/lot', name: 'session-lot', component: { template: '<div />' } },
      {
        path: '/session/:sessionId/lots',
        name: 'session-lots',
        component: { template: '<div />' },
      },
      {
        path: '/session/:sessionId/reconciliation',
        name: 'session-reconciliation',
        component: { template: '<div />' },
      },
      { path: '/session/:sessionId/cups', name: 'session-cups', component: { template: '<div />' } },
    ],
  })
}

function mountSessionNav(router) {
  return mount(SessionNav, {
    props: { sessionId: DEMO_SESSION_ID },
    global: {
      plugins: [router],
      stubs: { ConfirmDialog: ConfirmDialogStub },
    },
  })
}

function lotLinks(wrapper) {
  return wrapper.findAll('a').filter((link) => {
    const text = link.text().trim()
    return text === 'Lot' || text.startsWith('Lot\n') || /^Lot$/m.test(text.split('\n')[0])
  })
}

function lotsLinks(wrapper) {
  return wrapper.findAll('a').filter((link) => link.text().trim().startsWith('Lots'))
}

function reconcileLinks(wrapper) {
  return wrapper.findAll('a').filter((link) => link.text().includes('Reconcile'))
}

describe('SessionNav', () => {
  beforeEach(() => {
    __resetSessionsForTests()
  })

  it('hides Cups link when phase is updating_inventory', async () => {
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'updating_inventory')
    const router = createTestRouter()
    await router.push('/')

    const wrapper = mountSessionNav(router)

    expect(wrapper.text()).not.toContain('Cups')
    expect(wrapper.text()).toContain('Reconcile')
  })

  it('shows Cups link during counting', async () => {
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'counting')
    const router = createTestRouter()
    await router.push('/')

    const wrapper = mountSessionNav(router)

    expect(wrapper.text()).toContain('Cups')
  })

  it('regresses phase to counting when Lot is clicked from reconciling', async () => {
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'reconciling')
    const router = createTestRouter()
    await router.push('/')
    const pushSpy = vi.spyOn(router, 'push')

    const wrapper = mountSessionNav(router)
    await lotLinks(wrapper)[0].trigger('click')
    await flushPromises()

    expect(getSession(DEMO_SESSION_ID).phase).toBe('counting')
    expect(pushSpy).toHaveBeenCalledWith(landingRouteLocation(DEMO_SESSION_ID, 'counting'))
  })

  it('regresses phase to reconciling when Reconcile is clicked from organizing', async () => {
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'organizing')
    const router = createTestRouter()
    await router.push('/')
    const pushSpy = vi.spyOn(router, 'push')

    const wrapper = mountSessionNav(router)
    await reconcileLinks(wrapper)[0].trigger('click')
    await flushPromises()

    expect(getSession(DEMO_SESSION_ID).phase).toBe('reconciling')
    expect(pushSpy).toHaveBeenCalledWith(landingRouteLocation(DEMO_SESSION_ID, 'reconciling'))
  })

  it('opens confirm before Lot from updating_inventory', async () => {
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'updating_inventory')
    const router = createTestRouter()
    await router.push('/')

    const wrapper = mountSessionNav(router)
    await lotLinks(wrapper)[0].trigger('click')
    await wrapper.vm.$nextTick()

    expect(getSession(DEMO_SESSION_ID).phase).toBe('updating_inventory')
    expect(wrapper.find('[data-testid="confirm-dialog"]').exists()).toBe(true)
  })

  it('does not change phase when Lots is clicked from organizing', async () => {
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'organizing')
    const router = createTestRouter()
    await router.push('/')
    const pushSpy = vi.spyOn(router, 'push')

    const wrapper = mountSessionNav(router)
    await lotsLinks(wrapper)[0].trigger('click')
    await flushPromises()

    expect(getSession(DEMO_SESSION_ID).phase).toBe('organizing')
    expect(pushSpy).toHaveBeenCalledWith({
      name: 'session-lots',
      params: { sessionId: DEMO_SESSION_ID },
    })
  })
})
