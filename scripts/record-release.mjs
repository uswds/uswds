import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import {
  authorizePublication,
  publicationDecision,
  registryVersion,
  verifyArtifact,
} from "./release-policy.mjs";

authorizePublication();
const manifest = JSON.parse(
  readFileSync("release-artifacts/manifest.json", "utf8"),
);
verifyArtifact(manifest, readFileSync("release-artifacts/package.tgz"), {
  source: process.env.SOURCE_SHA,
  version: process.env.RELEASE_VERSION,
  runId: process.env.GITHUB_RUN_ID,
});
const published = await registryVersion(manifest.version);
if (!published) throw new Error("Cannot record an unpublished release");
publicationDecision(manifest, published, null, process.env.RELEASE_CHANNEL);
const tag = `v${manifest.version}`;
const repository = process.env.GITHUB_REPOSITORY;
if (repository !== "uswds/uswds")
  throw new Error("Unexpected release repository");
async function api(path, method = "GET", body) {
  const response = await fetch(
    `https://api.github.com/repos/${repository}/${path}`,
    {
      method,
      headers: {
        Authorization: `Bearer ${process.env.GH_TOKEN}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: body && JSON.stringify(body),
    },
  );
  if (method === "GET" && response.status === 404) return null;
  if (!response.ok)
    throw new Error(
      `GitHub release request failed (${response.status}): ${await response.text()}`,
    );
  return response.json();
}
const existing = await api(`git/ref/tags/${tag}`);
if (existing) {
  let object = existing.object;
  for (let depth = 0; object.type === "tag" && depth < 5; depth += 1)
    object = (await api(`git/tags/${object.sha}`)).object;
  if (object.type !== "commit" || object.sha !== manifest.source)
    throw new Error("Existing release tag points to different source");
} else {
  await api("git/refs", "POST", {
    ref: `refs/tags/${tag}`,
    sha: manifest.source,
  });
}
let release = await api(`releases/tags/${tag}`);
if (!release)
  release = await api("releases", "POST", {
    tag_name: tag,
    target_commitish: manifest.source,
    name: `USWDS ${manifest.version}`,
    body: readFileSync("release-artifacts/notes.md", "utf8"),
    draft: true,
    prerelease: process.env.RELEASE_CHANNEL === "next",
  });
execFileSync(
  "gh",
  [
    "release",
    "upload",
    tag,
    "release-artifacts/package.tgz",
    "release-artifacts/manifest.json",
    "release-artifacts/SHA256SUMS",
    "--repo",
    repository,
    "--clobber",
  ],
  { stdio: "inherit" },
);
if (release.draft)
  await api(`releases/${release.id}`, "PATCH", { draft: false });
console.log(release.html_url);
