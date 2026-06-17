import { describe, expect, it, vi, beforeEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import PartOutImportView from '@/views/PartOutImportView.vue'
import { __resetSessionsForTests, createDemoSession, DEMO_SESSION_ID } from '@/lib/storyboard-session.js'

const openAuth = vi.fn()

vi.mock('vue-router', () => ({
  useRoute: () => ({ params: { sessionId: DEMO_SESSION_ID } }),
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('@/composables/useBrickLinkAuth.js', () => ({
  useBrickLinkAuth: () => ({ openAuth }),
}))

vi.mock('@/lib/part-out-client.js', () => ({
  fetchPartOutLines: vi.fn(),
}))

vi.mock('@/lib/feedback.js', () => ({
  showErrorToast: vi.fn(),
  showInfoToast: vi.fn(),
}))

import { fetchPartOutLines } from '@/lib/part-out-client.js'

describe('PartOutImportView', () => {
  beforeEach(() => {
    __resetSessionsForTests()
    openAuth.mockReset()
    vi.mocked(fetchPartOutLines).mockReset()
    createDemoSession({ setNumber: '10281-1' })
  })

  it('shows skeleton while loading', () => {
    vi.mocked(fetchPartOutLines).mockReturnValue(new Promise(() => {}))
    const wrapper = mount(PartOutImportView)
    expect(wrapper.find('[data-testid="table-loading-skeleton"]').exists()).toBe(true)
  })

  it('renders table after successful load', async () => {
    vi.mocked(fetchPartOutLines).mockResolvedValue({
      ok: true,
      source: 'bricklink',
      lines: [
        {
          id: 'po-0',
          partId: '3001',
          name: 'Brick 2×4',
          color: 'Red',
          colorId: 5,
          quantity: 2,
        },
      ],
    })

    const wrapper = mount(PartOutImportView)
    await flushPromises()

    expect(wrapper.text()).toContain('Brick 2×4')
    expect(wrapper.text()).toContain('Confirm and begin counting')
    const confirmButton = wrapper.findAll('button').find((btn) =>
      btn.text().includes('Confirm and begin counting'),
    )
    expect(confirmButton?.attributes('disabled')).toBeUndefined()
  })

  it('opens auth dialog when AUTH_REQUIRED', async () => {
    vi.mocked(fetchPartOutLines).mockResolvedValue({
      ok: false,
      code: 'AUTH_REQUIRED',
      message: 'Sign in required',
    })

    mount(PartOutImportView)
    await flushPromises()

    expect(openAuth).toHaveBeenCalledWith(
      expect.objectContaining({
        required: true,
        showBackToHome: true,
      }),
    )
  })

  it('filters loaded lines client-side', async () => {
    vi.mocked(fetchPartOutLines).mockResolvedValue({
      ok: true,
      source: 'bricklink',
      lines: [
        {
          id: 'po-0',
          partId: '3001',
          name: 'Brick 2×4',
          color: 'Red',
          colorId: 5,
          quantity: 2,
        },
        {
          id: 'po-1',
          partId: '3023',
          name: 'Plate 1×2',
          color: 'Blue',
          colorId: 1,
          quantity: 4,
        },
      ],
    })

    const wrapper = mount(PartOutImportView)
    await flushPromises()

    await wrapper.get('[data-testid="part-out-filter"]').setValue('plate')
    await flushPromises()

    expect(wrapper.text()).toContain('Plate 1×2')
    expect(wrapper.text()).not.toContain('Brick 2×4')
  })
})
