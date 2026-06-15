import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ColorPicker from '@/components/ColorPicker.vue'
import { createDemoSessionSeed } from '@/fixtures/demo-session'
import { toPickerColors } from '@/lib/bricklink-colors'
import { getColorsForPart } from '@/lib/part-catalog'

describe('ColorPicker catalog wire', () => {
  it('shows Red for part 3001 via getColorsForPart and toPickerColors', async () => {
    const session = createDemoSessionSeed()
    const pickerColors = toPickerColors(getColorsForPart('3001', { session }))

    const wrapper = mount(ColorPicker, {
      props: {
        colors: pickerColors,
        modelValue: null,
      },
      attachTo: document.body,
    })

    await wrapper.find('[data-testid="color-picker-trigger"]').trigger('click')

    expect(wrapper.find('[data-testid="color-picker-option-5"]').text()).toContain(
      'Red',
    )

    wrapper.unmount()
  })
})
