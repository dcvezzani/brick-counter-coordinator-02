import { describe, expect, it, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './HomeView.vue'
import {
  __resetCompletionCelebrationForTests,
  COMPLETION_TOAST_DURATION_MS,
  formatCelebrationMessage,
  stageCompletionCelebration,
} from '@/lib/completion-celebration.js'
import { showSuccessToast } from '@/lib/feedback.js'

vi.mock('@/lib/feedback.js', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    showSuccessToast: vi.fn(),
  }
})

describe('HomeView', () => {
  beforeEach(() => {
    __resetCompletionCelebrationForTests()
    vi.mocked(showSuccessToast).mockClear()
  })

  it('renders session hub instead of hello', async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: HomeView },
        { path: '/session/new', component: { template: '<div />' } },
      ],
    })
    await router.push('/')

    const wrapper = mount(HomeView, {
      global: { plugins: [router] },
    })

    expect(wrapper.text()).not.toMatch(/^hello$/i)
    expect(wrapper.text()).toContain('Brick Counter Coordinator')
    expect(wrapper.text()).toContain('Start demo session')
    expect(wrapper.findAll('h1')).toHaveLength(1)
  })

  it('shows celebration toast when completion was staged', async () => {
    const summary = {
      setNumber: '10281',
      lotCount: 3,
      totalPieces: 21,
      avgPartOutValueUsd: 127.5,
    }
    stageCompletionCelebration(summary)

    const router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/', component: HomeView }],
    })
    await router.push('/')

    mount(HomeView, {
      global: { plugins: [router] },
    })

    expect(showSuccessToast).toHaveBeenCalledWith(formatCelebrationMessage(summary), {
      duration: COMPLETION_TOAST_DURATION_MS,
    })
  })

  it('does not show celebration toast on ordinary home visit', async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/', component: HomeView }],
    })
    await router.push('/')

    mount(HomeView, {
      global: { plugins: [router] },
    })

    expect(showSuccessToast).not.toHaveBeenCalled()
  })
})
