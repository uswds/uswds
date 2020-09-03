We follow GSA's [IT security policy](https://www.gsa.gov/directive/gsa-information-technology-%28it%29-security-policy)
to ensure the confidentiality, integrity and availability of USWDS.

We use Snyk to find, fix, and prevent vulnerabilities in USWDS. We run Snyk
checks locally during development and automatically on pull requests to keep the
USWDS package up-to-date.

We also encourage you to verify the security of the USWDS package you're using:

1. **Check the vulnerability badge.** Confirm the vulnerability badge in the
[USWDS Github code repository](https://github.com/uswds/uswds) says there are
`0` vulnerabilities.
1. **Download the package via NPM.** We recommend using the [NPM package](https://designsystem.digital.gov/documentation/developers/#install-using-npm)
instead of downloading the [zip file](https://designsystem.digital.gov/documentation/developers/#download).
NPM ensures you’re using a legitimate copy of USWDS straight from the source.
It also makes it easier to stay up-to-date with the latest USWDS version.

To learn more about our security best practices or to report a security issue,
please [email us](mailto:uswds@support.digitalgov.gov).
