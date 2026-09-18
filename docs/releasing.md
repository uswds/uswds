# Release USWDS

Releases are initiated explicitly by Ryan, Sam, Ethan, or John. Automation does not merge PRs. Review bypass remains limited to Ryan and Sam. Feature merges, version PR merges, and tag pushes do not publish a package.

## Record release intent

Run `npm run changeset` with a consumer-facing change, select the version impact, and write its release note. Commit the generated Markdown with the PR.

On develop, `Prepare release` applies pending changesets and opens or updates the signed `automation/version-packages` PR. The workflow dispatches CI and the required title check explicitly because PRs created with `GITHUB_TOKEN` do not automatically trigger ordinary PR workflows. The dispatched title check verifies the open version PR and its current commit against GitHub metadata. Review the version and changelog, then merge manually. The branch uses a feature prefix so the bot does not need permission to update protected release branches.

For prereleases, review a change running `npx changeset pre enter next`, then let version PRs produce `-next.N` versions. Review `npx changeset pre exit` when returning to stable versions. Prereleases publish to `next`; stable versions publish to `latest`.

## Verify and publish

1. Open **Publish Package to npmjs** in Actions and select the `develop` workflow branch.
2. Enter the full SHA of the reviewed version commit merged into develop. The selected source must contain the current manual release workflow.
3. Select `latest` or `next`. Leave `publish` false for a dry run. The workflow runs full code, Sass, browser/accessibility, HTML, built-bundle, and installed-package checks, then audits shipped dependencies.
4. Inspect the `verified-package` artifact and run result. It contains the exact tested tarball, source/run manifest, SHA-256 checksum, and generated release notes.
5. When ready, run again with `publish` true and type the exact committed package version. Verification runs again. The minimal-permission publishing job receives that run's exact artifact by ID and publishes with npm OIDC provenance, with lifecycle scripts disabled.
6. The workflow installs the published registry version for a consumer smoke test, then records the source tag, GitHub release, notes, tarball, and checksums.

The workflow serializes release runs. A failed, canceled, or skipped verification cannot reach publishing. Artifacts from unrelated runs, mismatched versions/SHAs, modified tarballs, unauthorized actors/refs, and stable-version rollbacks are rejected.

## Dependency policy

There is one release-time vulnerability scan, in a clean installation of the tarball. High and critical production findings block release. Lower-severity findings remain visible. A missing, malformed, or failed scan blocks verification. There is no development-dependency audit gate in the release path; use Dependabot alerts and maintenance PRs for tooling findings, escalating actual build/publication risks.

Any exception requires a reviewed policy change with a specific advisory, reason, owner, and expiry. No blanket bypass switch or automatic `npm audit fix` is provided.

## One-time activation after review

These steps are deliberately not applied by the PR:

1. Complete the [CI cutover](automation.md#review-and-cutover) and preserve existing merge/review restrictions.
2. Create or review the `npm-release` GitHub environment and restrict deployment branches to `develop`. Add environment approval requirements only if maintainers want an additional publication approval.
3. In npm's trusted-publisher settings for `@uswds/uswds`, authorize organization `uswds`, repository `uswds`, workflow `release.yml`, environment `npm-release`. Confirm direct publication is permitted. No long-lived npm token is needed.
4. Register a dedicated release GitHub App, installed only on `uswds/uswds`, with repository **Contents: write** permission. Store its client ID as `RELEASE_APP_CLIENT_ID` and its private key as environment secret `RELEASE_APP_PRIVATE_KEY` in `npm-release`. The recording job mints a temporary token scoped to this repository and revokes it afterward. It rechecks the initiating/rerunning maintainer before minting the token. Split the existing release-tag ruleset: allow this app to bypass only a `v*` creation rule; keep update/deletion restrictions and required signatures in a separate rule with no app bypass. Do not add the app to protected branch update or review exceptions. Check inherited tag rules too. Both publishing and recording use the protected environment, so optional environment approval can be requested at both stages.
5. Enable GitHub's **Allow GitHub Actions to create and approve pull requests** setting. GitHub combines those capabilities in one setting; these workflows only create version PRs and never approve or merge them. Keep auto-merge disabled. Verify that the generated version PR receives both required checks, `CI required` and `PR title`. The preparation workflow dispatches both explicitly.
6. Set repository variable `RELEASE_AUTOMATION_ENABLED=true` only after the npm environment, trusted publisher, and tag-creation permissions are ready. Until then, publication requests fail before verification; dry runs remain available.

Changing npm trust and live repository settings remains a maintainer action after review. The PR does not publish a package or create a tag to test those permissions.

Setup references: [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/), [GitHub App tokens in Actions](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/making-authenticated-api-requests-with-a-github-app-in-a-github-actions-workflow), and [ruleset bypass configuration](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository).

## Recovery

Retry failed jobs in the original workflow run while its verified artifact is retained (14 days). If npm already contains the exact same package integrity, publishing becomes a no-op and recovery proceeds to registry verification and release recording. If the published bytes differ, stop. Never overwrite an npm version, rewrite a tag, or silently move a distribution tag backward. Use the original verified run or ship a corrective version.

Tag or GitHub-release failures can happen after npm publication. Fix the missing tag/environment permission and rerun failed jobs from that run. Existing tags must resolve to the same source commit. Release assets are uploaded idempotently, and a newly created release stays draft until upload succeeds.

Old `gulp release` and committed `security/*-zip-hash.txt` files remain historical compatibility tools. The new workflow does not use them, search for the newest artifact by version name, or require manual hash copying.
