import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import SessionNav from './SessionNav.vue'
import {
  __resetSessionsForTests,
  createDemoSession,
  DEMO_SESSION_ID,
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
    ],
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

    const wrapper = mount(SessionNav, {
      props: { sessionId: DEMO_SESSION_ID },
      global: { plugins: [router] },
    })

    expect(wrapper.text()).not.toContain('Cups')
    expect(wrapper.text()).toContain('Reconcile')
  })

  it('shows Cups link during counting', async () => {
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'counting')
    const router = createTestRouter()
    await router.push('/')

    const wrapper = mount(SessionNav, {
      props: { sessionId: DEMO_SESSION_ID },
      global: { plugins: [router] },
    })

    expect(wrapper.text()).toContain('Cups')
  })
})
