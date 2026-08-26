---
name: uswds-accessibility
description: >-
  Apply USWDS accessibility standards when changing components, ARIA, focus
  management, keyboard behavior, screen-reader announcements, or a11y tests.
  Use when fixing or reviewing accessibility issues, interactive components
  (modal, combo-box, date-picker, accordion, and similar), aria-* attributes,
  focus traps, live regions, or when the user invokes /uswds-accessibility.
  Complements uswds-code-review gate 16: this skill owns the accessibility
  judgment; code review routes here instead of concluding AT behavior itself.
---

# USWDS Accessibility

Guidance for coding agents working **on the USWDS repository** (builders), not for teams consuming USWDS in an application. For general repo setup, see root `AGENTS.md`. For PR calibration and non-a11y gates, see `uswds-code-review`.

## Standard

- **Bar:** WCAG 2.1 AA minimum. Prefer WCAG 2.2 / AAA where the component already aims higher or the fix is low-cost.
- **Legal floor:** Section 508 incorporates WCAG 2.0 AA. Meeting 508 alone is not the USWDS quality bar.
- **Automation:** `npm run test:a11y` (Storybook + Playwright + Axe) failures are **blocking**, not advisory. Passing Axe is necessary and not sufficient.
- **Docs:** Prefer existing USWDS markup, roles, and naming patterns over inventing new ARIA. Check the component page and its accessibility tests on designsystem.digital.gov when behavior is unclear.

## Non-negotiables

From USWDS accessibility principles. Do not regress these:

1. Keyboard focus follows a logical, predictable order.
2. Meaning is never conveyed by visual style alone (color, shape, position).
3. Page and component state changes are announced to assistive technology when users need them.
4. Non-text content has an appropriate text equivalent.
5. Critical information does not depend on hover alone.
6. Touch and keyboard-only interaction are both fully supported.

## Scope firewall

USWDS ships accessible components. That does **not** make a consuming site Section 508 compliant.

- Do not treat a component-level fix as closing an app-level a11y issue filed against a downstream project.
- Do not claim "508 compliant" or "WCAG conformant" for a whole product based only on using USWDS or passing Axe in this repo.

## When this skill applies

Use for changes that touch:

- Interactive behavior, focus, or keyboard handling
- `aria-*`, roles, names, descriptions, live regions
- Show/hide patterns (`hidden`, `aria-hidden`, `data-modal-hidden`, disclosure)
- Screen-reader-only text (`.usa-sr-only` and similar)
- a11y tests, Storybook a11y stories, or manual AT notes in a PR

If the change is unrelated (tokens, pure Sass color, docs typo with no SR impact), say so and stop. Do not force an a11y review.

## High-risk components

Require extra care. Prefer reading the existing component JS and tests before editing:

| Area | Watch for |
| --- | --- |
| Modal | Focus trap, initial focus, Escape, restore focus to opener, `aria-hidden` / `data-modal-hidden` on non-modals must clear on close even if the opener is gone |
| Combo box | Listbox/popup semantics, filter announcements, pointer vs keyboard parity |
| Date picker / date range | Dialog or grid keyboard model, disabled dates, focus return |
| Accordion | `aria-expanded`, button/heading pattern, multi-select vs single |
| Header / nav / language selector | Menus, focus trap reuse, mobile toggle |
| File input, character count, validation | Live regions, error association (`aria-describedby`), status text |

Shared utilities often involved: `focus-trap`, `keymap`, `behavior`, `active-element`, `toggle` (under `packages/uswds-core/src/js/utils/`).

## Verification loop

Do not declare an accessibility fix done until the relevant steps below are done or explicitly deferred with a reason.

### 1. Prefer patterns over new ARIA

- Match sibling components and APG-aligned patterns already in the repo.
- Avoid "ARIA soup": do not add `aria-label` to silence a tool if visible label or native semantics already name the control.

### 2. Tests in this repo

- Add or update Mocha + jsdom tests when behavior changes (follow `packages/usa-accordion/src/test/` or the component's existing specs).
- Cover focus return, Escape, open/close attribute cleanup, and keyboard paths where those are the bug.
- Single test example: `npx mocha --require jsdom-global/register packages/<pkg>/src/test/<name>.spec.js`

### 3. Automated a11y

- Full suite: `npm run test:a11y` (needs Storybook build, Playwright browsers). Slow; use when markup/roles change or before claiming CI-green a11y.
- Note in the PR what was run locally vs what CI will run.

### 4. Manual AT (required for interactive behavior)

Automated scans alone are not sign-off when focus, keyboard, or announcements change.

Minimum manual matrix for substantive interactive fixes:

- Keyboard only (Tab, Shift+Tab, Enter/Space, Escape, arrows where applicable)
- One screen reader combo: VoiceOver + Safari, or NVDA + Firefox (or Chrome)

In the PR, state:

- What you verified
- Browser + AT used
- What is pre-existing on `develop` vs introduced here
- Limitations / not in scope

Code review (`uswds-code-review` gate 16b) should **route** this verification, not invent a pass/fail from the diff alone.

## Anti-patterns (agents)

Do not:

- Fix Axe by hiding content with `aria-hidden` without a matching unhide path
- Leave the page `aria-hidden` after a modal/dialog closes (especially if the opener node was removed)
- Replace a native `<button>` / `<a>` / `<input>` with a `div` click handler
- Rely on `title` alone for critical accessible names
- Announce every keystroke with polite live regions when a single status change is enough
- Assert product-wide 508 compliance from component usage or Axe alone

## Output expectations

When applying this skill, be explicit:

1. **Risk:** which non-negotiable or high-risk component area is involved
2. **Change:** what markup/behavior/test changed
3. **Evidence:** tests run, AT matrix, or why deferred
4. **Routing:** if live AT is still needed, say `Needs accessibility specialist AT verification` and list the matrix. Do not soft-claim "LGTM for AT" from code alone.

## Related

- Issue: https://github.com/uswds/uswds/issues/6749
- Root agent guide: `AGENTS.md`
- Code review skill (gate 16a/16b): `.agents/skills/uswds-code-review/`
- Public guidance: https://designsystem.digital.gov/documentation/accessibility/
