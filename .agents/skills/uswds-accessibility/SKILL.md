---
name: uswds-accessibility
description: >-
  Apply USWDS accessibility standards when changing components, ARIA, focus
  management, keyboard behavior, screen-reader announcements, or a11y tests.
  Use when fixing or reviewing accessibility issues, interactive components
  (modal, combo-box, date-picker, accordion, and similar), aria-* attributes,
  focus traps, live regions, or when the user invokes /uswds-accessibility.
  Complements uswds-code-review gate 16: this skill owns the accessibility
  judgment; code review routes here instead of concluding assistive technology
  behavior itself.
---

# USWDS Accessibility

Guidance for coding agents working **on the USWDS repository** (builders), not for teams consuming USWDS in an application. For general repo setup, see root `AGENTS.md`. For PR calibration and non-a11y gates, see `uswds-code-review`.

## Standard

- **Bar:** WCAG 2.1 AA minimum. Prefer WCAG 2.2 / AAA where the component already aims higher or the fix is low-cost.
- **Legal floor:** Section 508 incorporates WCAG 2.0 AA. Americans with Disabilities Act (ADA) incorporates WCAG 2.1 AA. Meeting 508 alone is not the USWDS quality bar.
- **Automation:** `npm run test:a11y` (Storybook + Playwright + Axe) failures are **blocking**, not advisory. Passing Axe is necessary and not sufficient.
- **Docs:** Prefer existing USWDS markup, roles, and naming patterns over inventing new ARIA. Check the component page and its accessibility tests on designsystem.digital.gov when behavior is unclear.

## Terms

- **WCAG:** Web Content Accessibility Guidelines. Success criteria are cited as SC X.X.X (for example, SC 2.4.7). USWDS targets WCAG 2.1 AA minimum; see **Standard** for legal floor vs quality bar.
- **Assistive technology:** Software and hardware that helps people interact with content (screen readers, magnification, voice control, switch access). Not the same as automated accessibility scanning.
- **Manual assistive technology testing:** Hands-on verification with real tools and browsers (keyboard-only, screen reader combos, zoom, forced-colors). Required for interactive behavior changes; automated `npm run test:a11y` does not replace it.
- **Screen reader:** A type of assistive technology used in the verification matrix (VoiceOver, NVDA, TalkBack). When this skill says "screen reader," it means a named browser + screen reader combo unless the change is visual-only.

## Non-negotiables

From USWDS accessibility principles. Do not regress these:

1. Keyboard focus follows a logical, predictable order, and the focus indicator stays visible (WCAG 2.4.7; don't obscure it, 2.4.11).
2. Meaning is never conveyed by visual style alone (color, shape, position), and text/UI-component contrast meets WCAG minimums (4.5:1 normal text, 3:1 large text and UI components/graphics — 1.4.3, 1.4.11).
3. Page and component state changes are announced to assistive technology when users need them (status messages, WCAG 4.1.3).
4. Non-text content has an appropriate text equivalent.
5. Critical information does not depend on hover alone.
6. Touch and keyboard-only interaction are both fully supported, including a minimum 24×24 CSS px touch target where feasible (WCAG 2.2 SC 2.5.8).
7. Device and browser accessibility settings are respected (WCAG 1.4.4, 1.4.10, 1.4.12; 2.2.2 where motion applies). Layout and function must survive user choices, not assume a default browser/OS profile.
   - Text zoom and reflow: no loss of content or functionality at 400% zoom / 320px width; prefer rem/em sizing over fixed px for text and spacing.
   - Reduced motion: honor `prefers-reduced-motion`; do not rely on animation alone for meaning; mark essential motion explicitly if it must remain.
   - Forced colors / high contrast: test icon-only controls and CSS-generated indicators; do not depend on background-color alone for state when system colors take over.
   - Pointer/input assumptions: support keyboard and touch; do not require hover-only interaction (see #5) or fine-pointer precision.
   - Do not disable zoom, override user text spacing, or reset OS font-size/contrast choices in component CSS.

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
- Color contrast, focus visibility, or touch target sizing
- a11y tests, Storybook a11y stories, or manual assistive technology testing notes in a PR

If the change is unrelated (tokens, pure Sass color, docs typo with no screen reader impact), say so and stop. Do not force an a11y review.

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
| Table (sortable) | Column header button semantics (`aria-sort`), announced sort state, keyboard operability of sort controls |
| Tooltip | Hover **and** focus/dismiss support, never the only source of critical info, no keyboard trap |
| Banner | Disclosure semantics for the "how you know this is official" expand/collapse |
| Pagination | Current-page indication (`aria-current="page"`), accessible name per link |
| Radio / checkbox groups, fieldsets | `fieldset`/`legend` grouping, group-level error association |

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

### 4. Manual assistive technology testing (required for interactive behavior)

Automated scans alone are not sign-off when focus, keyboard, contrast, or announcements change.

Minimum manual assistive technology test matrix for substantive interactive fixes:

- Keyboard only (Tab, Shift+Tab, Enter/Space, Escape, arrows where applicable)
- One screen reader combo: VoiceOver + Safari, or NVDA + Firefox (or Chrome)
- Zoom/reflow check at 400% zoom / 320px viewport width — confirm no loss of content or functionality (WCAG 1.4.10, 1.4.4)
- If the change adds or alters icon-only controls or CSS-generated (`::before`/`::after`) content, spot-check in forced-colors / Windows High Contrast Mode
- If the change affects touch or gesture behavior, add a mobile screen reader pass (VoiceOver + iOS Safari, or TalkBack + Chrome) alongside the desktop combo above

In the PR, state:

- What you verified
- Browser + assistive technology used
- What is pre-existing on `develop` vs introduced here
- Limitations / not in scope

Code review (`uswds-code-review` gate 16b) should **route** manual assistive technology testing, not invent a pass/fail from the diff alone.

## Anti-patterns (agents)

Do not:

- Fix Axe by hiding content with `aria-hidden` without a matching unhide path
- Leave the page `aria-hidden` after a modal/dialog closes (especially if the opener node was removed)
- Replace a native `<button>` / `<a>` / `<input>` with a `div` click handler
- Rely on `title` alone for critical accessible names
- Announce every keystroke with polite live regions when a single status change is enough (keep to WCAG 4.1.3 status-message intent)
- Set a positive `tabindex` (`tabindex > 0`) to force a custom order instead of fixing DOM/source order
- Suppress the default focus outline without a compliant custom indicator (WCAG 2.4.7 / 2.4.11)
- Rely on hover-only tooltips or menus with no focus-triggered equivalent
- Ship a new icon-only control or CSS-generated-content indicator without checking forced-colors / Windows High Contrast Mode
- Assert product-wide 508 compliance from component usage or Axe alone

## Output expectations

When applying this skill, be explicit:

1. **Risk:** which non-negotiable or high-risk component area is involved
2. **Change:** what markup/behavior/test changed
3. **Evidence:** tests run, manual assistive technology test matrix (including zoom/reflow, forced-colors, or mobile screen reader testing where applicable), or why deferred
4. **Routing:** if live assistive technology testing is still needed, say `Needs accessibility specialist assistive technology verification` and list the matrix. Do not soft-claim "LGTM for assistive technology behavior" from code alone.

## Related

- Issue: https://github.com/uswds/uswds/issues/6749
- Root agent guide: `AGENTS.md`
- Code review skill (gate 16a/16b): `.agents/skills/uswds-code-review/`
- Public guidance: https://designsystem.digital.gov/documentation/accessibility/
