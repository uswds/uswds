# CI and automation

`CI required` is the proposed aggregate merge check. It rejects failures, cancellations, and unexpected skips. Code and unit checks always run; browser/accessibility and package checks skip only known documentation-only PRs. Pushes, manual checks, and releases run full verification.

Verification uses Node from `.nvmrc`, npm 11.18.0, `npm ci`, and npm's download cache. Installation skips lifecycle builds; workflows build explicitly. The existing Mocha, Sass, built-bundle, Storybook/Axe, HTML, and formatting checks remain. The package smoke test installs the packed tarball into a temporary project, resolves public exports, compiles a custom Sass theme, and exercises packaged JavaScript in Chromium.

The `Visual review` workflow provides base/candidate screenshots of representative components at mobile and desktop sizes. Download its artifact and open `index.html`. It is advisory and does not approve design changes. Expand the story list in `scripts/visual-review.mjs` when a component needs coverage.

## Review and cutover

1. Review and merge the verification and release automation PRs manually in their documented order. Keep the provider-cleanup PR unmerged until step 4. Until cutover, CircleCI remains the required provider and runs alongside Actions.
2. Compare both providers on code, styles, lockfile, and documentation PRs. Confirm failure and skip handling, accessibility failures, and packed-package failures are visible.
3. In every applicable branch protection/ruleset, add `CI required` from GitHub Actions before removing `circle-uswds`. Keep `PR title` required. Preserve strict branch freshness, the four allowed mergers, Ryan/Sam-only review exceptions, signatures, and protected history. Do not enable auto-merge or grant a bot merge access. Read back every affected rule to confirm the change.
4. After the new required check is enforced, review and merge the provider-cleanup PR, then disconnect CircleCI. That PR removes `.circleci/config.yml`, its Snyk orb, and the unused local `snyk` dependency, and switches the README badge to Actions. The provider-cleanup PR may lack a CircleCI result because it removes that provider's configuration; this is why the required-check switch comes first.
5. Review unique actionable findings from the external Snyk integrations, then disconnect duplicates. Keep CodeQL, Dependabot, secret scanning, and push protection. These external settings are not changed by this PR.
6. Change the repository's default workflow-token permission to read-only after confirming explicit write permissions on remaining maintenance workflows. No workflow should approve or merge PRs. Version PR creation uses GitHub's combined create-and-approve setting, as described in [release setup](releasing.md#one-time-activation-after-review); enabling that setting does not grant protected-branch merge or review-bypass access. Code here requests only the permissions each workflow needs.

The custom signature workflow stays until maintainers decide whether requiring every PR commit to be verified is still intended. Native signed-merge enforcement alone is a different policy.

The provider-cleanup PR does not disconnect the external Snyk Code or Open Source GitHub integrations. Review their unique findings before changing those services. Removing the local CLI does not dismiss existing alerts.

## Dependency and maintenance policy

Dependabot proposes weekly grouped runtime and development updates with small PR limits; major updates remain separate. Security alerts remain enabled. Updates require a human merge. Build-tool advisories are triaged as maintenance unless they affect the build or publication process.

CodeQL scans authored JavaScript/TypeScript and Actions without installing or rebuilding the package. Contributor updates run monthly or manually. Documentation link checks remain scheduled, outside the release path.

## Local verification

```sh
npm ci --ignore-scripts --no-audit
npm run build
npm run test:quality
npx playwright install chromium
npm run test:ci
npm run ci:pack
npm run test:package -- release-artifacts/package.tgz
```

For a visual comparison, build Storybook for both revisions and run `node scripts/visual-review.mjs /path/to/base/_site /path/to/candidate/_site`.
