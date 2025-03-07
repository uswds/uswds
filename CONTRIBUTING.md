## Welcome!

We’re glad you’re thinking about contributing to the U.S. Web Design System (USWDS)!

USWDS is for everyone — we’re an open source project that accepts contributions from our community members. USWDS is the result of community contributions, large and small. Your contribution helps make the Design System better for the next team that uses it.

## Code of Conduct

USWDS is committed to building a safe, welcoming, harassment-free culture for everyone. USWDS is a part of the Technology Transformation Services (TTS) within the General Services Administration (GSA) and we expect everyone to follow the [GSA TTS Code of Conduct](https://handbook.tts.gsa.gov/about-us/code-of-conduct/).

We encourage you to read this project’s Contribution Guide (you are here), its [LICENSE](https://github.com/uswds/uswds/blob/develop/LICENSE.md) and its [README](https://github.com/uswds/uswds/blob/develop/README.md). If you want to read more about our open source policy or have questions, check out the [18F Open Source Policy GitHub repository](https://github.com/18f/open-source-policy) or send us an [email](mailto:uswds@gsa.gov).

## How you can contribute

### Getting Started

Anyone can contribute to USWDS. Whether it's submitting a bug or proposing a new component, we welcome your ideas on how to improve the Design System.

First time contributor? We’re here to help guide you through a successful contribution. We review all contributions before merging them into USWDS. If you’re unsure about anything, just [ask](mailto:uswds@gsa.gov) — or submit your issue or pull request anyway to get the conversation started.

Before submitting a contribution, you’ll just need to create a GitHub account or sign in to your existing account. You'll also need to set up [signature verification on your commits](#setting-up-verified-commits).

If you want to see some other contributions before submitting your own, check out [some good first issues](https://github.com/uswds/uswds/issues?q=is%3Aissue+is%3Aopen+label%3A%22Good+First+Issue%22) from other community members. Again, if you have any questions, don’t hesitate to [reach out to us](mailto:uswds@gsa.gov).

### Setting up verified commits
> [!important]
> For security reasons, all commits to this repository must have a verified signature. Use one of the following GitHub guides to set up your verification signature:
> - [GPG commit signature verification](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification#gpg-commit-signature-verification)
> - [SSH commit signature verification](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification#ssh-commit-signature-verification)

### Reporting bugs and issues

If something isn’t working the way it's supposed to, here’s how you can let us know:

#### 1. Check the issues backlog to see if your bug has already been reported

First, check our [current issues backlog](https://github.com/uswds/uswds/issues?q=is%3Aissue+is%3Aopen+label%3A%22Type%3A+Bug%22+) to see if your bug has already been reported.

If your bug has already been reported, leave a comment in the original issue and provide any additional context (if different than the original submission). This helps us better understand the issue and its impact.

#### 2. Document how to reproduce the bug

Before submitting a bug, try to recreate it and document the steps we can take to reproduce it. If you can, take screen shots to capture specific details about the bug. This helps us understand its context. We can only fix bugs that we're able to understand and reproduce.

#### 3. Submit an issue

If your bug or issue is not in the [current issues backlog](https://github.com/uswds/uswds/issues?q=is%3Aissue+is%3Aopen+label%3A%22Type%3A+Bug%22+), submit an issue using the [bug report template](https://github.com/uswds/uswds/issues/new?assignees=&labels=Type%3A+Bug%2CStatus%3A+Triage%2CNeeds%3A+Confirmation&template=bug_report.yaml&title=USWDS+-+Bug%3A+%5BYOUR+TITLE%5D). A USWDS core team member may reach out to you if we need further clarification or context. We may also need your help testing possible solutions. Be sure to check in on your issue to answer any questions we may have about it.

If you have a code fix for the issue, go ahead and submit a pull request. Our team tracks issues, so make sure any pull request you submit has a related issue.

### Proposing feature requests or enhancements

If you’ve got a new idea or a suggestion for how something could work better, we want to hear about it. Here are a few steps to help you submit a feature request or enhancement.

#### 1. Check the backlog of current feature requests

Check our [feature requests backlog](https://github.com/uswds/uswds/issues?q=is%3Aissue+is%3Aopen+label%3A%22Type%3A+Feature+Request%22) for any duplicate or similar feature requests.

If your idea has already been suggested, upvote that feature request with a thumbs up emoji (👍) and comment on the issue to let us know why you need this feature request and any other supporting information. We review the number of upvotes (represented by 👍) to help us prioritize feature requests.

If you want to find other feature requests open for upvoting, check out our [feature request view sorted by status](https://github.com/orgs/uswds/projects/8/views/18?sortedBy%5Bdirection%5D=asc&sortedBy%5BcolumnId%5D=Status).

#### 2. Submit an issue

If your idea is not in the [current issues backlog](https://github.com/uswds/uswds/issues?q=is%3Aissue+is%3Aopen+label%3A%22Type%3A+Feature+Request%22), submit an issue using the [feature request template](https://github.com/uswds/uswds/issues/new?assignees=&labels=Type%3A+Feature+Request%2CStatus%3A+Triage&template=feature_request.yaml&title=USWDS+-+Feature%3A+%5BYOUR+TITLE%5D).  A USWDS core team member may reach out to you if we need further clarification on your submission.


### Submitting code contributions

#### Getting started with USWDS code

1. First, fork this repo into your GitHub account. Read more about [forking a repo on GitHub](https://help.github.com/articles/fork-a-repo/).
1. Open your local copy of the repository then run the following command in terminal to install project dependencies:
    ```sh
    npm install
    ```
1. Now that all of your dependencies are installed, start your local server by running the following command:
    ```sh
    npm start
    ```
1. Open `localhost:6006` in your browser to see your local build of the the USWDS component library in Storybook.

Here are a few other utility commands you may find useful:

- `npm run lint`: Runs `eslint` and `sass-lint` against JavaScript and Sass files.
- `npm run prettier`: Runs `prettier` against HTML, JavaScript, and Sass files.
- `npm test`: Runs all tests and linters.

#### Submitting a pull request for a bug fix:

1. Check our [open issues backlog](https://github.com/uswds/uswds/issues) for any duplicate or similar issues.
1. If your bug has already been submitted, feel free to comment and provide additional context (if different than the original submission).
1. If your proposed fix is not in the open issues backlog, create an [issue](https://github.com/uswds/uswds/issues/new/choose) for the change you’re proposing. This helps us track our work.
1. Follow the steps in the [Getting started with USWDS code](#getting-started-with-uswds-code) section above to get setup locally.
1. Create a branch from `develop` and name it in a way that lightly defines what you’re working on (for example, `add-styles`).
1. Once you’re ready to submit a pull request, fill out the [pull request template](https://github.com/uswds/uswds/compare).
1. Link your pull request to the issue you created. This important step helps us know which issue this solution fixes. Tip: You can link the pull request in the body of the pull request template using the GitHub comment `closes #issue-no` or `resolves #issue-no`. You can read more about linking pull requests on [GitHub](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue).
1. Submit your pull request against the `develop` branch.

If the pull request is accepted, we will schedule the issue and merge the pull request for you.

#### Submitting a pull request for a feature request or enhancement:

1. Check our [open issues backlog](https://github.com/uswds/uswds/issues) for any duplicate or similar issues.
1. If your idea has already been suggested, upvote that feature request with a thumbs up emoji (👍) and comment on the issue to let us know why you need this feature request or enhancement and any other supporting information.
Tip: If you want to find other feature requests open for upvoting, check out our [feature requests sorted by upvotes](https://github.com/uswds/uswds/issues?q=is%3Aissue+is%3Aopen+label%3A%22Status%3A+Voting+Open+%F0%9F%91%8D%22+sort%3Areactions-%2B1-desc).
1. If your proposed fix is not in the [open issues backlog](https://github.com/uswds/uswds/issues), [create an issue](https://github.com/uswds/uswds/issues/new?assignees=&labels=Type%3A+Feature+Request%2CStatus%3A+Triage&template=feature_request.yaml&title=USWDS+-+Feature%3A+%5BYOUR+TITLE%5D) describing your proposal. This doesn’t mean we don’t want you to create a pull request. We simply want to start the process with an online conversation first. Plus, other community members might have supporting thoughts to add to your proposal. If you’ve already got a pull request, no worries. Go ahead and attach it to the issue.

### Proposing something else?

If you’d like to contribute something else that doesn’t fall into any of the above, we’d still love to hear about it. Just create an issue or a discussion, and we can talk about it.

## How we prioritize

Once you’ve submitted a contribution, we'll triage it based on the following considerations:
1. **Size:** Can we accomplish this in a sprint or will this take longer?
1. **Severity:** What type of functionality is impacted? Is there a workaround?
1. **Priority:** Does this align with our vision and roadmap goals?

Note: We prioritize issues that affect accessibility.

These considerations help us decide if and when we can work on the issue. If the issue is accepted, we will schedule them for an upcoming sprint (a 2-week work period).

You can stay up to date on the status of your contributions through [GitHub email notifications](https://docs.github.com/en/account-and-profile/managing-subscriptions-and-notifications-on-github/setting-up-notifications/configuring-notifications) (external link) and the assigned labels on the issue.

## Common terms

There can be a lot of jargon when discussing how you can contribute to the Design System. We’ve included some common terms we use below.

- **Backlog** - list of deliverables (like a feature request, enhancement, or bug) that should be implemented into upcoming product development.
- **Bug** - problem resulting in something not working properly or as expected.
- **Contribution** - when a community member gives back in a way that enhances the Design System by proposing a new idea, enhancement, or fix that’s released through the system for other people to use.
- **Enhancement** - a proposal to make something existing in the Design System work better.
- **Feature request** - a proposal for something new to be included to the Design System.
- **Fork** - a copy of a repository that you manage.
- **Open source** - something that can be viewed, modified, and shared by anyone in the public with permissions enforced through an open source license.
- **Pull request** - a way to notify project team members when a contributor/developer wants to merge new code changes into a main project repository. You can read more on [GitHub](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests) (external link).
- **Repository (aka repo)** - In Github, a repository contains all your projects’ files and each of their revisions. You can read more on [GitHub](https://docs.github.com/en/repositories/creating-and-managing-repositories/about-repositories) (external link).
- **Roadmap** - a summary that outlines a product’s goals, priorities, and progress over a period of time.

## Licenses and attribution

### A few parts of this project are not in the public domain

For complete attribution and licensing information for parts of the project that are not in the public domain, see the [LICENSE](https://github.com/uswds/uswds/blob/develop/LICENSE.md).

### The rest of this project is in the public domain

The rest of this project is in the worldwide [public domain](https://github.com/uswds/uswds/blob/develop/LICENSE.md#the-rest-of-this-project-is-in-the-worldwide-public-domain).

This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).

### Contributions will be released into the public domain

All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.
