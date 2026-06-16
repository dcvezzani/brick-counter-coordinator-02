import { describe, expect, it, beforeEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import MyListView from '@/views/MyListView.vue'
import {
  __resetSessionsForTests,
  assignOrganizerList,
  createDemoSession,
  DEMO_SESSION_ID,
  getSession,
  registerJoinedWorker,
  setPhase,
  shouldShowOrganizePrompt,
} from '@/lib/storyboard-session.js'

function createTestRouter() {
  return createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div />' } },
      {
        path: '/session/:sessionId/my-list',
        name: 'session-my-list',
        component: MyListView,
      },
      {
        path: '/session/:sessionId/lot',
        name: 'session-lot',
        component: { template: '<div />' } },
    ],
  })
}

describe('MyListView', () => {
  beforeEach(() => {
    __resetSessionsForTests()
    localStorage.clear()
  })

  it('shows assigned list with assignee badge and virtual scroll rows', async () => {
    localStorage.setItem('bcc.displayName', 'Demo Worker')
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'organizing')

    const router = createTestRouter()
    await router.push(`/session/${DEMO_SESSION_ID}/my-list`)

    const wrapper = mount(MyListView, {
      global: { plugins: [router] },
      attachTo: document.body,
    })

    const scrollEl = wrapper.find('[data-testid="my-list-virtual-scroll"]').element
    Object.defineProperty(scrollEl, 'clientHeight', { configurable: true, value: 400 })
    await flushPromises()

    expect(wrapper.text()).toContain('Pick list — long virtual scroll fixture')
    expect(wrapper.text()).toContain('Demo Worker')
    expect(wrapper.find('[data-testid="my-list-virtual-scroll"]').exists()).toBe(true)

    const rows = wrapper.findAll('[data-testid="my-list-row"]')
    const lineCount = getSession(DEMO_SESSION_ID).organizerLists.find(
      (list) => list.id === 'org-long',
    ).lines.length
    expect(lineCount).toBeGreaterThanOrEqual(50)
    expect(rows.length).toBeLessThan(lineCount)
    expect(rows.length).toBeGreaterThan(0)

    wrapper.unmount()
  })

  it('toggles moved and needs location on assigned list lines', async () => {
    localStorage.setItem('bcc.displayName', 'Demo Worker')
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'organizing')

    const router = createTestRouter()
    await router.push(`/session/${DEMO_SESSION_ID}/my-list`)

    const wrapper = mount(MyListView, {
      global: { plugins: [router] },
      attachTo: document.body,
    })

    const scrollEl = wrapper.find('[data-testid="my-list-virtual-scroll"]').element
    Object.defineProperty(scrollEl, 'clientHeight', { configurable: true, value: 400 })
    await flushPromises()

    const movedButton = wrapper.findAll('button').find((btn) => btn.text() === 'Moved')
    await movedButton.trigger('click')

    const longList = getSession(DEMO_SESSION_ID).organizerLists.find(
      (list) => list.id === 'org-long',
    )
    expect(longList.lines[0].moved).toBe(true)
    wrapper.unmount()
  })

  it('shows unassigned alert when worker has no list', async () => {
    localStorage.setItem('bcc.displayName', 'Nobody')
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'organizing')

    const router = createTestRouter()
    await router.push(`/session/${DEMO_SESSION_ID}/my-list`)

    const wrapper = mount(MyListView, {
      global: { plugins: [router] },
    })

    expect(wrapper.text()).toContain('No list assigned yet')
    expect(wrapper.find('[data-testid="my-list-virtual-scroll"]').exists()).toBe(false)
  })

  it('acknowledges organize prompt on mount', async () => {
    localStorage.setItem('bcc.displayName', 'Alice')
    createDemoSession()
    registerJoinedWorker(DEMO_SESSION_ID, 'Alice')
    assignOrganizerList(DEMO_SESSION_ID, 'org-1', 'Alice')
    setPhase(DEMO_SESSION_ID, 'organizing')
    expect(shouldShowOrganizePrompt(DEMO_SESSION_ID, 'worker')).toBe(true)

    const router = createTestRouter()
    await router.push(`/session/${DEMO_SESSION_ID}/my-list`)

    mount(MyListView, {
      global: { plugins: [router] },
    })

    expect(shouldShowOrganizePrompt(DEMO_SESSION_ID, 'worker')).toBe(false)
    expect(getSession(DEMO_SESSION_ID).organizePromptAcknowledged).toBe(true)
  })
})
