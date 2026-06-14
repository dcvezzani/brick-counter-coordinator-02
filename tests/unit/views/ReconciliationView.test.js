import { describe, expect, it, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import ReconciliationView from '@/views/ReconciliationView.vue'
import {
  __resetSessionsForTests,
  allReconciliationRowsResolved,
  createDemoSession,
  DEMO_SESSION_ID,
  getSession,
  setPhase,
} from '@/lib/storyboard-session.js'
import { EXPORT_STUB_TOAST_MESSAGE, showInfoToast } from '@/lib/feedback.js'
import {
  __resetCompletionCelebrationForTests,
  consumeCompletionCelebration,
} from '@/lib/completion-celebration.js'

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

const ConfirmDialogStub = {
  name: 'ConfirmDialog',
  props: ['open', 'title', 'description', 'cancelLabel', 'confirmLabel'],
  emits: ['update:open', 'confirm', 'cancel'],
  template: `
    <div v-if="open" data-testid="confirm-dialog">
      <h2>{{ title }}</h2>
      <p>{{ description }}</p>
      <button type="button" @click="$emit('update:open', false); $emit('cancel')">{{ cancelLabel }}</button>
      <button type="button" @click="$emit('confirm')">{{ confirmLabel }}</button>
    </div>
  `,
}

function mountReconciliationView(router) {
  return mount(ReconciliationView, {
    global: {
      plugins: [router],
      stubs: {
        ConfirmDialog: ConfirmDialogStub,
      },
    },
  })
}

describe('ReconciliationView', () => {
  beforeEach(() => {
    __resetSessionsForTests()
    __resetCompletionCelebrationForTests()
    vi.mocked(showInfoToast).mockClear()
  })

  it('uses ViewHeader with chapter badge instead of Card shell (reconciling)', async () => {
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'reconciling')
    const router = createTestRouter()
    await router.push(`/session/${DEMO_SESSION_ID}/reconciliation`)

    const wrapper = mountReconciliationView(router)

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

    const wrapper = mountReconciliationView(router)

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

    const wrapper = mountReconciliationView(router)

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

    const wrapper = mountReconciliationView(router)

    const exportButton = wrapper.findAll('button').find((button) => button.text() === 'Export XML')
    await exportButton.trigger('click')

    expect(showInfoToast).toHaveBeenCalledWith(EXPORT_STUB_TOAST_MESSAGE)
    expect(wrapper.text()).not.toContain(EXPORT_STUB_TOAST_MESSAGE)
  })

  it('opens confirm dialog when mark session complete is clicked', async () => {
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'updating_inventory')
    const router = createTestRouter()
    await router.push(`/session/${DEMO_SESSION_ID}/reconciliation`)

    const wrapper = mountReconciliationView(router)

    const completeButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Mark session complete'))
    await completeButton.trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Are you sure?')
    expect(wrapper.text()).toContain(
      'You are about to finish this session. Once you do, the session will be closed.',
    )
    expect(getSession(DEMO_SESSION_ID).phase).toBe('updating_inventory')
  })

  it('keeps session active when confirm is dismissed', async () => {
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'updating_inventory')
    const router = createTestRouter()
    await router.push(`/session/${DEMO_SESSION_ID}/reconciliation`)

    const wrapper = mountReconciliationView(router)

    const completeButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Mark session complete'))
    await completeButton.trigger('click')
    await wrapper.vm.$nextTick()

    const cancelButton = wrapper.findAll('button').find((button) => button.text() === 'Not yet')
    await cancelButton.trigger('click')
    await wrapper.vm.$nextTick()

    expect(getSession(DEMO_SESSION_ID).phase).toBe('updating_inventory')
    expect(router.currentRoute.value.name).toBe('session-reconciliation')
  })

  it('closes session and stages celebration when confirm proceeds', async () => {
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'updating_inventory')
    const router = createTestRouter()
    await router.push(`/session/${DEMO_SESSION_ID}/reconciliation`)

    const wrapper = mountReconciliationView(router)

    const completeButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Mark session complete'))
    await completeButton.trigger('click')
    await wrapper.vm.$nextTick()

    const confirmButton = wrapper
      .findAll('button')
      .find((button) => button.text() === 'Complete session')
    await confirmButton.trigger('click')
    await flushPromises()

    expect(getSession(DEMO_SESSION_ID).phase).toBe('closed')
    expect(router.currentRoute.value.name).toBe('home')
    expect(consumeCompletionCelebration()).toEqual({
      setNumber: '10281',
      lotCount: 3,
      totalPieces: 21,
      avgPartOutValueUsd: 127.5,
    })
  })
})
