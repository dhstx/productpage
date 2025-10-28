import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import React from 'react'
import PublicChatboxLegacy from '../components/chat/PublicChatboxLegacy'

/**
 * Verifies a 2in spacer is rendered immediately after the plug-n-play prompts
 * on the public chatbox (used on the Landing page).
 */
describe('PublicChatboxLegacy spacing', () => {
  it('does not include an inline spacer after prompts (handled by page padding)', () => {
    const { container } = render(<PublicChatboxLegacy />)

    const prompts = container.querySelector('.legacy-actions')
    expect(prompts).toBeTruthy()

    const next = prompts?.nextElementSibling
    // No spacer element should follow inside the component
    expect(next).toBeNull()
  })
})
