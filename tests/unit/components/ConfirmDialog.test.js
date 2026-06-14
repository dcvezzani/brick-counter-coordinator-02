import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
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
    template: '<button type="button" @click="$emit(\'click\')"><slot /></button>',
  },
  AlertDialogAction: {
    emits: ['click'],
    template: '<button type="button" @click="$emit(\'click\')"><slot /></button>',
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

    const confirmButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Proceed'))
    await confirmButton.trigger('click')

    expect(wrapper.emitted('confirm')).toHaveLength(1)
  })

  it('emits cancel when dialog closes without confirm', async () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        open: true,
        title: 'Confirm',
        cancelLabel: 'Not yet',
      },
    })

    await wrapper.getComponent({ name: 'AlertDialog' }).vm.$emit('update:open', false)

    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
  })
})
