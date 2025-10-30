import { describe, it, expect } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import UserManual from '@/user-manual/UserManual'

// Unit: User Manual route renders H1 and at least one paragraph without client features
// Also: No full-screen element is present until a state flag is true (none by default)

describe('User Manual route (unit)', () => {
  function renderAt(pathname: string) {
    // Enable Help Safe Mode to avoid loading client-only video in JSDOM
    try {
      window.localStorage.setItem('NEXT_PUBLIC_HELP_SAFE_MODE', 'true')
    } catch {}
    return render(
      <MemoryRouter initialEntries={[pathname]}>
        <Routes>
          <Route path="/user-manual/*" element={<UserManual />} />
        </Routes>
      </MemoryRouter>
    )
  }

  it('renders H1 and some text content', async () => {
    renderAt('/user-manual')

    const h1 = await screen.findByRole('heading', { name: /user manual/i })
    expect(h1).toBeInTheDocument()

    // at least one paragraph from the MDX body
    const paras = screen.getAllByText(/syntek|automation|guide|start/i)
    expect(paras.length).toBeGreaterThan(0)
  })

  it('does not mount full-screen overlays by default', async () => {
    renderAt('/user-manual')

    // any element that looks like a full-screen overlay should not exist by default
    const overlay = document.querySelector('[class*="fixed"][class*="inset-0"]')
    expect(overlay).toBeNull()
  })

  it('exposes landmarks for a11y (aside/article present)', async () => {
    renderAt('/user-manual')
    const article = document.querySelector('article#help-article')
    const asides = document.querySelectorAll('aside[aria-label]')
    expect(article).not.toBeNull()
    expect(asides.length).toBeGreaterThanOrEqual(1)
  })
})
