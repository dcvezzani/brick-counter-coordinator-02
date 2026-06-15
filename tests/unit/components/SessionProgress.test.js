import { describe, expect, it, beforeEach, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import SessionProgress from '@/components/SessionProgress.vue'
import {
  __resetSessionsForTests,
  createDemoSession,
  DEMO_SESSION_ID,
  getSession,
  landingRouteLocation,
  setPhase,
} from '@/lib/storyboard-session.js'

const ConfirmDialogStub = {
  name: 'ConfirmDialog',
  props: ['open', 'title', 'description', 'cancelLabel', 'confirmLabel'],
  emits: ['update:open', 'confirm', 'cancel'],
  template: `
    <div v-if="open" data-testid="confirm-dialog">
      <button type="button" data-testid="confirm-go-back" @click="$emit('confirm')">Go back</button>
    </div>
  `,
}

function createTestRouter() {
  return createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div />' } },
      { path: '/session/:sessionId/lot', name: 'session-lot', component: { template: '<div />' } },
      {
        path: '/session/:sessionId/reconciliation',
        name: 'session-reconciliation',
        component: { template: '<div />' },
      },
    ],
  })
}

function mountSessionProgress(router) {
  return mount(SessionProgress, {
    props: { sessionId: DEMO_SESSION_ID },
    global: {
      plugins: [router],
      stubs: { ConfirmDialog: ConfirmDialogStub },
    },
  })
}

describe('SessionProgress', () => {
  beforeEach(() => {
    __resetSessionsForTests()
  })

  it('renders past allowed step as button and current as badge', async () => {
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'reconciling')
    const router = createTestRouter()
    await router.push('/')

    const wrapper = mountSessionProgress(router)

    expect(wrapper.get('[aria-current="step"]').text()).toBe('Reconcile')
    expect(wrapper.get('[data-testid="progress-step-counting"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="progress-step-reconciling"]').exists()).toBe(false)
  })

  it('clicking Count from reconciling sets phase and navigates', async () => {
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'reconciling')
    const router = createTestRouter()
    await router.push('/')
    const pushSpy = vi.spyOn(router, 'push')

    const wrapper = mountSessionProgress(router)
    await wrapper.get('[data-testid="progress-step-counting"]').trigger('click')
    await flushPromises()

    expect(getSession(DEMO_SESSION_ID).phase).toBe('counting')
    expect(pushSpy).toHaveBeenCalledWith(landingRouteLocation(DEMO_SESSION_ID, 'counting'))
  })

  it('current step badge is not clickable', async () => {
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'reconciling')
    const router = createTestRouter()
    await router.push('/')

    const wrapper = mountSessionProgress(router)

    expect(wrapper.get('[aria-current="step"]').text()).toBe('Reconcile')
    expect(wrapper.findAll('button')).toHaveLength(1)
    expect(wrapper.find('button').text()).toBe('Count')
  })

  it('does not render Import as button when past from counting', async () => {
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'counting')
    const router = createTestRouter()
    await router.push('/')

    const wrapper = mountSessionProgress(router)

    expect(wrapper.find('[data-testid="progress-step-importing"]').exists()).toBe(false)
    expect(wrapper.text()).toContain('Import')
  })

  it('opens confirm before jumping from updating_inventory to counting', async () => {
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'updating_inventory')
    const router = createTestRouter()
    await router.push('/')

    const wrapper = mountSessionProgress(router)
    await wrapper.get('[data-testid="progress-step-counting"]').trigger('click')
    await wrapper.vm.$nextTick()

    expect(getSession(DEMO_SESSION_ID).phase).toBe('updating_inventory')
    expect(wrapper.find('[data-testid="confirm-dialog"]').exists()).toBe(true)
  })

  it('confirming multi-step back navigates to counting', async () => {
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'updating_inventory')
    const router = createTestRouter()
    await router.push('/')
    const pushSpy = vi.spyOn(router, 'push')

    const wrapper = mountSessionProgress(router)
    await wrapper.get('[data-testid="progress-step-counting"]').trigger('click')
    await wrapper.get('[data-testid="confirm-go-back"]').trigger('click')
    await flushPromises()

    expect(getSession(DEMO_SESSION_ID).phase).toBe('counting')
    expect(pushSpy).toHaveBeenCalledWith(landingRouteLocation(DEMO_SESSION_ID, 'counting'))
    expect(wrapper.find('[data-testid="confirm-dialog"]').exists()).toBe(false)
  })
})
