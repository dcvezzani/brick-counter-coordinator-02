import { describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

vi.mock('@/components/ui/alert-dialog', () => ({
  AlertDialog: {
    name: 'AlertDialog',
    props: ['open'],
    emits: ['update:open'],
    template: `
      <div v-if="open" data-testid="alert-dialog-root">
        <slot />
      </div>
    `,
  },
  AlertDialogContent: {
    template: '<div data-testid="alert-dialog-content"><slot /></div>',
  },
  AlertDialogHeader: {
    template: '<div><slot /></div>',
  },
  AlertDialogFooter: {
    template: '<div><slot /></div>',
  },
  AlertDialogTitle: {
    template: '<h2><slot /></h2>',
  },
  AlertDialogDescription: {
    template: '<p><slot /></p>',
  },
  AlertDialogCancel: {
    emits: ['click'],
    template: '<button type="button" data-testid="alert-cancel" @click="$emit(\'click\')"><slot /></button>',
  },
  AlertDialogAction: {
    emits: ['click', 'pointerdown'],
    template:
      '<button type="button" data-testid="alert-confirm" @pointerdown="$emit(\'pointerdown\')" @click="$emit(\'click\')"><slot /></button>',
  },
}))

describe('ConfirmDialog', () => {
  it('renders title and description when open', () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        open: true,
        title: 'Are you sure?',
        description: 'This cannot be undone.',
      },
    })

    expect(wrapper.text()).toContain('Are you sure?')
    expect(wrapper.text()).toContain('This cannot be undone.')
  })

  it('emits confirm when confirm action is clicked', async () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        open: true,
        title: 'Confirm',
        confirmLabel: 'Proceed',
      },
    })

    await wrapper.get('[data-testid="alert-confirm"]').trigger('click')

    expect(wrapper.emitted('confirm')).toHaveLength(1)
    expect(wrapper.emitted('cancel')).toBeUndefined()
  })

  it('does not emit cancel when dialog closes during confirm click', async () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        open: true,
        title: 'Confirm',
        confirmLabel: 'Go back',
      },
    })

    const alertDialog = wrapper.getComponent({ name: 'AlertDialog' })
    const confirmButton = wrapper.get('[data-testid="alert-confirm"]')

    await confirmButton.trigger('pointerdown')
    alertDialog.vm.$emit('update:open', false)
    await confirmButton.trigger('click')
    await flushPromises()

    expect(wrapper.emitted('confirm')).toHaveLength(1)
    expect(wrapper.emitted('cancel')).toBeUndefined()
  })

  it('emits cancel when cancel button is clicked', async () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        open: true,
        title: 'Confirm',
        cancelLabel: 'Not yet',
      },
    })

    await wrapper.get('[data-testid="alert-cancel"]').trigger('click')
    await flushPromises()

    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('confirm')).toBeUndefined()
  })

  it('emits cancel when dialog closes without confirm or cancel button', async () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        open: true,
        title: 'Confirm',
        cancelLabel: 'Not yet',
      },
    })

    await wrapper.getComponent({ name: 'AlertDialog' }).vm.$emit('update:open', false)
    await flushPromises()

    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
  })
})
