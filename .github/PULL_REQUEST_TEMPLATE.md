<!---
Welcome! Thank you for contributing to the U.S. Web Design System.
Your contributions are vital to our success and we are glad you're here.

Please keep in mind:
- This pull request (PR) template exists to help speed up integration.
  The USWDS Core team reviews and approves every PR
  before merging it into the public code base,
  so the better we can understand the problem and solution,
  the sooner we can merge this change.
  The point here is: clear explanations matter!

- You can erase any part of this template
  that doesn't apply to your pull request (including these instructions!).

- You can find more information about contributing in
  [contributing.md](https://github.com/uswds/uswds/blob/develop/CONTRIBUTING.md)
  or you can reach out to us directly at uswds@gsa.gov.
 -->

<!---
Step 1 - Title this PR with the following format:
USWDS - [Package]: [Brief statement describing what this pull request solves]
eg: "USWDS - Button: Increase font size"
 -->

# Summary

_Provide a one or two sentence summary of the update that can be used in the changelog._
<!--
A successful summary is written in the past tense and includes:
**A benefit statement.** A description of the update.
See [USWDS release notes](https://github.com/uswds/uswds/releases) for examples.
-->

## Breaking change

_Indicate if this update is a breaking change with **one** of the following statements:_
This is not a breaking change.
:warning: This is potentially a breaking change.
:warning: This is a breaking change.
<!--
Breaking changes include:
  - Changes to the JavaScript API
  - Changes to markup or content in our components
  - Significant changes to the display of a component
If applicable, explain what actions are required for the user to remediate the break.
-->

## Related issue

Closes #_[issue_no]_
<!--
Every pull request should resolve an open issue.
If no open issue exists, you can open one here:
https://github.com/uswds/uswds/issues/new/choose.
-->

## Related pull requests

_Indicate if there are other pull requests necessary to complete this issue._
<!--
Some changes to the USWDS codebase require a change to the documentation site,
and need a pull request in the [uswds-site repo](https://github.com/uswds/uswds-site).

This could include:
- New or updated component documentation,
- New or updated settings documentation, or
- Changelog entries.

Add links to any related PRs in this section. If this change requires an update
to the uswds-site repo, but that PR does not yet exist, just make sure to note that here.
-->

## Preview link

Preview link:
<!-- If available, provide a link to a demo of the solution in action. -->

## Problem statement

_Summarize the problem this PR solves in a clear and concise statement._
<!--
A successful problem statement conveys:
1. The desired state,
2. The actual state, and
3. Consequences of remaining in the current state
   (who does this affect and to what degree?)
-->

## Solution

_Provide a summary of the solution this PR offers._
<!--
It can be helpful if we understand:
1. What the solution is,
2. Why this approach was chosen,
3. How you implemented the change, and
4. Possible limitations of this approach and alternate solution paths.
-->

## Major changes

_For complex PRs, create a list of the significant updates made._

## Testing and review

_Share recommended methods for reviewing this change._
<!--
1. Describe the tests that you ran to verify your changes,
2. Provide instructions to reproduce these tests, and
3. Clarify the type of feedback you are looking for at this phase.
-->

<!--
## Dependency updates

| Dependency name              | Previous version | New version |
| ---------------------------- | :--------------: | :---------: |
| [Updated dependency example] |     [1.0.0]      |   [1.0.1]   |
| [New dependency example]     |        --        |   [3.0.1]   |
| [Removed dependency example] |     [2.10.2]     |     --      |
-->
<!--
For PRs that include dependency updates, uncomment this section and
include a list of the changed dependencies and version numbers.
-->

<!--
Before opening this PR, make sure you’ve done whichever of these applies to you:
- [ ] Confirm that this code follows the [18F Front End Coding Style Guide](https://pages.18f.gov/frontend/) and [Accessibility Guide](https://pages.18f.gov/accessibility/checklist/).
- [ ] Run `git pull origin [base branch]` to pull in the most recent updates from your base and check for merge conflicts. (Often, the base branch is `develop`).
- [ ] Run `npm run prettier:sass` to format any Sass updates.
- [ ] Run `npm test` and confirm that all tests pass.
- [ ] Run your code through [HTML_CodeSniffer](http://squizlabs.github.io/HTML_CodeSniffer/) and make sure it’s error free.
-->
