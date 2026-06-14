import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import ListLotsView from '@/views/ListLotsView.vue'
import {
  __resetSessionsForTests,
  createDemoSession,
  DEMO_SESSION_ID,
  getSession,
} from '@/lib/storyboard-session.js'

function createTestRouter() {
  return createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div />' } },
      {
        path: '/session/:sessionId/lots',
        name: 'session-lots',
        component: ListLotsView,
      },
      {
        path: '/session/:sessionId/reconciliation',
        name: 'session-reconciliation',
        component: { template: '<div />' },
      },
    ],
  })
}

describe('ListLotsView', () => {
  beforeEach(() => {
    __resetSessionsForTests()
  })

  it('uses ViewHeader and ResponsiveDataTable in browse mode without Card shell', async () => {
    createDemoSession()
    const router = createTestRouter()
    await router.push(`/session/${DEMO_SESSION_ID}/lots`)

    const wrapper = mount(ListLotsView, {
      global: { plugins: [router] },
    })

    expect(wrapper.find('h1').text()).toBe('List lots')
    expect(wrapper.findComponent({ name: 'Card' }).exists()).toBe(false)
    expect(wrapper.findComponent({ name: 'ResponsiveDataTable' }).exists()).toBe(true)
    expect(wrapper.text()).toContain('3 lots')
    expect(wrapper.text()).toContain('Lot A')
  })

  it('shows organizer chapter badge and ViewActions in organizer mode', async () => {
    createDemoSession()
    const router = createTestRouter()
    await router.push(`/session/${DEMO_SESSION_ID}/lots?mode=organizer`)

    const wrapper = mount(ListLotsView, {
      global: { plugins: [router] },
    })

    expect(wrapper.find('h1').text()).toBe('Organizer — pick lists')
    expect(wrapper.text()).toContain('Organizer')
    expect(wrapper.find('[data-testid="view-actions"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Declare ready to import')
    expect(wrapper.text()).toContain('Return to reconciling')
    expect(wrapper.text()).toContain('Pick list — red plates')
  })

  it('toggles organizer line flags via row actions', async () => {
    createDemoSession()
    const router = createTestRouter()
    await router.push(`/session/${DEMO_SESSION_ID}/lots?mode=organizer`)

    const wrapper = mount(ListLotsView, {
      global: { plugins: [router] },
    })

    const movedButtons = wrapper.findAll('button').filter((btn) => btn.text() === 'Moved')
    await movedButtons[0].trigger('click')

    const session = getSession(DEMO_SESSION_ID)
    expect(session.organizerLists[0].lines[0].moved).toBe(true)
  })

  it('renders one ResponsiveDataTable per organizer pick list', async () => {
    createDemoSession()
    const router = createTestRouter()
    await router.push(`/session/${DEMO_SESSION_ID}/lots?mode=organizer`)

    const wrapper = mount(ListLotsView, {
      global: { plugins: [router] },
    })

    expect(wrapper.findAllComponents({ name: 'ResponsiveDataTable' })).toHaveLength(1)
  })
})
