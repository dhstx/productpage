import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import React from 'react'
import PublicChatboxLegacy from '../components/chat/PublicChatboxLegacy'

/**
 * Verifies a 2in spacer is rendered immediately after the plug-n-play prompts
 * on the public chatbox (used on the Landing page).
 */
describe('PublicChatboxLegacy spacer', () => {
  it('renders a spacer div directly after the prompts', () => {
    const { container } = render(<PublicChatboxLegacy />)

    const prompts = container.querySelector('.legacy-actions')
    expect(prompts).toBeTruthy()

    const spacer = prompts?.nextElementSibling
    expect(spacer).toBeTruthy()
    expect(spacer?.getAttribute('aria-hidden')).toBe('true')

    // Tailwind arbitrary value class for exact 2 inches
    const className = spacer?.getAttribute('class') || ''
    expect(className).toContain('h-[2in]')
  })
})
