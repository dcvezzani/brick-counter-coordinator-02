import { mount, flushPromises } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import * as setCatalog from '@/lib/set-catalog'
import SetSearchCombobox from '@/components/SetSearchCombobox.vue'

const MOCK_SETS = [
  { setNumber: '10281-1', name: 'Bonsai Tree' },
  { setNumber: '10281-2', name: 'Bonsai Tree (variant 2)' },
  { setNumber: '21309-1', name: 'NASA Apollo Saturn V' },
]

function mockCatalog() {
  vi.spyOn(setCatalog, 'searchSets').mockImplementation((query) => {
    const q = String(query ?? '').trim().toLowerCase()
    if (!q) return MOCK_SETS
    return MOCK_SETS.filter(
      (set) =>
        set.setNumber.toLowerCase().includes(q) || set.name.toLowerCase().includes(q),
    )
  })
  vi.spyOn(setCatalog, 'resolveSetNumber').mockImplementation((raw) => {
    const trimmed = String(raw ?? '').trim()
    if (!trimmed) return null
    const normalized = /^\d+$/.test(trimmed) ? `${trimmed}-1` : trimmed
    const match = MOCK_SETS.find((set) => set.setNumber === normalized)
    return match?.setNumber ?? null
  })
  vi.spyOn(setCatalog, 'lookupSet').mockImplementation(
    (id) => MOCK_SETS.find((set) => set.setNumber === id) ?? null,
  )
}

describe('SetSearchCombobox', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('shows resolved name when modelValue is a known set', () => {
    const wrapper = mount(SetSearchCombobox, {
      props: { modelValue: '10281-1' },
    })

    expect(wrapper.find('[data-testid="set-search-resolved"]').text()).toBe('Bonsai Tree')
  })

  it('keeps the Enter-selected set instead of overwriting with the filter query', async () => {
    mockCatalog()
    const Host = {
      components: { SetSearchCombobox },
      data: () => ({ setNumber: '' }),
      template: '<SetSearchCombobox v-model="setNumber" />',
    }
    const wrapper = mount(Host)

    await wrapper.get('[data-testid="set-search-trigger"]').trigger('click')
    const filter = wrapper.get('[data-testid="set-search-filter"]')
    await filter.setValue('102')
    vi.advanceTimersByTime(150)
    await flushPromises()
    await filter.trigger('keydown', { key: 'Enter' })
    await flushPromises()

    expect(wrapper.vm.setNumber).toBe('10281-1')
    expect(wrapper.find('[data-testid="set-search-resolved"]').text()).toBe('Bonsai Tree')
  })

  it('resolves typed bare digits on blur when the user did not pick from the list', async () => {
    mockCatalog()
    const wrapper = mount(SetSearchCombobox, {
      props: { modelValue: '' },
      attachTo: document.body,
    })

    await wrapper.get('[data-testid="set-search-trigger"]').trigger('click')
    const filter = wrapper.get('[data-testid="set-search-filter"]')
    await filter.setValue('10281')
    vi.advanceTimersByTime(150)
    await flushPromises()

    filter.element.blur()
    await flushPromises()

    expect(wrapper.emitted('update:modelValue')).toEqual([['10281-1']])
    wrapper.unmount()
  })

  it('filters sets with the real catalog', async () => {
    const wrapper = mount(SetSearchCombobox, {
      props: { modelValue: '' },
    })

    await wrapper.get('[data-testid="set-search-trigger"]').trigger('click')
    const filter = wrapper.get('[data-testid="set-search-filter"]')
    await filter.setValue('apollo')
    vi.advanceTimersByTime(150)
    await flushPromises()

    const firstOption = wrapper.find('[data-testid^="set-search-option-"]')
    expect(firstOption.attributes('data-testid')).toBe('set-search-option-21309-1')
    expect(firstOption.text()).toContain('NASA Apollo Saturn V')
  })
})
