This `/security` directory contains SHA-256 hashes for each USWDS hashed release ZIP file. Use these hashes to verify the authenticity of USWDS release ZIP files. Compare our SHA-256 hash with the hash you generate from the ZIP you wish to test.

**OSX/Linux**: Use the `sha256sum` command in a terminal window. (Replace the path with the path to the file you wish to test.)

```bash
sha256sum path/to/filename.zip
```

**Windows:** Open up PowerShell and run the following command. (Replace the path with the path to the file you wish to test.)

```bash
powershell get-filehash -algorithm sha256 .\path\to\filename.zip
```
