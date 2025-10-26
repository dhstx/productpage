// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout.jsx'

function LocationDisplay() {
  const location = useLocation()
  return <div data-testid="location">{location.pathname}</div>
}

describe('Dashboard nav tab', () => {
  it('renders Dashboard as the first nav item', async () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <AdminLayout>
          <div />
        </AdminLayout>
      </MemoryRouter>
    )

    // The header contains one primary nav; ensure Dashboard exists and is first
    const nav = screen.getAllByRole('navigation')[0]
    const links = within(nav).getAllByRole('link')
    expect(links[0]).toHaveTextContent(/Dashboard/i)
  })

  it('navigates to /dashboard when Dashboard is clicked', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={["/agents"]}>
        <AdminLayout>
          <div />
        </AdminLayout>
        <LocationDisplay />
      </MemoryRouter>
    )

    const nav = screen.getAllByRole('navigation')[0]
    const dashboardLink = within(nav).getByRole('link', { name: /Dashboard/i })
    await user.click(dashboardLink)

    expect(screen.getByTestId('location').textContent).toBe('/dashboard')
  })

  it('shows active styling when on /dashboard', async () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <AdminLayout>
          <div />
        </AdminLayout>
      </MemoryRouter>
    )

    const nav = screen.getAllByRole('navigation')[0]
    const dashboardLink = within(nav).getByRole('link', { name: /Dashboard/i })
    const className = dashboardLink.getAttribute('class') || ''
    // Active state applies accent text color; assert token is present
    expect(className).toMatch(/text-\[#FFC96C\]/)
  })
})
