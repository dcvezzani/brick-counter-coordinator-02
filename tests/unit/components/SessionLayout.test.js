import { computed } from 'vue'
import { describe, expect, it, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SessionLayout from '@/components/SessionLayout.vue'
import SessionProgress from '@/components/SessionProgress.vue'
import {
  __resetSessionsForTests,
  createDemoSession,
} from '@/lib/storyboard-session.js'
import { setWorkflowProfileSnapshot } from '@/lib/workflow-profile-state.js'
import router from '@/router/index.js'
import { stubMatchMedia } from '../../setup.js'

vi.mock('@/composables/useWorkflowProfile.js', () => ({
  useWorkflowProfile: vi.fn(),
}))

import { useWorkflowProfile } from '@/composables/useWorkflowProfile.js'

function mockProfile(profile) {
  useWorkflowProfile.mockReturnValue({
    effectiveProfile: computed(() => profile),
  })
}

describe('SessionLayout', () => {
  beforeEach(async () => {
    localStorage.clear()
    stubMatchMedia(true)
    setWorkflowProfileSnapshot({ isMdUp: true, storedProfile: 'coordinator' })
    mockProfile('coordinator')
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

  it('uses coordinator spacing on lots route when profile is coordinator', async () => {
    mockProfile('coordinator')
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

  it('uses worker spacing on lots route when profile is worker', async () => {
    mockProfile('worker')
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
    expect(progress.props('compact')).toBe(true)
    expect(wrapper.get('main').classes()).toEqual(
      expect.arrayContaining(['space-y-2', 'pt-2']),
    )
  })
})
