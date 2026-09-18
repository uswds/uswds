# Review resolutions

- Site PR #3311: replaced the broad URI.open dispatcher with URI(url).open, addressing CodeQL's nonconstant sink finding. Eight regression tests still pass and the new CodeQL run passed. The old inline finding points to a superseded commit.
- Core PR #6951: moved nine color-function descriptions below imports and directly above their functions as SassDoc. Corrected the radius() token description. Focused Sass output-equivalence checks passed. Qualified vivid-token preservation and corrected accepted Sass color inputs after the follow-up review; five compilation assertions passed.
- Core PR #6954: corrected the separate English and Spanish banner caller strings in the base template, in addition to the standalone component defaults and fallback.
- Core PR #6955: verified the installed Browserslist exclusion behavior. The suggestion that not dead adds a union of browsers was not applied; an evidence-based response explains the exclusion and links the primary source.
- Core PR #6949: retained the exact policy replacement supplied by leadership in issue #6779. The policy-scope concern and need for maintainer review are recorded in the PR.
- Core PR #6957: corrected radio tile form nesting and clarified that PR #6942 does not resolve time-picker class propagation.
- Site PR #3316: corrected disabled date submission guidance using FormData evidence. Native disabled visible inputs omit values; aria-disabled inputs retain values.

Independent technical review does not replace the required GitHub approval from someone other than the last pusher.
