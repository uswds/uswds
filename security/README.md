This `security` directory contains the auto-generated sha256 hash's on release.
This way users can verify they're using an authentic, unmodified, ZIP file from USWDS.

You can view the ZIP file's hash on OSX/Linux using the `sha256sum` command in terminal.

For example:

```bash
sha256sum path/to/uswds-zip/uswds-2.9.0
```

On Windows, you'll need to open up powershell and run:

```bash
powershell get-filehash -algorithm sha256 .\path\to\uswds-zip\uswds-2.9.0
```
