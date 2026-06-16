import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SessionLayout from '@/components/SessionLayout.vue'
import SessionProgress from '@/components/SessionProgress.vue'
import {
  __resetSessionsForTests,
  createDemoSession,
} from '@/lib/storyboard-session.js'
import router from '@/router/index.js'

describe('SessionLayout', () => {
  beforeEach(async () => {
    __resetSessionsForTests()
    await router.push('/')
  })

  it('passes compact progress on worker shell routes', async () => {
    createDemoSession()
    await router.push('/session/demo/lot')

    const wrapper = mount(SessionLayout, {
      global: {
        plugins: [router],
        stubs: {
          SessionNav: true,
          StoryboardPhaseControls: true,
          RouterView: true,
        },
      },
    })

    const progress = wrapper.findComponent(SessionProgress)
    expect(progress.exists()).toBe(true)
    expect(progress.props('compact')).toBe(true)
    expect(wrapper.get('main').classes()).toEqual(
      expect.arrayContaining(['space-y-2', 'pt-2']),
    )
  })

  it('uses coordinator spacing on lots route', async () => {
    createDemoSession()
    await router.push('/session/demo/lots')

    const wrapper = mount(SessionLayout, {
      global: {
        plugins: [router],
        stubs: {
          SessionNav: true,
          StoryboardPhaseControls: true,
          RouterView: true,
        },
      },
    })

    const progress = wrapper.findComponent(SessionProgress)
    expect(progress.props('compact')).toBe(false)
    expect(wrapper.get('main').classes()).toEqual(
      expect.arrayContaining(['space-y-4', 'pt-4']),
    )
  })
})
