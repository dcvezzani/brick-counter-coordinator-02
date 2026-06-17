import { describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import BrickLinkAuthDialog from '@/components/BrickLinkAuthDialog.vue'

const push = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({ push }),
}))

vi.mock('@/components/ui/alert-dialog', () => ({
  AlertDialog: {
    name: 'AlertDialog',
    props: ['open'],
    emits: ['update:open'],
    template: '<div v-if="open" data-testid="bricklink-auth-dialog"><slot /></div>',
  },
  AlertDialogContent: { template: '<div><slot /></div>' },
  AlertDialogHeader: { template: '<div><slot /></div>' },
  AlertDialogFooter: { template: '<div><slot /></div>' },
  AlertDialogTitle: { template: '<h2><slot /></h2>' },
  AlertDialogDescription: { template: '<p><slot /></p>' },
  AlertDialogCancel: {
    template: '<button type="button" data-testid="auth-cancel"><slot /></button>',
  },
  AlertDialogAction: {
    emits: ['click'],
    template:
      '<button type="button" data-testid="auth-save" @click="$emit(\'click\')"><slot /></button>',
  },
}))

describe('BrickLinkAuthDialog', () => {
  it('emits save with trimmed cookie text', async () => {
    const wrapper = mount(BrickLinkAuthDialog, {
      props: { open: true, required: false },
    })

    await wrapper.find('textarea').setValue('  session=abc  ')
    await wrapper.get('[data-testid="auth-save"]').trigger('click')

    expect(wrapper.emitted('save')?.[0]).toEqual(['session=abc'])
  })

  it('shows Back to Home when showBackToHome is true', async () => {
    const wrapper = mount(BrickLinkAuthDialog, {
      props: { open: true, required: true, showBackToHome: true },
    })

    await wrapper.get('button').trigger('click')
    await flushPromises()

    expect(push).toHaveBeenCalledWith({ name: 'home' })
  })
})
