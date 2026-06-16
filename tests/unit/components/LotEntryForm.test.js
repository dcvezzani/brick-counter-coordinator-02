import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { createDemoSessionSeed, DEMO_SESSION_ID } from '@/fixtures/demo-session.js'
import { __resetSessionsForTests, createDemoSession } from '@/lib/storyboard-session.js'

vi.mock('@/lib/storyboard-session.js', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    saveLot: vi.fn(),
  }
})

vi.mock('@/lib/feedback.js', () => ({
  showSuccessToast: vi.fn(),
}))

vi.mock('@/components/PartSearchCombobox.vue', () => ({
  default: defineComponent({
    name: 'PartSearchCombobox',
    props: ['modelValue', 'session'],
    emits: ['update:modelValue', 'tabForward'],
    setup(props, { emit, expose }) {
      expose({ focus: () => {} })
      return () =>
        h('input', {
          'data-testid': 'stub-part-input',
          value: props.modelValue,
          onInput: (event) => emit('update:modelValue', event.target.value),
        })
    },
  }),
}))

vi.mock('@/components/ColorPicker.vue', () => ({
  default: defineComponent({
    name: 'ColorPicker',
    props: ['modelValue', 'colors'],
    emits: ['update:modelValue'],
    setup(props, { emit, expose }) {
      expose({ focusFilter: () => {} })
      return () =>
        h('input', {
          'data-testid': 'stub-color-input',
          type: 'number',
          value: props.modelValue ?? '',
          onInput: (event) => emit('update:modelValue', Number(event.target.value)),
        })
    },
  }),
}))

import { saveLot } from '@/lib/storyboard-session.js'
import { showSuccessToast } from '@/lib/feedback.js'
import LotEntryForm from '@/components/LotEntryForm.vue'

function mountForm(sessionOverrides = {}) {
  const session = { ...createDemoSessionSeed(), partOutOptions: { condition: 'used' }, ...sessionOverrides }
  createDemoSession()
  const wrapper = mount(LotEntryForm, {
    props: {
      sessionId: DEMO_SESSION_ID,
      session,
    },
    global: {
      stubs: {
        ConfirmDialog: {
          props: ['open', 'title', 'description', 'confirmLabel', 'cancelLabel'],
          emits: ['confirm', 'cancel', 'update:open'],
          template: `
            <div v-if="open" data-testid="confirm-dialog-stub">
              <p>{{ title }}</p>
              <p>{{ description }}</p>
              <button data-testid="confirm-dialog-confirm" @click="$emit('confirm')">{{ confirmLabel }}</button>
              <button data-testid="confirm-dialog-cancel" @click="$emit('cancel')">{{ cancelLabel }}</button>
            </div>
          `,
        },
      },
    },
  })
  return { wrapper, session }
}

async function fillForm(wrapper, { partId = '3001', colorId = 5, qty = 3 } = {}) {
  await wrapper.find('[data-testid="stub-part-input"]').setValue(partId)
  await wrapper.find('[data-testid="stub-color-input"]').setValue(String(colorId))
  if (qty !== 1) {
    await wrapper.find('[data-testid="lot-entry-qty-input"]').setValue(String(qty))
    await wrapper.find('[data-testid="lot-entry-qty-input"]').trigger('blur')
  }
}

function qtyInputValue(wrapper) {
  return wrapper.find('[data-testid="lot-entry-qty-input"]').element.value
}

function tapQtyPlus(wrapper) {
  const plus = wrapper.get('[data-testid="lot-entry-qty-plus"]').element
  plus.dispatchEvent(
    new PointerEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
      clientX: 190,
      clientY: 22,
      pointerId: 1,
      pointerType: 'mouse',
    }),
  )
  window.dispatchEvent(
    new PointerEvent('pointerup', {
      bubbles: true,
      cancelable: true,
      clientX: 190,
      clientY: 22,
      pointerId: 1,
      pointerType: 'mouse',
    }),
  )
}

function tapQtyMinus(wrapper) {
  const minus = wrapper.get('[data-testid="lot-entry-qty-minus"]').element
  minus.dispatchEvent(
    new PointerEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
      clientX: 10,
      clientY: 22,
      pointerId: 1,
      pointerType: 'mouse',
    }),
  )
  window.dispatchEvent(
    new PointerEvent('pointerup', {
      bubbles: true,
      cancelable: true,
      clientX: 10,
      clientY: 22,
      pointerId: 1,
      pointerType: 'mouse',
    }),
  )
}

describe('LotEntryForm', () => {
  beforeEach(() => {
    __resetSessionsForTests()
    vi.clearAllMocks()
    saveLot.mockReturnValue({ lot: { id: 'lot-new' }, duplicate: false })
  })

  it('save calls saveLot with four fields', async () => {
    const { wrapper } = mountForm()
    await fillForm(wrapper, { qty: 3 })
    await wrapper.find('[data-testid="lot-entry-save"]').trigger('click')
    await flushPromises()

    expect(saveLot).toHaveBeenCalledWith(DEMO_SESSION_ID, {
      partId: '3001',
      colorId: 5,
      condition: 'U',
      qty: 3,
    })
  })

  it('shows success toast after save', async () => {
    const { wrapper } = mountForm()
    await fillForm(wrapper)
    await wrapper.find('[data-testid="lot-entry-save"]').trigger('click')
    await flushPromises()

    expect(showSuccessToast).toHaveBeenCalledWith('Lot saved')
  })

  it('opens duplicate confirm and merges on confirm', async () => {
    saveLot
      .mockReturnValueOnce({
        duplicate: true,
        existing: { qty: 10 },
        lot: { id: 'lot-1' },
      })
      .mockReturnValueOnce({
        lot: { id: 'lot-1', qty: 13 },
        duplicate: false,
        merged: true,
      })

    const { wrapper } = mountForm()
    await fillForm(wrapper)
    await wrapper.find('[data-testid="lot-entry-save"]').trigger('click')
    await flushPromises()

    expect(wrapper.find('[data-testid="lot-entry-duplicate-confirm"]').exists()).toBe(true)
    await wrapper.find('[data-testid="confirm-dialog-confirm"]').trigger('click')
    await flushPromises()

    expect(saveLot).toHaveBeenLastCalledWith(DEMO_SESSION_ID, {
      partId: '3001',
      colorId: 5,
      condition: 'U',
      qty: 3,
      mergeDuplicate: true,
    })
    expect(showSuccessToast).toHaveBeenCalledWith('Lot updated')
  })

  it('updates qty with stepper buttons', async () => {
    const { wrapper } = mountForm()
    expect(qtyInputValue(wrapper)).toBe('1')

    tapQtyPlus(wrapper)
    tapQtyPlus(wrapper)
    await flushPromises()
    expect(qtyInputValue(wrapper)).toBe('3')

    tapQtyMinus(wrapper)
    await flushPromises()
    expect(qtyInputValue(wrapper)).toBe('2')
  })

  it('clamps qty at minimum 1 when decrementing', async () => {
    const { wrapper } = mountForm()
    tapQtyMinus(wrapper)
    await flushPromises()
    expect(qtyInputValue(wrapper)).toBe('1')
  })

  it('save and add another resets fields', async () => {
    const { wrapper } = mountForm()
    await fillForm(wrapper, { partId: '3023', colorId: 7, qty: 2 })
    await wrapper.find('[data-testid="lot-entry-save-add"]').trigger('click')
    await flushPromises()

    expect(wrapper.find('[data-testid="stub-part-input"]').element.value).toBe('')
    expect(wrapper.find('[data-testid="stub-color-input"]').element.value).toBe('')
    expect(qtyInputValue(wrapper)).toBe('1')
  })

  it('shows read-only condition for used session', () => {
    const { wrapper } = mountForm({ partOutOptions: { condition: 'used' } })
    expect(wrapper.find('[data-testid="lot-entry-condition-readonly"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="lot-entry-condition-readonly"]').text()).toBe('Used')
    expect(wrapper.find('[data-testid="lot-entry-condition-new"]').exists()).toBe(false)
  })

  it('shows choosable condition toggles for mixed session', async () => {
    const { wrapper } = mountForm({ partOutOptions: { condition: 'mixed' } })
    expect(wrapper.find('[data-testid="lot-entry-condition-new"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="lot-entry-condition-used"]').exists()).toBe(true)

    await wrapper.find('[data-testid="lot-entry-condition-new"]').trigger('click')
    await fillForm(wrapper)
    await wrapper.find('[data-testid="lot-entry-save"]').trigger('click')
    await flushPromises()

    expect(saveLot).toHaveBeenCalledWith(
      DEMO_SESSION_ID,
      expect.objectContaining({ condition: 'N' }),
    )
  })

  it('shows inline validation errors without calling saveLot', async () => {
    const { wrapper } = mountForm()
    await wrapper.find('[data-testid="lot-entry-save"]').trigger('click')
    await flushPromises()

    expect(saveLot).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('Part is required')
    expect(wrapper.text()).toContain('Color is required')
  })

  it('emits saved after successful save', async () => {
    const { wrapper } = mountForm()
    await fillForm(wrapper)
    await wrapper.find('[data-testid="lot-entry-save"]').trigger('click')
    await flushPromises()

    expect(wrapper.emitted('saved')).toHaveLength(1)
    expect(wrapper.emitted('saved')[0][0]).toEqual({
      lot: { id: 'lot-new' },
      merged: false,
    })
  })
})
