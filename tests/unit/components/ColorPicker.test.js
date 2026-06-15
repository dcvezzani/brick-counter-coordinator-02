import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ColorPicker from '@/components/ColorPicker.vue'

const colors = [
  { id: 5, name: 'Red', hex: '#C91A09' },
  { id: 1, name: 'Blue', hex: '#0055BF' },
  { id: 11, name: 'Black', hex: '#05131D' },
]

describe('ColorPicker', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('opens the panel and filters colors by substring', async () => {
    const wrapper = mount(ColorPicker, {
      props: { colors, modelValue: null },
      attachTo: document.body,
    })

    await wrapper.find('[data-testid="color-picker-trigger"]').trigger('click')
    await wrapper.find('[data-testid="color-picker-filter"]').setValue('bla')
    await vi.advanceTimersByTimeAsync(150)

    expect(wrapper.find('[data-testid="color-picker-option-11"]').exists()).toBe(
      true,
    )

    wrapper.unmount()
  })

  it('emits numeric color id on selection', async () => {
    const wrapper = mount(ColorPicker, {
      props: { colors, modelValue: null },
      attachTo: document.body,
    })

    await wrapper.find('[data-testid="color-picker-trigger"]').trigger('click')
    await wrapper.find('[data-testid="color-picker-option-5"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([[5]])

    wrapper.unmount()
  })

  it('clears selection to null when None is chosen', async () => {
    const wrapper = mount(ColorPicker, {
      props: { colors, modelValue: 5 },
      attachTo: document.body,
    })

    await wrapper.find('[data-testid="color-picker-trigger"]').trigger('click')
    await wrapper.find('[data-testid="color-picker-none"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([[null]])

    wrapper.unmount()
  })

  it('is disabled when colors are empty', () => {
    const wrapper = mount(ColorPicker, {
      props: { colors: [], modelValue: null },
    })

    expect(wrapper.find('[data-testid="color-picker-trigger"]').attributes('disabled')).toBeDefined()
  })

  it('renders swatch fallback when hex is missing', async () => {
    const wrapper = mount(ColorPicker, {
      props: {
        colors: [{ id: 99, name: 'Unknown' }],
        modelValue: 99,
      },
      attachTo: document.body,
    })

    const swatch = wrapper.find('[data-testid="color-picker-trigger-swatch"]')
    expect(swatch.attributes('style')).toContain('background-color: rgb(204, 204, 204)')

    wrapper.unmount()
  })

  it('selects first match on Enter after debounce', async () => {
    const wrapper = mount(ColorPicker, {
      props: { colors, modelValue: null },
      attachTo: document.body,
    })

    await wrapper.find('[data-testid="color-picker-trigger"]').trigger('click')
    const filter = wrapper.find('[data-testid="color-picker-filter"]')
    await filter.setValue('red')
    await vi.advanceTimersByTimeAsync(150)
    await filter.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:modelValue')).toEqual([[5]])

    wrapper.unmount()
  })

  it('exposes focus and focusFilter', async () => {
    const wrapper = mount(ColorPicker, {
      props: { colors, modelValue: null },
      attachTo: document.body,
    })

    wrapper.vm.focus()
    await vi.runAllTimersAsync()
    expect(wrapper.find('[data-testid="color-picker-panel"]').exists()).toBe(true)

    wrapper.vm.focusFilter()
    await vi.runAllTimersAsync()
    expect(document.activeElement?.getAttribute('data-testid')).toBe(
      'color-picker-filter',
    )

    wrapper.unmount()
  })
})
