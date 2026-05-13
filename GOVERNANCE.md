# Governance
## Purpose
[The U.S. Web Design System (USWDS)](https://designsystem.digital.gov/) is a toolkit of principles, guidance, and code that makes it easier to build accessible, mobile-friendly, legally compliant government websites.

Teams can build a website or service in lots of different ways. USWDS has been designed to deliver [unique benefits](https://designsystem.digital.gov/about/key-benefits/) to government teams, such as [compliance from the start](https://designsystem.digital.gov/about/key-benefits/#compliance-from-the-start-2), [proven design solutions that users expect](https://designsystem.digital.gov/about/key-benefits/#proven-design-solutions-that-users-expect-2), [team alignment and common goals](https://designsystem.digital.gov/about/key-benefits/#team-alignment-and-common-goals-2), [mission focus](https://designsystem.digital.gov/about/key-benefits/#mission-focus-2), [a cross-functional design system community](https://designsystem.digital.gov/about/key-benefits/#a-cross-functional-design-system-community-2), and [effective stewardship of public resources](https://designsystem.digital.gov/about/key-benefits/#effective-stewardship-of-public-resources-2).

You can find a broader view on the [USWDS About page](https://designsystem.digital.gov/about/), which contains the USWDS mission, vision, polestar, and a brief history. You may also want to reference [USWDS key benefits](https://designsystem.digital.gov/about/key-benefits/), [product values](https://designsystem.digital.gov/about/product-values/), [design principles](https://designsystem.digital.gov/design-principles/), and [engineering values](https://github.com/uswds/uswds-proposals/blob/main/docs/engineering-values.md).  

USWDS governance supports and strengthens these core principles, code, and guidance. 

<!-- ## Glossary
-->
<!-- TODO: Fill out this section.
- Do this last! Anything that’s a ‘proper noun’, similar to example here: [https://dsacms.github.io/ospo-guide/resources/glossary/\#custom-developed-code](https://dsacms.github.io/ospo-guide/resources/glossary/#custom-developed-code)
-->
<!-- ## Project scope
-->
<!-- TODO: Fill out this section.
- The open source offering consists of all necessary assets to build a USWDS-based site or product, along with the necessary documentation
- Community scope will shift over time, and to begin, we will engage with the USWDS community to define the initial scope, and an expanded short and medium term scope that we are working towards.
-->
## Community principles

Community principles and processes can be found in [COMMUNITY.md](./COMMUNITY.md) 

## Development principles

- [USWDS engineering values](https://github.com/uswds/uswds-proposals/blob/main/docs/engineering-values.md)
- [CONTRIBUTING.md](./CONTRIBUTING.md)

## Contributor ladder / role definitions

See [COMMUNITY.md](./COMMUNITY.md)

## Standards

<!-- ### Version convention -->

<!-- - We will follow semantic version: [https://semver.org/](https://semver.org/)
  - If a change breaks backwards compatibility, then it will increment the major version
  - If a change introduces a new feature, or deprecates an old feature than it will update the minor version
  - If a feature is tweaked or a very small one is added, or a bug fix is pushed, that will increment the page version -->

<!-- ### Release lifecycle -->

<!-- TODO: Describe the existing process here.-->

<!-- ### Release format & platform -->

<!-- TODO: Describe the existing process here
- Generally, USWDS strives to adhere to the GSA Open Source Release Guidance outlined here: [https://dsacms.github.io/ospo-guide/outbound/release-guidelines/](https://dsacms.github.io/ospo-guide/outbound/release-guidelines/)
- A git tag will be made for each release, the tag will be the version string prefixed with a ‘v’ (i.e. ‘vX.Y.Z’)
- Each git tag will also correspond to a github “release”: [https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases)
- Pre-built docker images will be pushed to DockerHub for each release, tagged with the version string. Additionally, the ‘latest’ tag will be updated with each release and each major / minor versions will have tags corresponding to the most recent sub-version
- Releases will update the [CHANGELOG.md](http://CHANGELOG.md) file to appropriately describe important updates
-->

### Review guidelines
Consider the following questions when reviewing PRs:
- Does it work / look like what’s expected?
    - This is most important. We don’t want to review something that doesn’t address the original problem.
- Is it a signed / verified commit?
    - Any commit [must be signed / verified](https://github.com/uswds/uswds/blob/develop/CONTRIBUTING.md#setting-up-verified-commits) before it can be merged. 
- Is the code performant?
    - DOM manipulation should be efficient and minimal.
    - Favor native browser APIs over libraries.
- Is the code readable?
    - Code should be easy to understand and self-documenting.
    - New functions should have easy-to-understand [JSDocs](https://devhints.io/jsdoc) or SassDocs comments.
- Is it testable? 
    - We need to be able to easily reproduce the issue. 
    - Consider a unit test to ensure there aren’t regressions in the future.
- Does it match existing conventions?
    - Confirm that it matches established patterns in USWDS, WCAG, gov.uk, or other trusted sources.
- Does the PR have a good summary and description?
    - Ensure summary and description are plain language and easy to understand.
    - The summary is used for the release note. Ensure it follows the expected pattern in the Creating PRs section above.
- Is this a markup or breaking change?

**During review: comments and requested changes**
- Consider using [conventional comments](https://conventionalcomments.org/) to clearly distinguish between different types of comments. Comments, except for thought and praise, are blocking unless otherwise noted.
- Move the issue back to `In Progress`.
- Address before final review.
- Add commit hash if addressing change.

### Accessibility standards

> Accessibility standards follow the guidelines from USWDS: [https://designsystem.digital.gov/](https://designsystem.digital.gov/) and adhere to specifications from GSA: [https://www.gsa.gov/website-information/accessibility-statement](https://www.gsa.gov/website-information/accessibility-statement). Currently, that means meeting [WCAG 2.1 AA](https://www.w3.org/WAI/standards-guidelines/wcag/) at a minimum, accurately publishing our accessibility tests on each component page, and [compiling all component status tests](https://designsystem.digital.gov/components/status/). This encompasses:
> - Section 508 compliance
> - 21st Century Integrated Digital Experience Act (IDEA) compliance

## Decision-making

As with other [Tier3 Open Source Community Projects](https://github.com/DSACMS/repo-scaffolder/blob/main/tier3/README.md), USWDS uses a 'co-planning' approach of community-informed roadmapping.

The [COMMUNITY.md](./COMMUNITY.md) file outlines how USWDS Contributor (committer) and USWDS Maintainer privileges are approved and managed, and how to join the USWDS Open Source Community.

[CONTRIBUTING.md](./CONTRIBUTING.md) describes how to make meaningful changes to USWDS through reporting bugs and issues, proposing feature requests or enhancements, submitting other code contributions, and further details about joining the USWDS Open Source Community, along with some common terms, plus licenses and attribution.

<!-- ### Changes to project scope -->

<!-- TODO: Describe the existing process here

DESIGN-PROPOSAL.md and ARCHITECTURE-PROPOSAL.md outline the process by which product and infrastructure suggestions are prioritized and decided.

TECHRADAR.md outlines the overall technology stack and tooling constraints that the project operates within, and the process by which new major technologies are introduced to the project.

ISSUE\_TEMPLATE\*.md and PULL\_REQUEST\_TEMPLATE.md define the mechanics of how changes are proposed and merged.
-->

### Bug reports

Bug reports should be made through GitHub Issues using the [bug report issue template](.github/ISSUE_TEMPLATE/bug_report.yaml).

### Feature requests

Feature requests should be made through GitHub Issues using the [feature request issue template](.github/ISSUE_TEMPLATE/feature_request.yaml).

## Community communication

### Accepting general feedback

You can provide feedback through uswds@gsa.gov or [GitHub Issues](https://github.com/uswds/uswds/issues).

### Communicating roadmap

Active work can be tracked by the public through the [USWDS product roadmap](https://designsystem.digital.gov/about/product-roadmap/)) and [repo project boards](https://github.com/orgs/uswds/projects/8/views/59). 
