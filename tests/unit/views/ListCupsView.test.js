import { describe, expect, it, beforeEach, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import ListCupsView from '@/views/ListCupsView.vue'
import {
  __resetSessionsForTests,
  createDemoSession,
  DEMO_SESSION_ID,
  getSession,
  landingRouteLocation,
  setPhase,
} from '@/lib/storyboard-session.js'

function createTestRouter() {
  return createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div />' } },
      {
        path: '/session/:sessionId/cups',
        name: 'session-cups',
        component: ListCupsView,
      },
      {
        path: '/session/:sessionId/lot',
        name: 'session-lot',
        component: { template: '<div data-testid="lot-view" />' },
      },
    ],
  })
}

describe('ListCupsView', () => {
  beforeEach(() => {
    __resetSessionsForTests()
  })

  it('uses ViewHeader with h1 title instead of Card shell', async () => {
    createDemoSession()
    const router = createTestRouter()
    await router.push(`/session/${DEMO_SESSION_ID}/cups`)

    const wrapper = mount(ListCupsView, {
      global: { plugins: [router] },
    })

    expect(wrapper.find('h1').text()).toBe('List cups')
    expect(wrapper.text()).toContain(
      'Physical sort containers used while counting and organizing.',
    )
    expect(wrapper.findComponent({ name: 'Card' }).exists()).toBe(false)
    expect(wrapper.text()).toContain('Cup 1 — plates')
    expect(wrapper.text()).toContain('Return to lot entry')
    expect(wrapper.find('[data-testid="view-actions"]').exists()).toBe(true)
  })

  it('navigates to lot entry when Return to lot entry is clicked', async () => {
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'reconciling')
    const router = createTestRouter()
    await router.push(`/session/${DEMO_SESSION_ID}/cups`)
    const pushSpy = vi.spyOn(router, 'push')

    const wrapper = mount(ListCupsView, {
      global: { plugins: [router] },
    })

    await wrapper.get('[data-testid="back-to-counting"]').trigger('click')
    await flushPromises()

    expect(getSession(DEMO_SESSION_ID).phase).toBe('counting')
    expect(pushSpy).toHaveBeenCalledWith(
      landingRouteLocation(DEMO_SESSION_ID, 'counting'),
    )
  })
})
