import { describe, expect, it, beforeEach, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import SessionNav from '@/components/SessionNav.vue'
import {
  __resetSessionsForTests,
  createDemoSession,
  DEMO_SESSION_ID,
  getSession,
  SESSION_MY_LIST_ROUTE,
  setPhase,
} from '@/lib/storyboard-session.js'

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
      {
        path: '/session/:sessionId/my-list',
        name: SESSION_MY_LIST_ROUTE,
        component: { template: '<div />' },
      },
    ],
  })
}

function mountSessionNav(router, props = {}) {
  return mount(SessionNav, {
    props: { sessionId: DEMO_SESSION_ID, ...props },
    global: { plugins: [router] },
  })
}

function lotLinks(wrapper) {
  return wrapper.findAll('a').filter((link) => {
    const text = link.text().trim()
    return text === 'Lot' || text.startsWith('Lot\n') || /^Lot$/m.test(text.split('\n')[0])
  })
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

  it('does not change phase when Lot is clicked from reconciling', async () => {
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'reconciling')
    const router = createTestRouter()
    await router.push('/')
    const pushSpy = vi.spyOn(router, 'push')

    const wrapper = mountSessionNav(router)
    await lotLinks(wrapper)[0].trigger('click')
    await flushPromises()

    expect(getSession(DEMO_SESSION_ID).phase).toBe('reconciling')
    expect(pushSpy).toHaveBeenCalledWith({
      name: 'session-lot',
      params: { sessionId: DEMO_SESSION_ID },
    })
  })

  it('shows My list for worker profile during organizing', async () => {
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'organizing')
    const router = createTestRouter()
    await router.push('/')

    const wrapper = mountSessionNav(router, { effectiveProfile: 'worker' })

    expect(wrapper.text()).toContain('My list')
    expect(wrapper.text()).not.toContain('Lots')
    expect(wrapper.text()).not.toContain('Reconcile')
  })

  it('shows Lots and Cups for worker profile during counting', async () => {
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'counting')
    const router = createTestRouter()
    await router.push('/')

    const wrapper = mountSessionNav(router, { effectiveProfile: 'worker' })

    expect(wrapper.text()).toContain('Lots')
    expect(wrapper.text()).toContain('Cups')
    expect(wrapper.text()).not.toContain('Reconcile')
    expect(wrapper.text()).not.toContain('My list')
  })
})
