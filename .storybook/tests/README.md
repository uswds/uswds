# Accessibility interaction regressions

Dedicated Storybook stories opt in with `parameters.uswdsTest` and the `a11y-regression` tag. The normal `test:a11y` command runs these through the existing Playwright test runner. No additional runtime dependency is required.

With a built Storybook already served locally, run only these scenarios:

```sh
npx test-storybook --url http://127.0.0.1:6006 --includeTags a11y-regression --maxWorkers=1
```

The scenarios exercise real keyboard input, focus containment, accessibility-tree reachability, open-state axe checks, and 320px reflow. Failures save a screenshot and JSON containing focus, hidden markers, accessibility structure, and the error under `_site/interaction-failures/`. Override `USWDS_A11Y_ARTIFACTS` to choose another artifact directory. CircleCI retains the default directory as job artifacts, including when a test fails.

`window.uswdsTest` is exposed only by the dedicated stories to simulate application lifecycle cleanup. It is not a shipped component API. Viewport settings are restored after each scenario.

These checks do not run a screen reader or establish actual 400% browser zoom behavior. Keep the named manual assistive-technology matrix in the PR until that evidence is available.
