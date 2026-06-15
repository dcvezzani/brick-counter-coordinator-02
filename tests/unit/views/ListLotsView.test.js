import { describe, expect, it, beforeEach, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import ListLotsView from '@/views/ListLotsView.vue'
import {
  __resetSessionsForTests,
  createDemoSession,
  DEMO_SESSION_ID,
  getSession,
  landingRouteLocation,
  setPhase,
} from '@/lib/storyboard-session.js'

/** Migrated lot shape per #62 lot-data-model (until demo-session.js lands). */
const MIGRATED_DEMO_LOTS = [
  { id: 'lot-1', partId: '3001', colorId: 5, condition: 'U', qty: 10 },
  { id: 'lot-2', partId: '3023', colorId: 1, condition: 'U', qty: 8 },
  { id: 'lot-3', partId: '3069b', colorId: 11, condition: 'U', qty: 3 },
]

const ConfirmDialogStub = {
  name: 'ConfirmDialog',
  props: ['open', 'title', 'description', 'cancelLabel', 'confirmLabel'],
  emits: ['update:open', 'confirm', 'cancel'],
  template: `
    <div v-if="open" data-testid="confirm-dialog">
      <button type="button" @click="$emit('update:open', false); $emit('cancel')">Cancel</button>
      <button type="button" data-testid="confirm-go-back" @click="$emit('confirm')">Go back</button>
    </div>
  `,
}

function createDemoSessionWithMigratedLots() {
  createDemoSession()
  getSession(DEMO_SESSION_ID).lots = MIGRATED_DEMO_LOTS.map((lot) => ({ ...lot }))
}

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
        path: '/session/:sessionId/lot',
        name: 'session-lot',
        component: { template: '<div />' },
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
    createDemoSessionWithMigratedLots()
    const router = createTestRouter()
    await router.push(`/session/${DEMO_SESSION_ID}/lots`)

    const wrapper = mount(ListLotsView, {
      global: { plugins: [router] },
    })

    expect(wrapper.find('h1').text()).toBe('List lots')
    expect(wrapper.findComponent({ name: 'Card' }).exists()).toBe(false)
    expect(wrapper.findComponent({ name: 'ResponsiveDataTable' }).exists()).toBe(true)
    expect(wrapper.text()).toContain('3 lots')
  })

  it('browse mode shows part, color, condition, and qty — not Lot labels', async () => {
    createDemoSessionWithMigratedLots()
    const router = createTestRouter()
    await router.push(`/session/${DEMO_SESSION_ID}/lots`)

    const wrapper = mount(ListLotsView, {
      global: { plugins: [router] },
    })

    expect(wrapper.text()).not.toContain('Lot A')
    expect(wrapper.text()).not.toContain('Lot B')
    expect(wrapper.text()).toContain('3001')
    expect(wrapper.text()).toContain('Red')
    expect(wrapper.text()).toContain('Used')
    expect(wrapper.text()).toContain('10')
    expect(wrapper.text()).toContain('Condition')
    expect(wrapper.text()).toContain('Part')
    expect(wrapper.text()).toContain('Color')
    expect(wrapper.text()).toContain('Qty')
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

  it('Back to counting regresses phase from organizer mode after confirm', async () => {
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'organizing')
    const router = createTestRouter()
    await router.push(`/session/${DEMO_SESSION_ID}/lots?mode=organizer`)
    const pushSpy = vi.spyOn(router, 'push')

    const wrapper = mount(ListLotsView, {
      global: {
        plugins: [router],
        stubs: { ConfirmDialog: ConfirmDialogStub },
      },
    })

    await wrapper.get('[data-testid="back-to-counting"]').trigger('click')
    await wrapper.vm.$nextTick()
    expect(getSession(DEMO_SESSION_ID).phase).toBe('organizing')

    await wrapper.get('[data-testid="confirm-go-back"]').trigger('click')
    await flushPromises()

    expect(getSession(DEMO_SESSION_ID).phase).toBe('counting')
    expect(pushSpy).toHaveBeenCalledWith(landingRouteLocation(DEMO_SESSION_ID, 'counting'))
  })

  it('Return to reconciling regresses phase from organizer mode', async () => {
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'organizing')
    const router = createTestRouter()
    await router.push(`/session/${DEMO_SESSION_ID}/lots?mode=organizer`)
    const pushSpy = vi.spyOn(router, 'push')

    const wrapper = mount(ListLotsView, {
      global: { plugins: [router] },
    })

    await wrapper.get('[data-testid="back-to-reconciling"]').trigger('click')
    await flushPromises()

    expect(getSession(DEMO_SESSION_ID).phase).toBe('reconciling')
    expect(pushSpy).toHaveBeenCalledWith(landingRouteLocation(DEMO_SESSION_ID, 'reconciling'))
  })
})
