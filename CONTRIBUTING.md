## Welcome!

So glad you’re thinking about contributing to the U.S. Web Design System (USWDS)!

USWDS is for everyone, as an open source product that accepts contributions from USWDS community members. USWDS is the result of community contributions, large and small. Your contribution helps make the Design System better for the next team that uses it.

## Code of Conduct

USWDS is committed to building a safe, welcoming, harassment-free culture for everyone. 

By voluntarily participating in a USWDS community, you're agreeing to abide by the [Digital.gov Community Guidelines](https://digital.gov/communities/community-guidelines/) and the [TTS Code of Conduct](https://handbook.tts.gsa.gov/code-of-conduct/). Respect your peers, use plain language, be patient, practice constructive criticism, and stay organized.

We encourage you to read USWDS’s Contribution Guide (you're here; great start!), about the USWDS [COMMUNITY](https://github.com/uswds/uswds/blob/develop/COMMUNITY.md) which includes how to be recognized here for your contributions, the USWDS [README](https://github.com/uswds/uswds/blob/develop/README.md), and the USWDS [LICENSE](https://github.com/uswds/uswds/blob/develop/LICENSE.md). You can also read more about the open source policy USWDS uses at the [18F Open Source Policy GitHub repository](https://github.com/18f/open-source-policy), and if you have questions, you can send USWDS an [email](mailto:uswds@gsa.gov).

## How you can contribute

### Getting Started

Anyone can contribute to USWDS. Whether it's submitting a bug or proposing a new component, we welcome your ideas on how to improve the Design System.

First time contributor? That's totally okay — great, even. Someone reviews every single contribution before merging it into USWDS. If you’re unsure about anything, just [ask](mailto:uswds@gsa.gov) — or submit your issue or pull request anyway, to get the conversation started.

Before submitting a contribution, you’ll need to create a GitHub account or sign in to your existing account. You'll also need to set up [signature verification on your commits](#setting-up-verified-commits).

If you want to see some contributions before submitting your own, you can look at [past pull requests](https://github.com/uswds/uswds/pulls?q=is%3Apr+is%3Aclosed) [or issues contributed by other community members](https://github.com/uswds/uswds/issues?q=is%3Aissue%20state%3Aclosed). If you want ideas on where to start, check out the category of [good first issues](https://github.com/uswds/uswds/issues?q=is%3Aissue+is%3Aopen+label%3A%22Good+First+Issue%22). Again, if you have any questions, don’t hesitate to [reach out](mailto:uswds@gsa.gov).

### Setting up verified commits
> [!important]
> For security reasons, all commits to this repository must have a verified signature. Use one of the following GitHub guides to set up your verification signature:
> - [GPG commit signature verification](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification#gpg-commit-signature-verification)
> - [SSH commit signature verification](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification#ssh-commit-signature-verification)

### Reporting bugs and issues

If something isn’t working the way it's supposed to, here’s how you can let someone know:

#### 1. Check the issues backlog to see if your bug has already been reported

First, check the USWDS [current issues](https://github.com/uswds/uswds/issues) to see if your [bug](https://github.com/uswds/uswds/issues?q=is%3Aissue%20bug%20type%3ABug) has already been reported. If it's about the USWDS website, it'll be in the [USWDS site repository](https://github.com/uswds/uswds-site/issues).

If your bug has already been reported, leave a comment in the original issue and provide any additional context (if different than the original submission). This helps everyone better understand the issue and its impact.

#### 2. Document how to reproduce the bug

Before submitting a bug, try to recreate it and document the steps someone else can take to reproduce it. If you can, take screen shots to capture specific details about the bug. This helps everyone understand its context, which is especially helpful since everyone can only fix bugs that they can understand and reproduce.

#### 3. Submit an issue

If your bug or issue is not in [current issues](https://github.com/uswds/uswds/issues), submit a new issue using the [bug report template](https://github.com/uswds/uswds/issues/new?assignees=&labels=Type%3A+Bug%2CStatus%3A+Triage%2CNeeds%3A+Confirmation&template=bug_report.yaml&title=USWDS+-+Bug%3A+%5BYOUR+TITLE%5D). Someone may reach out to you if further clarification or context would be helpful. That person may also need your help testing possible solutions, so checking back on it would be helpful.

If you have a code fix for the issue, go ahead and submit a [pull request](https://github.com/uswds/uswds-site/pulls), though it's helpful if you'd make sure to file the issue too (and connect the two), rather than jumping directly to the pull request.

### Proposing feature requests or enhancements

If you’ve got a new idea or a suggestion for how something could work better, that's helpful to hear about. Follow these steps:

#### 1. Check the backlog of current feature requests

Check our [feature requests backlog](https://github.com/uswds/uswds/issues?q=is%3Aissue+is%3Aopen+label%3A%22Type%3A+Feature+Request%22) for any duplicate or similar feature requests.

If someone else already suggested your idea, upvote that feature request with a thumbs up emoji (👍) and comment on the issue to let us know why you need or could this feature request, along with any other supporting information. The number of upvotes (represented by 👍) can help with prioritizing feature requests.

If you want to find other feature requests open for upvoting, check out the [feature request view sorted by status](https://github.com/orgs/uswds/projects/8/views/18?sortedBy%5Bdirection%5D=asc&sortedBy%5BcolumnId%5D=Status).

#### 2. Submit an issue

If your idea _isn't_ in the [current issues backlog](https://github.com/uswds/uswds/issues?q=is%3Aissue+is%3Aopen+label%3A%22Type%3A+Feature+Request%22), submit an issue using the [feature request template](https://github.com/uswds/uswds/issues/new?assignees=&labels=Type%3A+Feature+Request%2CStatus%3A+Triage&template=feature_request.yaml&title=USWDS+-+Feature%3A+%5BYOUR+TITLE%5D).  Someone may reach out to you if further clarification on your submission would be helpful to move it forward.


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

Here are a few other utility commands you might find useful:

- `npm run lint`: Runs `eslint` and `sass-lint` against JavaScript and Sass files
- `npm run prettier`: Runs `prettier` against HTML, JavaScript, and Sass files
- `npm test`: Runs all tests and linters

#### Submitting a pull request for a bug fix:

1. Check our [open issues backlog](https://github.com/uswds/uswds/issues) for any duplicate or similar issues.
1. If someone else already submitted your bug, feel free to comment and provide additional context (if different than the original submission).
1. If your proposed fix isn't in the open issues backlog, create an [issue](https://github.com/uswds/uswds/issues/new/choose) for the change you’re proposing. This helps with tracking.
1. Follow the steps in the [Getting started with USWDS code](#getting-started-with-uswds-code) section above to get set up locally.
1. Create a branch from `develop` and name it in a way that lightly defines what you’re working on (for example, `add-styles`).
1. Once you’re ready to submit a pull request, fill out the [pull request template](https://github.com/uswds/uswds/compare).
1. Link your pull request to the issue you created. This important step hooks together which issue this solution fixes. Tip: You can link the pull request in the body of the pull request template using the GitHub comment `closes #issue-no` or `resolves #issue-no`. You can read more about linking pull requests on [GitHub](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue).
1. Submit your pull request against the `develop` branch.

If your pull request is accepted, a USWDS Administrator or Maintainer will merge the pull request for you.

#### Submitting a pull request for a feature request or enhancement:

1. Check our [open issues backlog](https://github.com/uswds/uswds/issues) for any duplicate or similar issues.
1. If your idea has already been suggested, upvote that feature request with a thumbs up emoji (👍) and comment on the issue to let us know why you need this feature request or enhancement, along with any other supporting information.
Tip: If you want to find other feature requests open for voting, check out our [feature requests sorted by votes](https://github.com/uswds/uswds/issues?q=is%3Aissue+is%3Aopen+label%3A%22Status%3A+Voting+Open+%F0%9F%91%8D%22+sort%3Areactions-%2B1-desc).
1. If your proposed fix _isn't_ in the [open issues backlog](https://github.com/uswds/uswds/issues), [create an issue](https://github.com/uswds/uswds/issues/new?assignees=&labels=Type%3A+Feature+Request%2CStatus%3A+Triage&template=feature_request.yaml&title=USWDS+-+Feature%3A+%5BYOUR+TITLE%5D) describing your proposal. This doesn’t mean a pull request wouldn't be welcome. Having the conversation in the open first is helpful to others — people might have supporting thoughts to add to your proposal. If you’ve already got a pull request done, no worries. Go ahead and attach it to the issue.

### Proposing something else?

If you’d like to contribute something else that doesn’t fall into any of the above, that's still helpful. Just create an issue or a discussion, and we can talk about it.

## How we prioritize

Once you’ve submitted a contribution, someone will triage it based on the following considerations:
1. **Size:** Can we accomplish this in a sprint or will this take longer?
1. **Severity:** What type of functionality is impacted? Is there a workaround?
1. **Priority:** Does this align with USWDS vision and roadmap goals?

Note: USWDS prioritizes issues that affect accessibility.

These considerations help Contributors decide how to prioritize the issue.

You can stay up to date on the status of your contributions through [GitHub email notifications](https://docs.github.com/en/account-and-profile/managing-subscriptions-and-notifications-on-github/setting-up-notifications/configuring-notifications) (external link) and the assigned labels on the issue.

## Joining the USWDS Community as a Contributor

_If you're comfortable with git_, the short version is: fork the repo, 
add yourself to the contributor table in `COMMUNITY.md`, open a PR, 
then open an issue and link them both together in their details.

_If you'd like a step-by-step walkthrough_ using only the GitHub website without needing a local version, 
follow the instructions below:

_If you run into any trouble_, feel free to open an issue or reach out at [uswds@gsa.gov](mailto:uswds@gsa.gov).

### Step 1: Open an issue

1. Navigate to: `https://github.com/uswds/uswds/issues/new?template=contributor_ladder.md`
2. Title your issue using this format: `[ROLE CHANGE]: Change to Contributor - YourUsername`
3. Fill in your GitHub username and set "Requested role" to Contributor (or another role you might be applying for)
4. Skip the PR link for now — you'll come back and add it after Step 2
5. Check off the role responsibilities that apply to you
6. Click **Create** to submit
7. Make note of your issue number from the URL — you'll need it in Step 2 and at the end

### Step 2: Open a pull request
> Already have the repo forked? Skip to item 2.

1. Fork the USWDS repo at: `https://github.com/uswds/uswds/fork` and click **Create fork**
2. Navigate to: `https://github.com/YOUR-USERNAME/uswds/edit/develop/COMMUNITY.md`
3. Find the contributor table (currently around line 11) and add yourself as the new last row:
   `| Contributor | Your Name(https://github.com/YOUR-USERNAME) | Your Affiliation |`
4. Scroll down and Commit the change
5. Navigate to: `https://github.com/uswds/uswds/compare/develop...YOUR-USERNAME:uswds:develop` and click **Create pull request**
6. Title your PR: `USWDS - Community: Add [Your Name] as Contributor`
7. In the **Related issue** field, paste the link to your issue from Step 1
8. Click **Create pull request** and copy the URL of your new resulting pull request

### Step 3: Link issue to pull request

Navigate to your issue at `https://github.com/uswds/uswds/issues/YOUR-ISSUE-NUMBER` and add the pull request link from Step 2.

The USWDS internal team will review both and follow up with next steps.

Feel free to open an issue or email [uswds@gsa.gov](mailto:uswds@gsa.gov) if you have questions.

## Common terms

There can be a lot of jargon when discussing how you can contribute to the Design System. Here are some common GitHub / open source / development terms:

- **Backlog** - list of deliverables (like a feature request, enhancement, or bug) that should be implemented into upcoming product development work.
- **Bug** - problem resulting in something not working properly or as expected.
- **Contribution** - when a community member provides work or gives back in a way that enhances the Design System — by proposing a new idea, enhancement, or fix that’s provided for other people to use.
- **Enhancement** - a proposal to make something existing in the Design System work better.
- **Feature request** - a proposal for something new to be included to the Design System.
- **Fork** - a copy of a repository that you manage.
- **Open source** - something that can be viewed, modified, and shared by anyone in the public with permissions enforced through an open source license.
- **Pull request** - a way to notify team members when a contributor wants to merge new code changes into a main project repository. You can read more on [GitHub](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests) (external link).
- **Repository (aka repo)** - In Github, a repository contains all your files and each of their revisions. You can read more on [GitHub](https://docs.github.com/en/repositories/creating-and-managing-repositories/about-repositories) (external link).
- **Roadmap** - a summary that outlines a product’s goals, priorities, and progress over a period of time.

## Licenses and attribution

### A few parts of this project are not in the public domain

For complete attribution and licensing information for parts of the project that are not in the public domain, see the [LICENSE](https://github.com/uswds/uswds/blob/develop/LICENSE.md).

### The rest of this project is in the public domain

The rest of this project is in the worldwide [public domain](https://github.com/uswds/uswds/blob/develop/LICENSE.md#the-rest-of-this-project-is-in-the-worldwide-public-domain).

This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).

### Contributions will be released into the public domain

All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you're agreeing to comply with this waiver of copyright interest.
