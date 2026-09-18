import { createHash } from "node:crypto";

export const releasers = ["ryparker", "samcorcos", "ethangardner", "JJediny"];

export function validateVersion(version, channel) {
  const match =
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-(next|alpha|beta|rc)\.(0|[1-9]\d*))?$/.exec(
      version,
    );
  if (!match || !["latest", "next"].includes(channel))
    throw new Error("Invalid release version or channel");
  if ((channel === "next") !== Boolean(match[4]))
    throw new Error("Prereleases require next; stable versions require latest");
  return match.slice(1, 4).map(Number);
}

export function authorizeRelease({
  repository,
  ref,
  actor,
  triggeringActor,
  source,
  version,
  channel,
  publish,
  confirmation,
  enabled,
}) {
  if (repository !== "uswds/uswds" || ref !== "refs/heads/develop")
    throw new Error("Release workflow must run from uswds/uswds develop");
  if (![actor, triggeringActor].every((user) => releasers.includes(user)))
    throw new Error(
      "Only the four authorized maintainers may initiate or rerun releases",
    );
  if (!/^[a-f0-9]{40}$/.test(source))
    throw new Error("Select a full commit SHA");
  validateVersion(version, channel);
  if (publish && (enabled !== "true" || confirmation !== version))
    throw new Error(
      "Publishing requires completed setup and exact version confirmation",
    );
}

export function authorizePublication(environment = process.env) {
  // Recheck in every writing job, including when only failed jobs are rerun.
  authorizeRelease({
    repository: environment.GITHUB_REPOSITORY,
    ref: environment.GITHUB_REF,
    actor: environment.GITHUB_ACTOR,
    triggeringActor: environment.GITHUB_TRIGGERING_ACTOR,
    source: environment.SOURCE_SHA,
    version: environment.RELEASE_VERSION,
    channel: environment.RELEASE_CHANNEL,
    publish: true,
    confirmation: environment.CONFIRM_VERSION,
    enabled: environment.RELEASE_AUTOMATION_ENABLED,
  });
}

export function verifyArtifact(manifest, bytes, { source, version, runId }) {
  if (
    manifest.name !== "@uswds/uswds" ||
    manifest.source !== source ||
    manifest.version !== version ||
    manifest.runId !== runId
  )
    throw new Error(
      "Artifact identity does not match the verified release run",
    );
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  const integrity = `sha512-${createHash("sha512").update(bytes).digest("base64")}`;
  if (sha256 !== manifest.sha256 || integrity !== manifest.integrity)
    throw new Error("Artifact bytes do not match the release manifest");
}

export function publicationDecision(manifest, existing, current, channel) {
  const next = validateVersion(manifest.version, channel);
  if (existing) {
    if (
      existing.name !== manifest.name ||
      existing.version !== manifest.version ||
      existing.dist?.integrity !== manifest.integrity
    )
      throw new Error(
        "Published version differs from the tested artifact; never overwrite it",
      );
    return "already-published";
  }
  if (current && channel === "latest") {
    const previous = validateVersion(current.version, "latest");
    const firstDifference = next.findIndex(
      (number, i) => number !== previous[i],
    );
    if (
      firstDifference === -1 ||
      next[firstDifference] < previous[firstDifference]
    )
      throw new Error("A stable release must advance the latest version");
  }
  return "publish";
}

export async function registryVersion(version, fetcher = fetch) {
  const response = await fetcher(
    `https://registry.npmjs.org/@uswds%2fuswds/${encodeURIComponent(version)}`,
  );
  if (response.status === 404) return null;
  if (!response.ok)
    throw new Error(`Registry lookup failed (${response.status})`);
  const data = await response.json();
  if (
    data.name !== "@uswds/uswds" ||
    typeof data.version !== "string" ||
    typeof data.dist?.integrity !== "string"
  )
    throw new Error("Registry returned an incomplete package record");
  return data;
}
