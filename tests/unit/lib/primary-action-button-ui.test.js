import { describe, expect, it } from 'vitest'
import { PRIMARY_ACTION_BUTTON_CLASS } from '@/lib/primary-action-button-ui.js'

describe('primary-action-button-ui', () => {
  it('exports the canonical primary action minimum height classes', () => {
    expect(PRIMARY_ACTION_BUTTON_CLASS).toBe('min-h-11 md:min-h-9')
  })
})
