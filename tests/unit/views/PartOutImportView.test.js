import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import PartOutImportView from '@/views/PartOutImportView.vue'
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
        path: '/session/:sessionId/import',
        name: 'session-import',
        component: PartOutImportView,
        meta: { hideSessionNav: true },
      },
      {
        path: '/session/:sessionId/lot',
        name: 'session-lot',
        component: { template: '<div />' },
      },
    ],
  })
}

describe('PartOutImportView', () => {
  beforeEach(() => {
    __resetSessionsForTests()
  })

  it('uses ViewHeader with h1 title instead of Card shell', async () => {
    createDemoSession()
    const router = createTestRouter()
    await router.push(`/session/${DEMO_SESSION_ID}/import`)

    const wrapper = mount(PartOutImportView, {
      global: { plugins: [router] },
    })

    expect(wrapper.find('h1').text()).toBe('Part-out import')
    expect(wrapper.findComponent({ name: 'Card' }).exists()).toBe(false)
    expect(wrapper.text()).toContain('Confirm and begin counting')
    expect(wrapper.text()).toContain('Back')
  })
})
