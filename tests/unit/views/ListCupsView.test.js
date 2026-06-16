import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import ListCupsView from '@/views/ListCupsView.vue'
import {
  __resetSessionsForTests,
  createDemoSession,
  DEMO_SESSION_ID,
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
    ],
  })
}

describe('ListCupsView', () => {
  beforeEach(() => {
    __resetSessionsForTests()
  })

  it('lists cups without back actions', async () => {
    createDemoSession()
    const router = createTestRouter()
    await router.push(`/session/${DEMO_SESSION_ID}/cups`)

    const wrapper = mount(ListCupsView, {
      global: { plugins: [router] },
    })

    expect(wrapper.find('h1').text()).toBe('List cups')
    expect(wrapper.text()).toContain('Cup 1 — plates')
    expect(wrapper.text()).not.toContain('Return to lot entry')
    expect(wrapper.find('[data-testid="view-actions"]').exists()).toBe(false)
  })
})
