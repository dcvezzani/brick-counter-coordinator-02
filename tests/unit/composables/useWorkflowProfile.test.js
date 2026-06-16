import { beforeEach, describe, expect, it } from 'vitest'
import { defineComponent, effectScope } from 'vue'
import { mount } from '@vue/test-utils'
import { useWorkflowProfile } from '@/composables/useWorkflowProfile.js'
import { stubMatchMedia } from '../../setup.js'

describe('useWorkflowProfile', () => {
  let scope

  beforeEach(() => {
    scope?.stop()
    localStorage.clear()
    stubMatchMedia(false)
    scope = effectScope()
  })

  function profile(mdUp = false) {
    stubMatchMedia(mdUp)
    let result
    const Comp = defineComponent({
      setup() {
        result = useWorkflowProfile()
        return () => null
      },
    })
    scope.run(() => {
      mount(Comp)
    })
    return result
  }

  it('forces worker profile below md breakpoint', () => {
    localStorage.setItem('bcc.workflowProfile', 'coordinator')
    const { effectiveProfile, isWorkerProfile } = profile(false)

    expect(effectiveProfile.value).toBe('worker')
    expect(isWorkerProfile.value).toBe(true)
  })

  it('uses stored coordinator profile at md and above', () => {
    localStorage.setItem('bcc.workflowProfile', 'coordinator')
    const { effectiveProfile, isCoordinatorProfile } = profile(true)

    expect(effectiveProfile.value).toBe('coordinator')
    expect(isCoordinatorProfile.value).toBe(true)
  })

  it('persists worker choice when md and above', () => {
    const { setStoredProfile, effectiveProfile, storedProfile } = profile(true)

    setStoredProfile('worker')

    expect(storedProfile.value).toBe('worker')
    expect(effectiveProfile.value).toBe('worker')
  })

  it('ignores setStoredProfile below md', () => {
    const { setStoredProfile, effectiveProfile, storedProfile } = profile(false)

    setStoredProfile('coordinator')

    expect(effectiveProfile.value).toBe('worker')
    expect(storedProfile.value).toBe('coordinator')
  })
})
