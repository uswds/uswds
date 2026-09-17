import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const titlePattern =
  /^(feat|fix|docs|test|ci|build|chore|refactor|perf|style|revert)(\([a-z0-9][a-z0-9._/-]*\))?!?: \S(?:[^\r\n]*\S)?$/u;

export function isValidTitle(title) {
  return (
    typeof title === "string" &&
    !/[\u0000-\u001f\u007f\u2028\u2029]/u.test(title) &&
    titlePattern.test(title)
  );
}

export function checkEvent(event) {
  if (!isValidTitle(event?.pull_request?.title)) {
    throw new Error(
      "Use type(scope): description, with an optional scope and ! before the colon for breaking changes. " +
        "Allowed types: feat, fix, docs, test, ci, build, chore, refactor, perf, style, revert. " +
        "Use a lowercase scope, one space after the colon, and a nonempty single-line description without surrounding whitespace. " +
        "See CONTRIBUTING.md#pull-request-titles.",
    );
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  try {
    // Read metadata as JSON, never interpolate the contributor's title into shell code.
    checkEvent(JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, "utf8")));
    console.log("PR title follows the conventional title format.");
  } catch {
    // Keep untrusted title and event contents out of workflow-command output.
    console.error(
      "::error::Invalid PR title or unreadable PR event. Use type(scope): description. " +
        "See CONTRIBUTING.md#pull-request-titles for allowed types, scopes, and breaking changes.",
    );
    process.exitCode = 1;
  }
}
