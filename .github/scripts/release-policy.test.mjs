import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { test } from "node:test";
import {
  authorizeRelease,
  publicationDecision,
  registryVersion,
  validateVersion,
  verifyArtifact,
} from "../../scripts/release-policy.mjs";

const source = "a".repeat(40);
const bytes = Buffer.from("verified package bytes");
const manifest = {
  name: "@uswds/uswds",
  version: "3.15.0",
  source,
  runId: "123",
  sha256: createHash("sha256").update(bytes).digest("hex"),
  integrity: `sha512-${createHash("sha512").update(bytes).digest("base64")}`,
};
const identity = { source, version: manifest.version, runId: "123" };
const authorization = {
  repository: "uswds/uswds",
  ref: "refs/heads/develop",
  actor: "ryparker",
  triggeringActor: "ryparker",
  source,
  version: "3.15.0",
  channel: "latest",
  publish: true,
  confirmation: "3.15.0",
  enabled: "true",
};

test("only approved maintainers may initiate and rerun a release", () => {
  for (const actor of ["ryparker", "samcorcos", "ethangardner", "JJediny"])
    assert.doesNotThrow(() =>
      authorizeRelease({ ...authorization, actor, triggeringActor: actor }),
    );
  for (const patch of [
    { actor: "github-actions[bot]" },
    { triggeringActor: "someone-else" },
    { actor: undefined },
  ])
    assert.throws(
      () => authorizeRelease({ ...authorization, ...patch }),
      /authorized maintainers/,
    );
});
test("publication requires the protected workflow, valid SHA, setup, and confirmation", () => {
  for (const patch of [
    { repository: "fork/uswds" },
    { ref: "refs/heads/feature" },
    { source: "develop" },
    { source: "a\n" },
    { confirmation: "3.14.0" },
    { enabled: "false" },
  ])
    assert.throws(() => authorizeRelease({ ...authorization, ...patch }));
  assert.doesNotThrow(() =>
    authorizeRelease({
      ...authorization,
      publish: false,
      enabled: undefined,
      confirmation: "",
    }),
  );
});
test("channels separate stable and prerelease packages", () => {
  assert.doesNotThrow(() => validateVersion("3.15.0-next.1", "next"));
  for (const [version, channel] of [
    ["3.15.0-next.1", "latest"],
    ["3.15.0", "next"],
    ["3.15.0", "other"],
    ["v3.15.0", "latest"],
    ["3.015.0", "latest"],
    ["3.15.0-$(evil)", "next"],
  ])
    assert.throws(() => validateVersion(version, channel));
});
test("source, version, run, and bytes must all match", () => {
  assert.doesNotThrow(() => verifyArtifact(manifest, bytes, identity));
  for (const patch of [
    { source: "b".repeat(40) },
    { version: "3.14.0" },
    { runId: "122" },
    { name: "other" },
    { sha256: "0".repeat(64) },
    { integrity: "sha512-wrong" },
  ])
    assert.throws(() =>
      verifyArtifact({ ...manifest, ...patch }, bytes, identity),
    );
  assert.throws(() =>
    verifyArtifact(manifest, Buffer.from("modified package"), identity),
  );
});
test("publishes new versions, resumes identical versions, rejects overwritten versions", () => {
  assert.equal(
    publicationDecision(manifest, null, { version: "3.14.0" }, "latest"),
    "publish",
  );
  const published = {
    name: manifest.name,
    version: manifest.version,
    dist: { integrity: manifest.integrity },
  };
  assert.equal(
    publicationDecision(manifest, published, { version: "3.16.0" }, "latest"),
    "already-published",
  );
  assert.throws(
    () =>
      publicationDecision(
        manifest,
        { ...published, dist: { integrity: "other" } },
        null,
        "latest",
      ),
    /never overwrite/,
  );
  for (const version of ["3.15.0", "3.16.0", "4.0.0"])
    assert.throws(
      () => publicationDecision(manifest, null, { version }, "latest"),
      /advance/,
    );
});
test("registry outages and malformed responses never mean a version is available", async () => {
  assert.equal(
    await registryVersion("3.15.0", async () => ({ status: 404 })),
    null,
  );
  await assert.rejects(
    registryVersion("3.15.0", async () => ({ status: 503, ok: false })),
    /lookup failed/,
  );
  await assert.rejects(
    registryVersion("3.15.0", async () => ({
      status: 200,
      ok: true,
      json: async () => ({}),
    })),
    /incomplete/,
  );
  await assert.rejects(
    registryVersion("3.15.0", async () => {
      throw new Error("network failed");
    }),
    /network failed/,
  );
});
