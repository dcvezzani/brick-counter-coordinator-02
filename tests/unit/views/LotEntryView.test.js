import { describe, expect, it, beforeEach, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import LotEntryView from '@/views/LotEntryView.vue'
import LotEntryForm from '@/components/LotEntryForm.vue'
import ResponsiveDataTable from '@/components/ResponsiveDataTable.vue'
import SessionViewFrame from '@/components/SessionViewFrame.vue'
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
import { showActionToast } from '@/lib/feedback.js'
import { setWorkflowProfileSnapshot } from '@/lib/workflow-profile-state.js'
import { stubMatchMedia } from '../../setup.js'

vi.mock('@/lib/feedback.js', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    showActionToast: vi.fn(),
  }
})

function createTestRouter() {
  return createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div />' } },
      {
        path: '/session/:sessionId/lot',
        name: 'session-lot',
        component: LotEntryView,
      },
      {
        path: '/session/:sessionId/reconcile',
        name: 'session-reconciliation',
        component: { template: '<div />' },
      },
      {
        path: '/session/:sessionId/my-list',
        name: 'session-my-list',
        component: { template: '<div />' },
      },
    ],
  })
}

function mountLotEntryView(router, options = {}) {
  return mount(LotEntryView, {
    global: {
      plugins: [router],
      ...options.global,
    },
    ...options,
  })
}

describe('LotEntryView', () => {
  beforeEach(() => {
    __resetSessionsForTests()
    localStorage.clear()
    vi.mocked(showActionToast).mockClear()
    stubMatchMedia(false)
    setWorkflowProfileSnapshot({ isMdUp: false, storedProfile: 'coordinator' })
  })

  it('uses ViewHeader with h1 title instead of Card shell', async () => {
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'counting')
    const router = createTestRouter()
    await router.push(`/session/${DEMO_SESSION_ID}/lot`)

    const wrapper = mountLotEntryView(router)

    expect(wrapper.find('h1').text()).toBe('Lot entry')
    expect(wrapper.findComponent({ name: 'Card' }).exists()).toBe(false)
    expect(wrapper.text()).not.toContain('Count parts into lots.')
    expect(wrapper.text()).not.toContain('Lot A')
    expect(wrapper.text()).not.toContain('3001')
    expect(wrapper.findComponent(SessionViewFrame).props('variant')).toBe('worker')
  })

  it('uses coordinator shell when effective profile is coordinator', async () => {
    stubMatchMedia(true)
    setWorkflowProfileSnapshot({ isMdUp: true, storedProfile: 'coordinator' })
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'counting')
    const router = createTestRouter()
    await router.push(`/session/${DEMO_SESSION_ID}/lot`)

    const wrapper = mountLotEntryView(router)

    expect(wrapper.findComponent(SessionViewFrame).props('variant')).toBe('coordinator')
  })

  it('mounts LotEntryForm during counting phase', async () => {
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'counting')
    const router = createTestRouter()
    await router.push(`/session/${DEMO_SESSION_ID}/lot`)

    const wrapper = mountLotEntryView(router)

    expect(wrapper.findComponent(LotEntryForm).exists()).toBe(true)
    expect(wrapper.find('[data-testid="lot-entry-form-mount"]').exists()).toBe(true)
    expect(wrapper.findComponent(ResponsiveDataTable).exists()).toBe(false)
  })

  it('shows phase note outside counting without form or Compare CTA', async () => {
    createDemoSession()
    const router = createTestRouter()
    await router.push(`/session/${DEMO_SESSION_ID}/lot`)

    const wrapper = mountLotEntryView(router)

    expect(wrapper.text()).toContain('Counting is available during the Count phase.')
    expect(wrapper.findComponent(LotEntryForm).exists()).toBe(false)
    expect(wrapper.text()).not.toContain('Compare with Part-Out List')
    expect(wrapper.find('[data-testid="view-actions"]').exists()).toBe(false)
  })

  it('shows Compare CTA only during counting phase', async () => {
    createDemoSession()
    const router = createTestRouter()
    await router.push(`/session/${DEMO_SESSION_ID}/lot`)

    const importingWrapper = mountLotEntryView(router)
    expect(importingWrapper.text()).not.toContain('Compare with Part-Out List')
    expect(importingWrapper.find('[data-testid="view-actions"]').exists()).toBe(false)

    setPhase(DEMO_SESSION_ID, 'counting')
    await router.push(`/session/${DEMO_SESSION_ID}/lot`)

    const countingWrapper = mountLotEntryView(router)
    expect(countingWrapper.text()).toContain('Compare with Part-Out List')
    expect(countingWrapper.find('[data-testid="view-actions"]').exists()).toBe(true)
  })

  it('shows organize prompt banner and toast during organizing for worker profile', async () => {
    stubMatchMedia(false)
    setWorkflowProfileSnapshot({ isMdUp: false, storedProfile: 'worker' })
    createDemoSession()
    registerJoinedWorker(DEMO_SESSION_ID, 'Alice')
    assignOrganizerList(DEMO_SESSION_ID, 'org-1', 'Alice')
    setPhase(DEMO_SESSION_ID, 'organizing')

    const router = createTestRouter()
    await router.push(`/session/${DEMO_SESSION_ID}/lot`)

    const wrapper = mountLotEntryView(router)

    expect(shouldShowOrganizePrompt(DEMO_SESSION_ID, 'worker')).toBe(true)
    expect(wrapper.find('[data-testid="organize-prompt-banner"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Go to my put-away list')
    expect(showActionToast).toHaveBeenCalledWith(
      'Time to put parts away.',
      expect.objectContaining({ actionLabel: 'Go to my put-away list' }),
    )
  })

  it('navigates to my-list from organize banner and acknowledges prompt', async () => {
    stubMatchMedia(false)
    setWorkflowProfileSnapshot({ isMdUp: false, storedProfile: 'worker' })
    createDemoSession()
    registerJoinedWorker(DEMO_SESSION_ID, 'Alice')
    assignOrganizerList(DEMO_SESSION_ID, 'org-1', 'Alice')
    setPhase(DEMO_SESSION_ID, 'organizing')

    const router = createTestRouter()
    await router.push(`/session/${DEMO_SESSION_ID}/lot`)
    await router.isReady()

    const push = vi.spyOn(router, 'push')
    const wrapper = mountLotEntryView(router)

    const goButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Go to my put-away list'))
    await goButton.trigger('click')
    await flushPromises()

    expect(shouldShowOrganizePrompt(DEMO_SESSION_ID, 'worker')).toBe(false)
    expect(push).toHaveBeenCalledWith({
      name: 'session-my-list',
      params: { sessionId: DEMO_SESSION_ID },
    })
  })

  it('does not show organize prompt for coordinator profile', async () => {
    stubMatchMedia(true)
    setWorkflowProfileSnapshot({ isMdUp: true, storedProfile: 'coordinator' })
    createDemoSession()
    registerJoinedWorker(DEMO_SESSION_ID, 'Alice')
    assignOrganizerList(DEMO_SESSION_ID, 'org-1', 'Alice')
    setPhase(DEMO_SESSION_ID, 'organizing')

    const router = createTestRouter()
    await router.push(`/session/${DEMO_SESSION_ID}/lot`)

    const toastCallsBefore = vi.mocked(showActionToast).mock.calls.length
    const wrapper = mountLotEntryView(router)

    expect(wrapper.find('[data-testid="organize-prompt-banner"]').exists()).toBe(false)
    expect(vi.mocked(showActionToast).mock.calls.length).toBe(toastCallsBefore)
    wrapper.unmount()
  })

  it('advances to reconciling when Compare is clicked', async () => {
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'counting')
    const router = createTestRouter()
    await router.push(`/session/${DEMO_SESSION_ID}/lot`)
    await router.isReady()

    const push = vi.spyOn(router, 'push')

    const wrapper = mountLotEntryView(router)

    const compareButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Compare with Part-Out List'))
    expect(compareButton).toBeDefined()
    await compareButton.trigger('click')
    await flushPromises()

    expect(getSession(DEMO_SESSION_ID).phase).toBe('reconciling')
    expect(push).toHaveBeenCalledWith({
      name: 'session-reconciliation',
      params: { sessionId: DEMO_SESSION_ID },
    })
  })
})
