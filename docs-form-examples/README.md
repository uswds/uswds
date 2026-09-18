# Form example evidence

These browser captures compare the existing default examples with newly added
standalone error examples. Both use a 1440-pixel viewport width. Full-page heights
differ with content: default 1729 pixels, error 1689 pixels.

They demonstrate documentation and Storybook coverage, not a claimed fix to
component validation behavior. Existing combo-box and time-picker enhancement
limitations remain visible and are documented in the stories. The separate
combo-box validation-class fix is PR #6942. Screen-reader speech was not tested.

The focused checks cover Twig rendering, unique identifiers, error-description
references, and enhanced browser output. The existing checkbox contribution
in PR #6801 remains separate.
