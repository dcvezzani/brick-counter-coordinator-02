import { describe, expect, it, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import ReconciliationView from './ReconciliationView.vue'
import {
  __resetSessionsForTests,
  allReconciliationRowsResolved,
  createDemoSession,
  DEMO_SESSION_ID,
  setPhase,
} from '@/lib/storyboard-session.js'
import { EXPORT_STUB_TOAST_MESSAGE, showInfoToast } from '@/lib/feedback.js'

vi.mock('@/lib/feedback.js', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    showInfoToast: vi.fn(),
  }
})

function createTestRouter() {
  return createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div />' } },
      {
        path: '/session/:sessionId/reconciliation',
        name: 'session-reconciliation',
        component: ReconciliationView,
      },
      {
        path: '/session/:sessionId/lots',
        name: 'session-lots',
        component: { template: '<div />' },
      },
    ],
  })
}

describe('ReconciliationView', () => {
  beforeEach(() => {
    __resetSessionsForTests()
    vi.mocked(showInfoToast).mockClear()
  })

  it('uses ViewHeader with chapter badge instead of Card shell (reconciling)', async () => {
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'reconciling')
    const router = createTestRouter()
    await router.push(`/session/${DEMO_SESSION_ID}/reconciliation`)

    const wrapper = mount(ReconciliationView, {
      global: { plugins: [router] },
    })

    expect(wrapper.find('h1').text()).toBe('Reconciliation')
    expect(wrapper.text()).toContain('Step 4: Resolve discrepancies')
    expect(wrapper.findComponent({ name: 'Card' }).exists()).toBe(false)
    expect(wrapper.find('[data-testid="view-actions"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Declare ready to organize')
  })

  it('shows updating_inventory banner, chapter badge, and export actions', async () => {
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'updating_inventory')
    const router = createTestRouter()
    await router.push(`/session/${DEMO_SESSION_ID}/reconciliation`)

    const wrapper = mount(ReconciliationView, {
      global: { plugins: [router] },
    })

    expect(wrapper.text()).toContain('Step 5: Export to BrickLink')
    expect(wrapper.find('[role="status"]').text()).toContain('Reconciliation is complete')
    expect(wrapper.text()).toContain('Export XML')
    expect(wrapper.text()).toContain('Mark session complete')
  })

  it('resolves rows and enables declare ready to organize', async () => {
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'reconciling')
    const router = createTestRouter()
    await router.push(`/session/${DEMO_SESSION_ID}/reconciliation`)

    const wrapper = mount(ReconciliationView, {
      global: { plugins: [router] },
    })

    expect(allReconciliationRowsResolved(DEMO_SESSION_ID)).toBe(false)
    expect(wrapper.text()).toContain('Resolve all rows before organizing.')

    const organizeBtn = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Declare ready to organize'))
    expect(organizeBtn?.attributes('disabled')).toBeDefined()

    const resolveButtons = wrapper.findAll('button').filter((button) => button.text() === 'Resolve')
    for (const button of resolveButtons) {
      await button.trigger('click')
    }

    await wrapper.vm.$nextTick()
    expect(allReconciliationRowsResolved(DEMO_SESSION_ID)).toBe(true)
    expect(organizeBtn?.attributes('disabled')).toBeUndefined()
  })

  it('shows export stub toast on export click', async () => {
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'updating_inventory')
    const router = createTestRouter()
    await router.push(`/session/${DEMO_SESSION_ID}/reconciliation`)

    const wrapper = mount(ReconciliationView, {
      global: { plugins: [router] },
    })

    const exportButton = wrapper.findAll('button').find((button) => button.text() === 'Export XML')
    await exportButton.trigger('click')

    expect(showInfoToast).toHaveBeenCalledWith(EXPORT_STUB_TOAST_MESSAGE)
    expect(wrapper.text()).not.toContain(EXPORT_STUB_TOAST_MESSAGE)
  })
})
