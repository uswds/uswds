import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { verifyNpmAudit } from "./verify-npm-audit.mjs";
import { verifyArtifact } from "./release-policy.mjs";

const tarball = resolve("release-artifacts/package.tgz");
const manifest = JSON.parse(
  readFileSync("release-artifacts/manifest.json", "utf8"),
);
verifyArtifact(manifest, readFileSync(tarball), {
  source: process.env.SOURCE_SHA,
  version: process.env.RELEASE_VERSION,
  runId: process.env.GITHUB_RUN_ID,
});
const directory = mkdtempSync(join(tmpdir(), "uswds-release-audit-"));
try {
  writeFileSync(
    join(directory, "package.json"),
    JSON.stringify({
      name: "uswds-release-audit",
      version: "1.0.0",
      private: true,
    }),
  );
  execFileSync(
    "npm",
    ["install", "--ignore-scripts", "--no-audit", "--fund=false", tarball],
    { cwd: directory, stdio: "inherit" },
  );
  const audit = spawnSync(
    "npm",
    ["audit", "--omit=dev", "--json", "--audit-level=info"],
    { cwd: directory, encoding: "utf8", maxBuffer: 10 * 1024 * 1024 },
  );
  if (audit.error) throw audit.error;
  writeFileSync("release-artifacts/audit.json", audit.stdout);
  console.log(
    JSON.stringify(
      verifyNpmAudit(audit.stdout, audit.status, "production"),
      null,
      2,
    ),
  );
} finally {
  rmSync(directory, { recursive: true, force: true });
}
