import { beforeEach, describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { SESSION_COUNTING_ID } from '@/fixtures/storyboard-sessions.js'
import {
  __resetSessionsForTests,
  createDemoSession,
  DEMO_SESSION_ID,
  joinedWorkerDisplayNames,
  setPhase,
} from '@/lib/storyboard-session.js'
import { getEffectiveProfile, setWorkflowProfileSnapshot } from '@/lib/workflow-profile-state.js'
import { workflowGuard } from '@/lib/workflow-guard.js'
import HomeView from '@/views/HomeView.vue'
import SessionWaitView from '@/views/SessionWaitView.vue'
import { stubMatchMedia } from '../setup.js'

async function mountWorkerHome(router) {
  const wrapper = mount(HomeView, {
    global: { plugins: [router] },
  })
  await wrapper.get('#profile-worker').setValue(true)
  await wrapper.get('#profile-worker').trigger('change')
  await flushPromises()
  return wrapper
}

describe('integration: workflow profile', () => {
  beforeEach(async () => {
    localStorage.clear()
    __resetSessionsForTests()
    stubMatchMedia(true)
    setWorkflowProfileSnapshot({ isMdUp: true, storedProfile: 'worker' })
  })

  it('worker join navigates to counting session lot entry', async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: HomeView },
        { path: '/session/:sessionId/lot', name: 'session-lot', component: { template: '<div />' } },
        {
          path: '/session/:sessionId/wait',
          name: 'session-wait',
          component: SessionWaitView,
        },
      ],
    })

    await router.push('/')
    const wrapper = await mountWorkerHome(router)
    const nameInput = wrapper.get('input[autocomplete="nickname"]')
    await nameInput.setValue('Taylor')
    await flushPromises()

    const joinButton = wrapper
      .findAll('button')
      .find((btn) => btn.text().includes('Counting session'))
    expect(joinButton).toBeTruthy()

    await joinButton.trigger('click')
    await flushPromises()
    await router.isReady()

    expect(router.currentRoute.value.name).toBe('session-lot')
    expect(router.currentRoute.value.params.sessionId).toBe(SESSION_COUNTING_ID)
    expect(joinedWorkerDisplayNames(SESSION_COUNTING_ID)).toContain('Taylor')
  })

  it('worker join on organizing demo session navigates to my-list', async () => {
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'organizing')

    const router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: HomeView },
        {
          path: '/session/:sessionId/my-list',
          name: 'session-my-list',
          component: { template: '<div />' },
        },
        {
          path: '/session/:sessionId/wait',
          name: 'session-wait',
          component: SessionWaitView,
        },
      ],
    })

    await router.push('/')
    const wrapper = await mountWorkerHome(router)
    await wrapper.get('input[autocomplete="nickname"]').setValue('Demo Worker')
    await flushPromises()

    const joinButton = wrapper
      .findAll('button')
      .find((btn) => btn.text().includes('Demo session'))
    expect(joinButton).toBeTruthy()

    await joinButton.trigger('click')
    await flushPromises()
    await router.isReady()

    expect(router.currentRoute.value.name).toBe('session-my-list')
    expect(router.currentRoute.value.params.sessionId).toBe(DEMO_SESSION_ID)
    expect(joinedWorkerDisplayNames(DEMO_SESSION_ID)).toContain('Demo Worker')
  })

  it('worker home omits importing and reconciling sessions', async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/', component: HomeView }],
    })
    await router.push('/')
    const wrapper = await mountWorkerHome(router)

    expect(wrapper.text()).toContain('Counting session')
    expect(wrapper.text()).toContain('Organizing session')
    expect(wrapper.text()).not.toContain('Reconciling session')
    expect(wrapper.text()).not.toContain('Demo session')
  })

  it('worker cannot join reconciling session from home list', async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: HomeView },
        {
          path: '/session/:sessionId/wait',
          name: 'session-wait',
          component: SessionWaitView,
        },
      ],
    })

    await router.push('/')
    const wrapper = await mountWorkerHome(router)

    const joinButton = wrapper
      .findAll('button')
      .find((btn) => btn.text().includes('Reconciling session'))
    expect(joinButton).toBeUndefined()
  })

  it('router guard redirects worker from import route to wait', async () => {
    setWorkflowProfileSnapshot({ isMdUp: true, storedProfile: 'worker' })
    expect(getEffectiveProfile()).toBe('worker')

    const router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', name: 'home', component: { template: '<div />' } },
        {
          path: '/session/:sessionId/import',
          name: 'session-import',
          component: { template: '<div />' },
        },
        {
          path: '/session/:sessionId/wait',
          name: 'session-wait',
          component: { template: '<div />' },
        },
      ],
    })

    router.beforeEach((to) => {
      const result = workflowGuard(to, getEffectiveProfile())
      return result === true ? true : result
    })

    await router.push('/session/demo/import')
    expect(router.currentRoute.value.name).toBe('session-wait')
    expect(router.currentRoute.value.query.reason).toBe('importing')
  })
})

describe('HomeView display name', () => {
  beforeEach(() => {
    localStorage.clear()
    __resetSessionsForTests()
    stubMatchMedia(true)
    setWorkflowProfileSnapshot({ isMdUp: true, storedProfile: 'coordinator' })
  })

  it('saves display name on route leave', async () => {
    const Host = { template: '<router-view />' }
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: HomeView },
        { path: '/next', component: { template: '<div />' } },
      ],
    })

    await router.push('/')
    const wrapper = mount(Host, { global: { plugins: [router] } })

    const input = wrapper.find('input')
    await input.setValue('  Pat  ')
    await router.push('/next')
    await wrapper.vm.$nextTick()

    expect(localStorage.getItem('bcc.displayName')).toBe('Pat')
  })

  it('shows coordinator hub when profile is coordinator at md', async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/', component: HomeView }],
    })
    await router.push('/')

    const wrapper = mount(HomeView, { global: { plugins: [router] } })

    expect(wrapper.text()).toContain('Session hub')
    expect(wrapper.text()).toContain('Start demo session')
  })

  it('shows session list when profile is worker at md', async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/', component: HomeView }],
    })
    await router.push('/')

    const wrapper = await mountWorkerHome(router)

    expect(wrapper.text()).toContain('Join a session')
    expect(wrapper.text()).toContain('Counting session')
    expect(wrapper.text()).toContain('Organizing session')
    expect(wrapper.text()).not.toContain('Reconciling session')
    expect(wrapper.text()).not.toContain('Demo session')
    expect(wrapper.text()).not.toContain('Start demo session')
  })

  it('shows all storyboard sessions when profile is coordinator at md', async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/', component: HomeView }],
    })
    await router.push('/')

    const wrapper = mount(HomeView, { global: { plugins: [router] } })

    expect(wrapper.text()).toContain('Demo session')
    expect(wrapper.text()).toContain('Counting session')
    expect(wrapper.text()).toContain('Reconciling session')
    expect(wrapper.text()).toContain('Organizing session')
  })
})
