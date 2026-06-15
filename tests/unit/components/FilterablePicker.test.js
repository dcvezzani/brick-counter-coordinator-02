import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import FilterablePicker from '@/components/FilterablePicker.vue'

const options = [
  { value: '3001', label: 'Brick 2×4' },
  { value: '3023', label: 'Plate 1×2' },
]

describe('FilterablePicker', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('opens and closes the panel from the trigger', async () => {
    const wrapper = mount(FilterablePicker, {
      props: { options },
      attachTo: document.body,
    })

    expect(wrapper.find('[data-testid="filterable-picker-panel"]').exists()).toBe(
      false,
    )

    await wrapper.find('[data-testid="filterable-picker-trigger"]').trigger('click')
    expect(wrapper.find('[data-testid="filterable-picker-panel"]').exists()).toBe(true)

    await wrapper.find('[data-testid="filterable-picker-trigger"]').trigger('click')
    expect(wrapper.find('[data-testid="filterable-picker-panel"]').exists()).toBe(
      false,
    )

    wrapper.unmount()
  })

  it('debounces filter results', async () => {
    const wrapper = mount(FilterablePicker, {
      props: { options },
      attachTo: document.body,
    })

    await wrapper.find('[data-testid="filterable-picker-trigger"]').trigger('click')
    const filter = wrapper.find('[data-testid="filterable-picker-filter"]')
    await filter.setValue('plat')

    expect(wrapper.find('[data-testid="filterable-picker-option-3023"]').exists()).toBe(
      false,
    )

    await vi.advanceTimersByTimeAsync(150)

    expect(wrapper.find('[data-testid="filterable-picker-option-3023"]').exists()).toBe(
      true,
    )

    wrapper.unmount()
  })

  it('selects the first visible option on Enter', async () => {
    const wrapper = mount(FilterablePicker, {
      props: { options, modelValue: null },
      attachTo: document.body,
    })

    await wrapper.find('[data-testid="filterable-picker-trigger"]').trigger('click')
    const filter = wrapper.find('[data-testid="filterable-picker-filter"]')
    await filter.setValue('brick')
    await vi.advanceTimersByTimeAsync(150)
    await filter.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:modelValue')).toEqual([['3001']])

    wrapper.unmount()
  })

  it('uses a custom filter function when provided', async () => {
    const filterOptions = vi.fn((query, items) =>
      items.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase()),
      ),
    )

    const wrapper = mount(FilterablePicker, {
      props: { options, filterOptions },
      attachTo: document.body,
    })

    await wrapper.find('[data-testid="filterable-picker-trigger"]').trigger('click')
    await wrapper
      .find('[data-testid="filterable-picker-filter"]')
      .setValue('PLATE')
    await vi.advanceTimersByTimeAsync(150)

    expect(filterOptions).toHaveBeenCalled()
    expect(wrapper.find('[data-testid="filterable-picker-option-3023"]').exists()).toBe(
      true,
    )

    wrapper.unmount()
  })

  it('shows minFilterChars hint until enough characters are typed', async () => {
    const wrapper = mount(FilterablePicker, {
      props: { options, minFilterChars: 3 },
      attachTo: document.body,
    })

    await wrapper.find('[data-testid="filterable-picker-trigger"]').trigger('click')
    await wrapper.find('[data-testid="filterable-picker-filter"]').setValue('pl')
    await vi.advanceTimersByTimeAsync(150)

    expect(wrapper.find('[data-testid="filterable-picker-min-chars"]').exists()).toBe(
      true,
    )
    expect(wrapper.find('[data-testid="filterable-picker-option-3023"]').exists()).toBe(
      false,
    )

    wrapper.unmount()
  })

  it('exposes focusTrigger', async () => {
    const wrapper = mount(FilterablePicker, {
      props: { options },
      attachTo: document.body,
    })

    wrapper.vm.focusTrigger()
    await vi.runAllTimersAsync()

    expect(wrapper.find('[data-testid="filterable-picker-panel"]').exists()).toBe(true)

    wrapper.unmount()
  })

  it('closes when clicking outside via focusout', async () => {
    const wrapper = mount(FilterablePicker, {
      props: { options },
      attachTo: document.body,
    })

    await wrapper.find('[data-testid="filterable-picker-trigger"]').trigger('click')
    document.body.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    await wrapper.trigger('focusout', { relatedTarget: document.body })

    expect(wrapper.find('[data-testid="filterable-picker-panel"]').exists()).toBe(
      false,
    )

    wrapper.unmount()
  })
})
