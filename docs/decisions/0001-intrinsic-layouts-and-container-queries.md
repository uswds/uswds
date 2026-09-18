# ADR 0001: Prefer intrinsic layouts and container queries for component layout

- Status: Proposed. This record does not change current support requirements or public APIs.
- Related issue: [USWDS #6516](https://github.com/uswds/uswds/issues/6516)
- Decision owner: USWDS maintainers, following [project governance](../../GOVERNANCE.md).
- Decision date: Pending review.

## Context

USWDS components appear in full-width pages, columns, sidebars, and other constrained spaces. A viewport breakpoint describes the browser window, but does not necessarily describe the space available to a component. A component can have little room on a wide screen and enough room for a different layout on a narrower screen.

Intrinsic layout uses the available space and the size of the content to determine placement. Flex wrapping and Grid can handle many layouts without an explicit breakpoint. When a component needs a discrete layout change, a size container query can respond to the space provided by an ancestor instead of the viewport.

This proposal applies to responsive layout decisions in new or substantially revised components. It does not propose replacing all media queries, removing existing utility classes, or changing a component's public markup without a separate compatibility review.

## Proposed decision

1. Start with a readable, usable layout in normal document flow. Use flexible sizes, wrapping, and content-driven layout where they solve the need without a breakpoint.
2. Use a size container query when an explicit change depends on the space available to a component. Select the threshold from the content and interaction needs, using USWDS sizing tokens where suitable.
3. Use viewport media queries when the decision concerns the page or viewport, such as a page-wide layout. Continue using media features for user preferences and device capabilities, including reduced motion and forced colors.
4. Keep a usable base layout when the query is unsupported or there is no matching container. The query should improve presentation without making content or essential controls available only inside the query.
5. Introduce changes incrementally with evidence. Do not convert existing components solely to change the CSS technique.

## Container ownership

A size query styles elements inside a query container. The element being styled cannot use itself as its own size-query container. Identify the containing element explicitly when designing the component.

Prefer an existing, appropriate ancestor to a new wrapper. When nesting could select the wrong container, use a specific container name and document where it belongs. Do not apply containment to a shared ancestor without checking effects on its other contents. Inline-size containment changes intrinsic sizing behavior, which can affect shrink-to-fit layouts.

If a component needs a new wrapper, container name, setting, or class, describe that public contract in its own implementation proposal. This ADR does not establish a universal container class or require consuming projects to add one.

## Compatibility and progressive enhancement

For each implementation, check the project's current browser support policy and the particular CSS features being used. Support for one kind of container query does not establish support for every related feature.

The base layout must preserve the component's content, reading order, keyboard order, and essential behavior. Use feature detection where it helps express a fallback, and verify the fallback with the container enhancement disabled. Avoid maintaining conflicting viewport and container rules for the same behavior without documenting which takes precedence.

Do not use visual reordering to compensate for a content order that is confusing without the enhanced layout. Check zoom, longer translations, user text settings, and nested or narrow containers. Changing the responsive mechanism does not replace accessibility testing.

## Evidence required for a component change

A PR applying this decision should explain:

- Which layout problem occurs, with the component placed in the relevant context.
- Why intrinsic layout is sufficient or why an explicit container threshold is needed.
- Which element owns the container and whether consumers need to change markup or settings.
- How the base layout behaves without container-query support or without a matching container.
- Results in a narrow container on a wide viewport and a wide container on a narrow viewport, where those contexts are possible.
- Results with long content, zoom, keyboard navigation, and the component's supported browser and assistive technology checks.
- Before and after screenshots when the presentation changes.

Document intentional changes to component behavior and public APIs separately from this architectural preference.

## Alternatives considered

### Use viewport breakpoints for all responsive changes

This preserves familiar existing conventions and can be appropriate for page layout. It also couples reusable components to assumptions about the page and can require extra overrides when they are embedded in narrower contexts.

### Use container queries for every layout

This would add containment, thresholds, and fallback work where ordinary flow, Flexbox, or Grid can already adapt to available space. It could also introduce unnecessary markup or compatibility changes.

### Convert every existing component immediately

A broad conversion would increase regression risk and review scope without demonstrating an improvement for each component. A targeted change allows maintainers and users to evaluate the approach with concrete examples.

## Consequences

Components can adapt more directly to the space they receive. Intrinsic layout can reduce breakpoint-specific overrides. Reviewers will need to evaluate containment, nesting, and fallback behavior, and documentation must make any new integration requirements clear.

Existing layouts remain supported until their individual changes are reviewed. This proposal does not set a migration deadline, promise a new utility API, or approve a breaking release.

## Acceptance record

Before accepting this ADR, maintainers should confirm the scope above, the compatibility expectation for the base layout, and whether a representative component change provides enough evidence to adopt this preference. Record the accepting PR and date here. Any required public container API remains a separate decision.

## References

- [Original proposal](https://github.com/uswds/uswds/issues/6516).
- [CSS Containment Level 3, container queries](https://www.w3.org/TR/css-contain-3/#container-queries), a W3C working draft describing the mechanism.
- [MDN: CSS container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries), including container selection and fallback examples.
- [USWDS browser support](https://designsystem.digital.gov/documentation/developers/#browser-support).
