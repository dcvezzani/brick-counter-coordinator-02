import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ViewActions from '@/components/ViewActions.vue'

describe('ViewActions', () => {
  it('renders default slot buttons', () => {
    const wrapper = mount(ViewActions, {
      slots: { default: '<button type="button">Continue</button>' },
    })

    expect(wrapper.text()).toContain('Continue')
  })

  it('renders optional hint slot above actions', () => {
    const wrapper = mount(ViewActions, {
      slots: {
        hint: '<p class="hint">Resolve all rows first.</p>',
        default: '<button type="button">Continue</button>',
      },
    })

    expect(wrapper.text()).toContain('Resolve all rows first.')
    const hint = wrapper.find('.hint')
    const button = wrapper.find('button')
    expect(
      hint.element.compareDocumentPosition(button.element) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })

  it('applies sticky footer classes on phone and static on md+', () => {
    const wrapper = mount(ViewActions, {
      slots: { default: '<button type="button">Go</button>' },
    })
    const root = wrapper.find('[data-testid="view-actions"]')

    expect(root.classes()).toContain('sticky')
    expect(root.classes()).toContain('bottom-0')
    expect(root.classes()).toContain('mt-4')
    expect(root.classes()).toContain('border-t')
    expect(root.classes()).toContain('px-4')
    expect(root.classes()).toContain('pt-4')
    expect(root.classes()).not.toContain('p-4')
    expect(root.classes()).toContain('md:static')
    expect(root.classes()).toContain('md:mt-0')
    expect(root.classes()).toContain('md:border-0')
    expect(root.classes()).toContain('backdrop-blur')
    expect(root.classes()).toContain('pb-[max(1rem,env(safe-area-inset-bottom))]')
  })

  it('keeps divider and spacing on md+ when separated', () => {
    const wrapper = mount(ViewActions, {
      props: { separated: true },
      slots: { default: '<button type="button">Go</button>' },
    })
    const root = wrapper.find('[data-testid="view-actions"]')

    expect(root.classes()).toContain('border-t')
    expect(root.classes()).toContain('mt-4')
    expect(root.classes()).toContain('pt-4')
    expect(root.classes()).not.toContain('md:mt-0')
    expect(root.classes()).not.toContain('md:border-0')
    expect(root.classes()).toContain('md:px-0')
    expect(root.classes()).toContain('md:pb-0')
  })

  it('wraps buttons in a flex layout container', () => {
    const wrapper = mount(ViewActions, {
      slots: {
        default: '<button type="button">A</button><button type="button">B</button>',
      },
    })

    const flexContainer = wrapper.find('.flex.flex-wrap.gap-2')
    expect(flexContainer.exists()).toBe(true)
    expect(flexContainer.findAll('button')).toHaveLength(2)
  })

  it('applies primary action minimum heights to slot buttons via data-slot selector', () => {
    const wrapper = mount(ViewActions, {
      slots: { default: '<button type="button">Go</button>' },
    })

    const flexContainer = wrapper.find('.flex.flex-wrap.gap-2')
    expect(flexContainer.classes()).toContain('[&_[data-slot=button]]:min-h-11')
    expect(flexContainer.classes()).toContain('[&_[data-slot=button]]:md:min-h-9')
  })

  it('adds vertical spacing when hint slot is present', () => {
    const wrapper = mount(ViewActions, {
      slots: {
        hint: '<p>Hint</p>',
        default: '<button type="button">Go</button>',
      },
    })

    expect(wrapper.find('.space-y-2').exists()).toBe(true)
  })
})
