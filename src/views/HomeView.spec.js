import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './HomeView.vue'

describe('HomeView', () => {
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
  })
})
