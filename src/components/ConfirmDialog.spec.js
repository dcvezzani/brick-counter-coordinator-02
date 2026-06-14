import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import ConfirmDialog from './ConfirmDialog.vue'

const mountOptions = {
  global: {
    stubs: {
      teleport: true,
    },
  },
  attachTo: document.body,
}

describe('ConfirmDialog', () => {
  it('renders title and description when open', async () => {
    const wrapper = mount(ConfirmDialog, {
      ...mountOptions,
      props: {
        open: true,
        title: 'Are you sure?',
        description: 'This cannot be undone.',
      },
    })
    await flushPromises()

    expect(wrapper.text()).toContain('Are you sure?')
    expect(wrapper.text()).toContain('This cannot be undone.')
    wrapper.unmount()
  })

  it('emits confirm when confirm action is clicked', async () => {
    const wrapper = mount(ConfirmDialog, {
      ...mountOptions,
      props: {
        open: true,
        title: 'Confirm',
        confirmLabel: 'Proceed',
      },
    })
    await flushPromises()

    const confirmButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Proceed'))
    expect(confirmButton).toBeTruthy()
    await confirmButton.trigger('click')

    expect(wrapper.emitted('confirm')).toHaveLength(1)
    wrapper.unmount()
  })

  it('emits cancel when cancel action is clicked', async () => {
    const wrapper = mount(ConfirmDialog, {
      ...mountOptions,
      props: {
        open: true,
        title: 'Confirm',
        cancelLabel: 'Not yet',
      },
    })
    await flushPromises()

    const cancelButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Not yet'))
    expect(cancelButton).toBeTruthy()
    await cancelButton.trigger('click')
    await flushPromises()

    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
    wrapper.unmount()
  })
})
