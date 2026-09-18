# Release notes

For a consumer-facing change, run `npm run changeset` and describe the change and version impact. Commit the generated Markdown file with the change.

The Prepare release workflow applies pending changesets and opens a signed version/changelog PR. It does not merge or publish. Review and merge that PR before manually running Publish Package to npmjs.

For a prerelease, run `npx changeset pre enter next` in a feature branch and commit the prerelease configuration for review. Subsequent version PRs produce `-next.N` versions. Run `npx changeset pre exit` in a reviewed branch when returning to stable releases. Use the `next` npm channel for prereleases and `latest` for stable versions.

See [release instructions](../docs/releasing.md).
