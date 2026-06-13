import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ResponsiveDataTable from './ResponsiveDataTable.vue'

const fixtureItems = [
  { id: 'line-1', partId: '3001', name: 'Brick 2×4', color: 'Red', quantity: 12 },
  { id: 'line-2', partId: '3003', name: 'Brick 2×2', color: 'Blue', quantity: 8 },
  { id: 'line-3', partId: '3020', name: 'Plate 2×4', color: 'Yellow', quantity: 4 },
]

const fixtureColumns = [
  { key: 'partId', header: 'Part' },
  { key: 'name', header: 'Name' },
  { key: 'color', header: 'Color' },
  { key: 'quantity', header: 'Qty' },
]

function mountTable(overrides = {}) {
  return mount(ResponsiveDataTable, {
    props: {
      items: fixtureItems,
      columns: fixtureColumns,
      rowKey: 'id',
      ...overrides.props,
    },
    slots: overrides.slots,
  })
}

describe('ResponsiveDataTable', () => {
  it('renders N rows for fixture data in table and mobile list', () => {
    const wrapper = mountTable()

    for (const column of fixtureColumns) {
      expect(wrapper.text()).toContain(column.header)
    }

    for (const item of fixtureItems) {
      expect(wrapper.text()).toContain(item.partId)
      expect(wrapper.text()).toContain(item.name)
      expect(wrapper.text()).toContain(item.color)
      expect(String(item.quantity)).toBeTruthy()
      expect(wrapper.text()).toContain(String(item.quantity))
    }

    expect(wrapper.findAll('tbody tr')).toHaveLength(fixtureItems.length)
    expect(wrapper.findAll('ul[role="list"] li')).toHaveLength(fixtureItems.length)
  })

  it('supports custom cell and mobile slots', () => {
    const wrapper = mountTable({
      slots: {
        'cell-quantity': '<span class="qty-slot">Qty {{ value }}</span>',
        mobile: '<p class="mobile-slot">{{ item.name }}</p>',
      },
    })

    expect(wrapper.findAll('.qty-slot')).toHaveLength(fixtureItems.length)
    expect(wrapper.findAll('.mobile-slot')).toHaveLength(fixtureItems.length)
    expect(wrapper.text()).toContain('Qty 12')
    expect(wrapper.text()).toContain('Brick 2×4')
  })

  it('uses accessor functions for computed column values', () => {
    const wrapper = mountTable({
      props: {
        columns: [
          {
            key: 'summary',
            header: 'Summary',
            accessor: (item) => `${item.name} (${item.color})`,
          },
        ],
      },
    })

    expect(wrapper.text()).toContain('Brick 2×4 (Red)')
    expect(wrapper.text()).toContain('Brick 2×2 (Blue)')
    expect(wrapper.text()).toContain('Plate 2×4 (Yellow)')
  })
})
