import { describe, it, expect, beforeAll } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AIChatInterface from '@/components/AIChatInterface'

const commanderToken = 'Commander.'
const expectedFinal = 'Welcome, Commander. Meet your Chief of Staff'

describe('Welcome typewriter', () => {
  beforeAll(() => {
    class MockIntersectionObserver {
      private readonly callback: IntersectionObserverCallback

      constructor(callback: IntersectionObserverCallback) {
        this.callback = callback
      }
      observe(target: Element) {
        this.callback([{ isIntersecting: true, target } as IntersectionObserverEntry], this as unknown as IntersectionObserver)
      }
      unobserve() {}
      disconnect() {}
      takeRecords() { return [] }
    }

    Object.defineProperty(window, 'IntersectionObserver', {
      writable: true,
      value: MockIntersectionObserver,
    })

    if (!window.matchMedia) {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query: string) => ({
          matches: false,
          media: query,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => false,
        }),
      })
    }
  })

  it('renders layout-stable placeholder and exposes pause index metadata', () => {
    const { container } = render(
      <MemoryRouter>
        <AIChatInterface />
      </MemoryRouter>
    )

    const placeholder = container.querySelector<HTMLSpanElement>('.welcome-placeholder')
    expect(placeholder).toBeTruthy()
    expect(placeholder?.textContent).toBe(expectedFinal)
    expect(placeholder?.getAttribute('aria-hidden')).toBe('true')
    expect(placeholder?.style.visibility).toBe('hidden')

    const typewriter = container.querySelector<HTMLSpanElement>('.welcome-typewriter')
    expect(typewriter).toBeTruthy()
    expect(typewriter?.getAttribute('data-final')).toBe(expectedFinal)

    const pauseAttr = typewriter?.getAttribute('data-pause-index')
    expect(pauseAttr).toBeTruthy()
    const pauseIndex = Number(pauseAttr)
    const expectedPauseIndex = expectedFinal.indexOf(commanderToken) + commanderToken.length - 1
    expect(pauseIndex).toBe(expectedPauseIndex)
  })
})
