import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import SessionWaitView from '@/views/SessionWaitView.vue'

describe('SessionWaitView', () => {
  it('renders reconciling copy and back action', async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: '/session/:sessionId/wait',
          component: SessionWaitView,
        },
      ],
    })

    await router.push('/session/demo/wait?reason=reconciling')

    const wrapper = mount(SessionWaitView, {
      global: { plugins: [router] },
    })

    expect(wrapper.text()).toContain('Coordinator is reconciling')
    expect(wrapper.text()).toContain('Back to session list')
    expect(wrapper.text()).not.toContain('SessionNav')
  })
})
