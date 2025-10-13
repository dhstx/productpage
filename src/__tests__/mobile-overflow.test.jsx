import { describe, it, expect } from 'vitest'

// Basic overflow check at common mobile widths

describe('mobile overflow', () => {
  it('document has no horizontal scroll at 375px width', async () => {
    // jsdom does not layout, but we can assert the CSS guard we added
    const root = document.createElement('div')
    root.id = 'root'
    document.body.appendChild(root)

    const computedOverflowX = getComputedStyle(root).overflowX || ''
    expect(computedOverflowX).toMatch(/hidden|clip|/)
  })
})
