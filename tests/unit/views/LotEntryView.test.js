import { describe, expect, it, beforeEach, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import LotEntryView from '@/views/LotEntryView.vue'
import LotEntryForm from '@/components/LotEntryForm.vue'
import ResponsiveDataTable from '@/components/ResponsiveDataTable.vue'
import {
  __resetSessionsForTests,
  createDemoSession,
  DEMO_SESSION_ID,
  getSession,
  setPhase,
} from '@/lib/storyboard-session.js'

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
  })

  it('uses ViewHeader with h1 title instead of Card shell', async () => {
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'counting')
    const router = createTestRouter()
    await router.push(`/session/${DEMO_SESSION_ID}/lot`)

    const wrapper = mountLotEntryView(router)

    expect(wrapper.find('h1').text()).toBe('Lot entry')
    expect(wrapper.findComponent({ name: 'Card' }).exists()).toBe(false)
    expect(wrapper.text()).toContain('Count parts into lots.')
    expect(wrapper.text()).not.toContain('Lot A')
    expect(wrapper.text()).not.toContain('3001')
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

  it('advances to reconciling when Compare is clicked', async () => {
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'counting')
    const router = createTestRouter()
    await router.push(`/session/${DEMO_SESSION_ID}/lot`)
    await router.isReady()

    const push = vi.spyOn(router, 'push')

    const wrapper = mountLotEntryView(router)

    await wrapper.find('[data-slot="button"]').trigger('click')
    await flushPromises()

    expect(getSession(DEMO_SESSION_ID).phase).toBe('reconciling')
    expect(push).toHaveBeenCalledWith({
      name: 'session-reconciliation',
      params: { sessionId: DEMO_SESSION_ID },
    })
  })
})
