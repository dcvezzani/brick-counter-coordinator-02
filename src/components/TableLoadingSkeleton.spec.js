import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import TableLoadingSkeleton from './TableLoadingSkeleton.vue'

describe('TableLoadingSkeleton', () => {
  it('renders the default number of skeleton rows', () => {
    const wrapper = mount(TableLoadingSkeleton)

    expect(wrapper.find('[data-testid="table-loading-skeleton"]').exists()).toBe(true)
    expect(wrapper.findAll('[data-slot="skeleton"]')).toHaveLength(4)
  })

  it('renders a custom row count', () => {
    const wrapper = mount(TableLoadingSkeleton, {
      props: { rows: 3 },
    })

    expect(wrapper.findAll('[data-slot="skeleton"]')).toHaveLength(3)
  })
})
