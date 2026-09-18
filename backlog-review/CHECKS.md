# Final PR checks

All eight proposed fixes have verified signed commits and passing repository status checks at the sampled heads below. None has been merged by this review. Checks do not substitute for untested named devices or screen readers.

| PR | Commit | Checks | Audited at (UTC) |
| --- | --- | --- | --- |
| [#6941](https://github.com/uswds/uswds/pull/6941) | `84fd82921dde4cb157fe4dededfc70ea8df8aa60` | 11 passing | 2026-09-18T00:30:43.660609+00:00 |
| [#6942](https://github.com/uswds/uswds/pull/6942) | `e862ac2e16043951210f1e0ab69d99fb0df56af5` | 11 passing | 2026-09-18T00:30:42.949046+00:00 |
| [#6943](https://github.com/uswds/uswds/pull/6943) | `b0eaf212b2963db0f501907331a79b6847074958` | 10 passing | 2026-09-18T00:30:44.081383+00:00 |
| [#6944](https://github.com/uswds/uswds/pull/6944) | `a26e8305ba3018c999481a7ef844c979935b274a` | 12 passing | 2026-09-18T00:30:45.686708+00:00 |
| [#6945](https://github.com/uswds/uswds/pull/6945) | `33cd8c3147dc873cc966b7aefc2d2defe95ce57f` | 10 passing | 2026-09-18T00:30:43.568204+00:00 |
| [#6946](https://github.com/uswds/uswds/pull/6946) | `39dfba0d7f01a50f025ba7e22eb9269966d51602` | 11 passing | 2026-09-18T00:30:43.320996+00:00 |
| [#6947](https://github.com/uswds/uswds/pull/6947) | `4ebc116b0064079c8fc22a14d0d9b92db07697d0` | 10 passing | 2026-09-18T00:30:43.340677+00:00 |
| [#6948](https://github.com/uswds/uswds/pull/6948) | `968bacb743ae8b6feb4e972e08246f01856c5ee8` | 10 passing | 2026-09-18T00:37:28.568537+00:00 |

## Automated review follow-up

- #6941 documents the potential compatibility effect of initializing previously ignored root contexts. Named assistive-technology combinations remain explicitly untested.
- #6943 includes SassDoc for the restored public function. Existing documentation already advertises it; release notes remain a release-stage follow-up. No speculative release version or warning fallback was added.
- #6944 includes the required non-breaking-change declaration. Actual browser contrast assertions fail on the baseline and pass after the fix. This evidence is retained with the PR; no selector-presence test is presented as a contrast test.
- CodeRabbit standalone Stylelint commands could not locate the configuration in some review environments. Repository CI and the recorded local checks passed. The standalone bot command is not reported as passing.
- No inline review findings were present on these heads at the final audit.

See [checks.json](checks.json) for check names, source links, exact heads, and sample times.
