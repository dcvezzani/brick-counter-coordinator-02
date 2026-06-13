import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ViewHeader from './ViewHeader.vue'

describe('ViewHeader', () => {
  it('renders title as a single h1 with description', () => {
    const wrapper = mount(ViewHeader, {
      props: {
        title: 'Reconciliation',
        description: 'Compare part-out lines with lot counts.',
      },
    })

    expect(wrapper.findAll('h1')).toHaveLength(1)
    expect(wrapper.get('h1').text()).toBe('Reconciliation')
    expect(wrapper.text()).toContain('Compare part-out lines with lot counts.')
  })

  it('renders site size title classes for Home', () => {
    const wrapper = mount(ViewHeader, {
      props: {
        title: 'Brick Counter Coordinator',
        description: 'Coordinate LEGO part-out counting sessions.',
        size: 'site',
      },
    })

    expect(wrapper.get('h1').classes()).toEqual(
      expect.arrayContaining(['text-3xl', 'font-semibold', 'tracking-tight']),
    )
  })

  it('renders badge and leading slots', () => {
    const wrapper = mount(ViewHeader, {
      props: {
        title: 'Part-out import',
        description: 'Confirm the part-out list.',
      },
      slots: {
        leading: '<button type="button">Back</button>',
        badge: '<span data-test="chapter">Step 4</span>',
      },
    })

    expect(wrapper.find('button').text()).toBe('Back')
    expect(wrapper.find('[data-test="chapter"]').text()).toBe('Step 4')
  })

})
