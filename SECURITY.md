# Security

## Our security policies and procedures

We follow GSA's [IT security policy](https://www.gsa.gov/directive/gsa-information-technology-%28it%29-security-policy) to ensure the confidentiality, integrity, and availability of USWDS.

We use [Snyk](https://snyk.io) to find, fix, and prevent vulnerabilities in USWDS dependencies. We run Snyk checks locally during development and automatically on all pull requests.

We perform static analysis on our JavaScript on every pull requests with [GitHub CodeQL](https://securitylab.github.com/tools/codeql).

We include a security and vulnerability report with every USWDS release, and release security patches for both the 1.x and 2.x branches.

## Using USWDS securely

We encourage you to verify the security and status of the USWDS package:

1. **Check the vulnerability badge.** Confirm the vulnerability badge in the [USWDS Github code repository](https://github.com/uswds/uswds) says there are `0` vulnerabilities.
1. **Download the package via npm.** We recommend using the [npm package](https://designsystem.digital.gov/documentation/developers/#install-using-npm) instead of the [zip file](https://designsystem.digital.gov/documentation/developers/#download), whenever possible. Using npm makes it easier to stay up-to-date and use the latest USWDS version as a project dependency, and is a secure and reliable way to download USWDS source code.

## Report a security issue

To learn more about our security practices or to report a security issue, please [email us](mailto:uswds@support.digitalgov.gov). If the issue is confirmed, we will release a patch as soon as possible.
