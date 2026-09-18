# Existing pull request review queue

These existing open PRs were linked by the issue review. Some cover only part of an issue. Keep each issue open until its remaining scope is verified. This list reflects the reviewed initial PR snapshot, not a merge authorization.

The reproduction record supplies current baseline evidence. Existing #6418 and #6306 need patch refreshes against current develop. Named-device and screen-reader checks remain explicit where applicable.

| Issue | Existing linked PRs | Current next step |
| --- | --- | --- |
| [#6830](https://github.com/uswds/uswds/issues/6830) | [#6831](https://github.com/uswds/uswds/pull/6831) | Validate and merge existing PR #6831 after required accessibility verification. |
| [#6717](https://github.com/uswds/uswds/issues/6717) | [#6781](https://github.com/uswds/uswds/pull/6781) | Verify #6781 on actual iOS Safari before merging, including background scrolling, forced-action nondismissal, explicit close, and focus restoration. Avoid a duplicate implementation. |
| [#6694](https://github.com/uswds/uswds/issues/6694) | [#6695](https://github.com/uswds/uswds/pull/6695) | Validate existing PR #6695 and its dependency order. |
| [#6523](https://github.com/uswds/uswds/issues/6523) | [#5345](https://github.com/uswds/uswds/pull/5345) | Perform VoiceOver comparisons in Safari, Firefox, and Chrome; test proposed single-string alternative. |
| [#6474](https://github.com/uswds/uswds/issues/6474) | [#6475](https://github.com/uswds/uswds/pull/6475) | Prioritize review of #6475 and verify the focused target keeps a visible indicator. Its patch applies cleanly to the tested baseline. |
| [#6449](https://github.com/uswds/uswds/issues/6449) | [#6450](https://github.com/uswds/uswds/pull/6450) | Retest the second toggle click in current Safari and on physical iOS. Reassess PR #6450 against current baseline instead of opening competing work. |
| [#6426](https://github.com/uswds/uswds/issues/6426) | [#6431](https://github.com/uswds/uswds/pull/6431) | Validate existing PR #6431, including repeated updates and teardown. |
| [#6414](https://github.com/uswds/uswds/issues/6414) | [#6418](https://github.com/uswds/uswds/pull/6418) | Refresh #6418 against current Gulp/Sass tooling, retain effective failing-path regression coverage, and document the output-path migration before release. |
| [#6412](https://github.com/uswds/uswds/issues/6412) | [#6610](https://github.com/uswds/uswds/pull/6610) | Review and finish existing PR #6610. Preserve its documented compatibility warning for consumers compensating for the current order. |
| [#6386](https://github.com/uswds/uswds/issues/6386) | [#6387](https://github.com/uswds/uswds/pull/6387) | Update the issue with partial mitigation and validate existing teardown PR #6387 against current guards. |
| [#6315](https://github.com/uswds/uswds/issues/6315) | [#6411](https://github.com/uswds/uswds/pull/6411) | Validate existing PR #6411, which updates both time picker and combo box. |
| [#6314](https://github.com/uswds/uswds/issues/6314) | [#6203](https://github.com/uswds/uswds/pull/6203) | Verify native menu paste on supported browsers; handle input/paste consistently with keyboard formatting. |
| [#6294](https://github.com/uswds/uswds/issues/6294) | [#6901](https://github.com/uswds/uswds/pull/6901), [#6418](https://github.com/uswds/uswds/pull/6418) | Keep parent and remaining children open. Coordinate PR #6901 discovery cleanup with consumer coverage in #6418. |
| [#6260](https://github.com/uswds/uswds/issues/6260) | [#6306](https://github.com/uswds/uswds/pull/6306) | Refresh #6306 and verify both hidden wrapping and visible focused behavior at large text sizes. Confirm the original iOS Chrome workflow before claiming device coverage. |
| [#6258](https://github.com/uswds/uswds/issues/6258) | [#6290](https://github.com/uswds/uswds/pull/6290) | Review and finish PR #6290 with link/native-button contrast and state coverage. |
| [#6238](https://github.com/uswds/uswds/issues/6238) | [#6289](https://github.com/uswds/uswds/pull/6289) | Validate #6289 in current Safari below 480px and compare expanded/collapsed states with Chromium and Firefox. The existing patch applies cleanly. |
| [#6176](https://github.com/uswds/uswds/issues/6176) | [#6662](https://github.com/uswds/uswds/pull/6662) | Finish PR #6662 and its documentation follow-up; verify default and hover theme values without opening a duplicate. |
| [#6069](https://github.com/uswds/uswds/issues/6069) | [#6388](https://github.com/uswds/uswds/pull/6388) | Continue #6388 review. Resolve the repeatedly added resize listener and the existing CSS-container-query question before merging; do not start competing work. |
| [#6056](https://github.com/uswds/uswds/issues/6056) | [#6796](https://github.com/uswds/uswds/pull/6796) | Validate and merge existing combined focus PR #6796 after required accessibility verification. |
| [#5934](https://github.com/uswds/uswds/issues/5934) | [#5699](https://github.com/uswds/uswds/pull/5699) | Finish PR #5699 with utility-output coverage for default, empty, included, and excluded settings. |
| [#5905](https://github.com/uswds/uswds/issues/5905) | [#6389](https://github.com/uswds/uswds/pull/6389) | Retain the remaining #6151/#6528 work and assess #6389 with the requested usability review. Do not close the whole report based only on the already removed verbose hint. |
| [#5883](https://github.com/uswds/uswds/issues/5883) | [#6691](https://github.com/uswds/uswds/pull/6691) | Review #6691 using mixed grouped/standalone and narrow-width controls. Its patch applies cleanly; avoid duplicating the submitted fix. |
| [#5830](https://github.com/uswds/uswds/issues/5830) | [#6796](https://github.com/uswds/uswds/pull/6796), [#6262](https://github.com/uswds/uswds/pull/6262) | Continue consolidated PR #6796, which preserves contributor work from 6262. Keep both linked issues open until the combined change passes its remaining review and merges. |
| [#5827](https://github.com/uswds/uswds/issues/5827) | [#5227](https://github.com/uswds/uswds/pull/5227) | Preserve logical caret/selection during formatting, with delete/replace and punctuation tests. |
| [#5503](https://github.com/uswds/uswds/issues/5503) | [#6758](https://github.com/uswds/uswds/pull/6758) | Test #6758 on real iOS VoiceOver. Track remaining header navigation, rotor expectations and keypad requests separately from its touch-hint and weekday-readout scope. |
| [#5294](https://github.com/uswds/uswds/issues/5294) | [#5345](https://github.com/uswds/uswds/pull/5345) | Perform named screen-reader/browser verification on PR #5345 for list semantics and heading/step reading order before merge. |
