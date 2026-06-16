import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SessionViewFrame from '@/components/SessionViewFrame.vue'

const frameShellClasses = [
  'rounded-xl',
  'border',
  'border-border',
  'bg-card',
  'ring-1',
  'ring-foreground/10',
]

describe('SessionViewFrame', () => {
  it('renders default slot inside bordered frame shell', () => {
    const wrapper = mount(SessionViewFrame, {
      slots: {
        default: '<p data-test="body">Session content</p>',
      },
    })

    const shell = wrapper.find('.rounded-xl.border')
    expect(shell.exists()).toBe(true)
    expect(shell.classes()).toEqual(expect.arrayContaining(frameShellClasses))
    expect(shell.find('[data-test="body"]').text()).toBe('Session content')
  })

  it('renders header slot outside the bordered frame', () => {
    const wrapper = mount(SessionViewFrame, {
      slots: {
        header: '<h1 data-test="title">List lots</h1>',
        default: '<p>Body</p>',
      },
    })

    expect(wrapper.find('header [data-test="title"]').text()).toBe('List lots')
    expect(wrapper.find('.rounded-xl.border').text()).toBe('Body')
  })

  it('constrains width to max-w-4xl for session layout parity', () => {
    const wrapper = mount(SessionViewFrame, {
      slots: { default: '<p />' },
    })

    expect(wrapper.get('div').classes()).toEqual(
      expect.arrayContaining(['mx-auto', 'w-full', 'max-w-4xl']),
    )
  })

  it('uses compact mobile padding on the frame shell', () => {
    const wrapper = mount(SessionViewFrame, {
      slots: { default: '<p />' },
    })

    expect(wrapper.find('.rounded-xl.border').classes()).toEqual(
      expect.arrayContaining(['p-3', 'md:p-4']),
    )
  })

  it('uses tighter padding and spacing for worker variant', () => {
    const wrapper = mount(SessionViewFrame, {
      props: { variant: 'worker' },
      slots: { default: '<p />' },
    })

    expect(wrapper.get('div').classes()).toEqual(
      expect.arrayContaining(['space-y-2']),
    )
    expect(wrapper.find('.rounded-xl.border').classes()).toEqual(
      expect.arrayContaining(['p-2', 'md:p-3']),
    )
  })
})
