import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  DEFAULT_TOAST_DURATION_MS,
  EXPORT_STUB_TOAST_MESSAGE,
  showActionToast,
  showErrorToast,
  showInfoToast,
  showSuccessToast,
} from '@/lib/feedback.js'

const toastInfo = vi.fn()
const toastSuccess = vi.fn()
const toastError = vi.fn()

vi.mock('vue-sonner', () => ({
  toast: {
    info: (...args) => toastInfo(...args),
    success: (...args) => toastSuccess(...args),
    error: (...args) => toastError(...args),
  },
}))

describe('feedback', () => {
  beforeEach(() => {
    toastInfo.mockClear()
    toastSuccess.mockClear()
    toastError.mockClear()
  })

  it('exports stable export stub message', () => {
    expect(EXPORT_STUB_TOAST_MESSAGE).toBe(
      'Storyboard: XML export stub — no file generated.',
    )
  })

  it('shows info toast with default duration', () => {
    showInfoToast('hello')

    expect(toastInfo).toHaveBeenCalledWith('hello', {
      duration: DEFAULT_TOAST_DURATION_MS,
    })
  })

  it('shows success toast with custom duration', () => {
    showSuccessToast('done', { duration: 8000 })

    expect(toastSuccess).toHaveBeenCalledWith('done', { duration: 8000 })
  })

  it('shows error toast with default duration', () => {
    showErrorToast('failed')

    expect(toastError).toHaveBeenCalledWith('failed', {
      duration: DEFAULT_TOAST_DURATION_MS,
    })
  })

  it('shows action toast with vue-sonner action button', () => {
    const onAction = vi.fn()
    showActionToast('Organize now', { actionLabel: 'Open list', onAction })

    expect(toastInfo).toHaveBeenCalledWith('Organize now', {
      duration: DEFAULT_TOAST_DURATION_MS,
      action: {
        label: 'Open list',
        onClick: onAction,
      },
    })
  })

  it('falls back to plain info toast when action label is omitted', () => {
    showActionToast('Heads up')

    expect(toastInfo).toHaveBeenCalledWith('Heads up', {
      duration: DEFAULT_TOAST_DURATION_MS,
    })
  })
})
