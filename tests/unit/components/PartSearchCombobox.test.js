import { mount, flushPromises } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import * as partCatalog from '@/lib/part-catalog'
import { createDemoSessionSeed } from '@/fixtures/demo-session.js'
import PartSearchCombobox from '@/components/PartSearchCombobox.vue'

const MOCK_PARTS = [
  { partId: '3001', name: 'Brick 2 x 4', source: 'catalog' },
  { partId: '3003', name: 'Brick 2 x 2', source: 'catalog' },
  { partId: '3020', name: 'Plate 2 x 4', source: 'catalog' },
]

const demoSession = createDemoSessionSeed()

function mockCatalog() {
  vi.spyOn(partCatalog, 'searchParts').mockImplementation((query) => {
    const q = String(query ?? '').trim().toLowerCase()
    if (!q) return MOCK_PARTS
    return MOCK_PARTS.filter(
      (part) =>
        part.partId.toLowerCase().includes(q) || part.name.toLowerCase().includes(q),
    )
  })
  vi.spyOn(partCatalog, 'resolvePartId').mockImplementation((raw) => {
    const trimmed = String(raw ?? '').trim()
    if (!trimmed) return null
    const match = MOCK_PARTS.find(
      (part) => part.partId.toLowerCase() === trimmed.toLowerCase(),
    )
    return match?.partId ?? null
  })
  vi.spyOn(partCatalog, 'lookupPart').mockImplementation(
    (id) => MOCK_PARTS.find((part) => part.partId === id) ?? null,
  )
}

describe('PartSearchCombobox', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('keeps the Enter-selected part instead of overwriting with the filter query', async () => {
    mockCatalog()
    const Host = {
      components: { PartSearchCombobox },
      data: () => ({ partId: '', session: demoSession }),
      template: '<PartSearchCombobox v-model="partId" :session="session" />',
    }
    const wrapper = mount(Host)

    await wrapper.get('[data-testid="part-search-trigger"]').trigger('click')
    const filter = wrapper.get('[data-testid="part-search-filter"]')
    await filter.setValue('30')
    vi.advanceTimersByTime(150)
    await flushPromises()
    await filter.trigger('keydown', { key: 'Enter' })
    await flushPromises()

    expect(wrapper.vm.partId).toBe('3001')
    expect(wrapper.find('[data-testid="part-search-resolved"]').text()).toBe('Brick 2 x 4')
  })

  it('resolves typed text on blur when the user did not pick from the list', async () => {
    mockCatalog()
    const wrapper = mount(PartSearchCombobox, {
      props: { modelValue: '', session: demoSession },
      attachTo: document.body,
    })

    await wrapper.get('[data-testid="part-search-trigger"]').trigger('click')
    const filter = wrapper.get('[data-testid="part-search-filter"]')
    await filter.setValue('3001')
    vi.advanceTimersByTime(150)
    await flushPromises()

    filter.element.blur()
    await flushPromises()

    expect(wrapper.emitted('update:modelValue')).toEqual([['3001']])
    wrapper.unmount()
  })

  it('lists part-out matches first when filtering with the real catalog', async () => {
    const session = createDemoSessionSeed()
    const wrapper = mount(PartSearchCombobox, {
      props: { modelValue: '', session },
    })

    await wrapper.get('[data-testid="part-search-trigger"]').trigger('click')
    const filter = wrapper.get('[data-testid="part-search-filter"]')
    await filter.setValue('3023')
    vi.advanceTimersByTime(150)
    await flushPromises()

    const firstOption = wrapper.find('[data-testid^="part-search-option-"]')
    expect(firstOption.attributes('data-testid')).toBe('part-search-option-3023')
    expect(firstOption.text()).toContain('Plate 1×2')
  })
})
