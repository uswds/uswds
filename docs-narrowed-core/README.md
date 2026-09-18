# Banner and form example evidence

These focused fixtures document the narrowed scope of USWDS PRs #6954 and #6957.

## Banner

- Before source: `eaef39533a0a0f78976d6888edf8ae56fe9334d6`.
- After source: `d4c618c2697048d3861f197ded46c8f705715048`.
- The matched screenshots show expanded English and Spanish `.gov` Twig examples. The new copy explains HTTPS while retaining a decorative inline lock and its existing styling classes.
- All four English/Spanish and `.gov`/`.mil` Twig variants were rendered before and after. Ten complete page-template variants were also rendered after the change.
- All four built web-component fallback variants were expanded in Chrome. Each retained one visible `part="lock-icon"` element, marked `aria-hidden="true"`.

## Form examples

- Source: `cd94ab73670f6c48177066676d351fdc9ba6ada7`.
- The matched screenshots show default and error states for date picker and input mask. They are two representative examples from the nine retained stories, not a complete gallery or a fixed runtime defect.
- The input-mask hint is the content on this branch. The separate hint-copy update is PR #6953.
- Nine error examples were rendered and inspected after current component JavaScript enhancement. IDs were unique and description targets existed. Default markup matched the original baseline after whitespace normalization.
- Radio, combo-box, and time-picker additions were removed from the PR. Checkbox and the planned Radio follow-up remain with the contributor work tracked in #6801.

## Capture details and limits

Screenshots were captured in Chrome at 1145 × 928, using the same USWDS 3.14.0 stylesheet, fixture layout, and viewport for each pair. Fonts and banner images were loaded. Images are JPEG files. They show local focused fixtures, not full documentation-site pages.

The JSON files record rendered DOM and browser observations. `invalidControls` includes matching controls in the enhanced DOM; it is not a statement that every matching node is visually displayed. These checks do not establish screen-reader speech behavior. No physical assistive-technology testing or broad local test suite was performed for this narrowing pass.
