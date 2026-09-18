import { execFileSync } from "node:child_process";
import { appendFileSync, readFileSync } from "node:fs";
import { authorizeRelease } from "./release-policy.mjs";

const source = process.env.SOURCE_SHA;
if (!/^[a-f0-9]{40}$/.test(source || ""))
  throw new Error("Select a full commit SHA");
execFileSync("git", ["merge-base", "--is-ancestor", source, "HEAD"]);
const pkg = JSON.parse(
  execFileSync("git", ["show", `${source}:package.json`], { encoding: "utf8" }),
);
// Older tag-triggered workflows must not be reactivated by recording a release tag.
const selectedWorkflow = execFileSync(
  "git",
  ["show", `${source}:.github/workflows/release.yml`],
  { encoding: "utf8" },
);
if (selectedWorkflow !== readFileSync(".github/workflows/release.yml", "utf8"))
  throw new Error(
    "Selected source must contain the current manual release workflow",
  );
authorizeRelease({
  repository: process.env.GITHUB_REPOSITORY,
  ref: process.env.GITHUB_REF,
  actor: process.env.GITHUB_ACTOR,
  triggeringActor: process.env.GITHUB_TRIGGERING_ACTOR,
  source,
  version: pkg.version,
  channel: process.env.RELEASE_CHANNEL,
  publish: process.env.PUBLISH === "true",
  confirmation: process.env.CONFIRM_VERSION,
  enabled: process.env.RELEASE_AUTOMATION_ENABLED,
});
appendFileSync(
  process.env.GITHUB_OUTPUT,
  `source=${source}\nversion=${pkg.version}\n`,
);
