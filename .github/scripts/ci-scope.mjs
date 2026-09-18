import { execFileSync } from "node:child_process";
import { appendFileSync, readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

// Only known documentation-only changes skip the expensive browser/package job.
// Shared styles, lockfiles, fixtures, scripts, and unknown paths always run it.
export function needsFullVerification(paths) {
  return (
    paths.length === 0 ||
    paths.some(
      (path) =>
        !(
          /^[A-Z_]+\.md$/.test(path) ||
          /^docs\/.*\.md$/.test(path) ||
          /^\.github\/(?:ISSUE_TEMPLATE|DISCUSSION_TEMPLATE)\//.test(path)
        ),
    )
  );
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const event = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, "utf8"));
  let full = true;
  if (event.pull_request) {
    const base = event.pull_request.base.sha;
    if (!/^[a-f0-9]{40}$/.test(base)) throw new Error("Invalid PR base SHA");
    const paths = execFileSync(
      "git",
      ["diff", "--name-only", "-z", `${base}...HEAD`],
      { encoding: "utf8" },
    )
      .split("\0")
      .filter(Boolean);
    full = needsFullVerification(paths);
  }
  appendFileSync(process.env.GITHUB_OUTPUT, `full=${full}\n`);
}
