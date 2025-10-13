# Manus Prompt: Main Page — Chat Hero Agent Intro + Color Sync

Title: "Main Page — Chat Hero Agent Intro + Color Sync"

Scope: Implement only the main-page chat hero section that contains the "HEY, I AM {AGENT}" headline and the "Select Agent" dropdown as shown in the reference screenshots.

---

Generate production-ready React + TypeScript + CSS (modules or Tailwind) code that fulfills all requirements below. Organize the solution into composable components, hooks, styles, tests, and documentation as specified. Keep external dependencies minimal.

## Design Intent
- Location: the homepage chat hero with agent selector.
- Function: users choose among "Strategic Advisor", "Engagement Analyst", and "Operations Assistant" from a dropdown activated by a "Select Agent" button. Each dropdown item shows a colored dot.

## Color Synchronization
- Provide a single source of truth (TypeScript map or similar) for agent metadata that includes the color used by both the dropdown dot and the large hero headline.
- Use design tokens if available; otherwise fall back to:
  - Strategic Advisor → #FBBF24 (amber / gold)
  - Engagement Analyst → #7C3AED (purple)
  - Operations Assistant → #10B981 (green)
- Ensure the hero title text always matches the selected agent's dot color.

## Intro Animation
- Trigger with `IntersectionObserver` when the hero first enters the viewport on a downward scroll.
- Typewriter sequence:
  1. Type "Hello." using a lightweight typewriter utility (40–60 ms per character).
  2. Pause exactly 1.5 s after the period.
  3. Type " I am your {AGENT}."
- After typing completes, fade in the remaining hero UI (subheading, inputs, chips, buttons) over ~300–400 ms.
- Disable interactions until the fade-in finishes, then restore full interactivity.

## Run-Once Behavior
- Play the intro animation only once per visit, using `sessionStorage` to persist a flag.
- Replay only when the user leaves the page and returns (new session scope).

## Accessibility & Performance
- Respect `prefers-reduced-motion: reduce` by skipping animations and rendering the final state immediately with interactions enabled.
- Provide `aria-live="polite"` for the typed greeting text.
- Ensure color contrast meets WCAG AA against the hero background.
- Use opacity/transforms to avoid layout thrash.

## State Model & API
- Manage state with:
  - `activeAgent`: `"strategicAdvisor" | "engagementAnalyst" | "operationsAssistant"`
  - `hasPlayedIntroThisSession`: boolean derived from `sessionStorage`.
  - `animationPhase`: `"idle" | "typingHello" | "pause" | "typingIamYour" | "fadingIn" | "ready"`.
- Expose functions: `setActiveAgent(agentId)`, `getActiveAgent()`, `resetIntroForTesting()` (dev/test only).

## Tests & Stories
- Unit tests for the color mapping and public API.
- Integration test stubs covering run-once behavior and viewport-triggered animation.
- Storybook (or equivalent) story/demo knobs to change the active agent and toggle reduced-motion.

## Documentation
- Provide README notes describing component usage, agent data wiring, color token overrides, reduced-motion handling, and testing hooks.

Acceptance Criteria:
- Selecting any agent immediately updates the headline color to match its dot.
- On first downscroll, the typewriter sequence runs with a 1.5 s pause; it does not replay during the same visit.
- Navigating away and returning replays the animation exactly once per new visit.
- Reduced-motion mode renders the final state instantly without animation artifacts.
- All controls are keyboard accessible with correct ARIA roles; no console errors; Lighthouse performance ≥ 90 with animations active.
