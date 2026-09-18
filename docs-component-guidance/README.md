# Component documentation evidence

Browser captures use a matched 1145 by 928 viewport. The hint and banner pairs
compare existing source content with the proposed documentation changes using
the same fixture layout and compiled USWDS styles. The range image demonstrates
the new endpoint-label example; it is not a before/after comparison.

- `hints-before.jpg` and `hints-after.jpg`: four current input-mask examples.
- `banner-before.jpg` and `banner-after.jpg`: English and Spanish expanded banners.
- `range-example.jpg`: visible range endpoints, associated hint, and native input.

Baseline core source: `eaef39533a0a0f78976d6888edf8ae56fe9334d6`.
Baseline site source: `13b16c38`.
These are focused fixtures, not screenshots of an already-deployed release.
Source JSON/Twig variants and the Lit bundle were rendered; the range example
responded to a keyboard increment from 50 to 60. No screen-reader speech or
physical mobile-device coverage is claimed.
