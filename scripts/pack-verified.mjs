import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { basename, join } from "node:path";

const directory = "release-artifacts";
rmSync(directory, { recursive: true, force: true });
mkdirSync(directory);
const report = JSON.parse(
  execFileSync(
    "npm",
    ["pack", "--ignore-scripts", "--json", "--pack-destination", directory],
    { encoding: "utf8" },
  ),
);
const packs = Array.isArray(report) ? report : Object.values(report);
if (packs.length !== 1) throw new Error("Expected exactly one packed package");
const [pack] = packs;
if (pack.name !== "@uswds/uswds" || basename(pack.filename) !== pack.filename)
  throw new Error("Unexpected packed package");
renameSync(join(directory, pack.filename), join(directory, "package.tgz"));
const bytes = readFileSync(join(directory, "package.tgz"));
const manifest = {
  name: pack.name,
  version: pack.version,
  source: execFileSync("git", ["rev-parse", "HEAD"], {
    encoding: "utf8",
  }).trim(),
  sha256: createHash("sha256").update(bytes).digest("hex"),
  integrity: `sha512-${createHash("sha512").update(bytes).digest("base64")}`,
  runId: process.env.GITHUB_RUN_ID || "local",
  runAttempt: process.env.GITHUB_RUN_ATTEMPT || "local",
};
writeFileSync(
  join(directory, "manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);
writeFileSync(
  join(directory, "SHA256SUMS"),
  `${manifest.sha256}  package.tgz\n`,
);
console.log(JSON.stringify(manifest, null, 2));
