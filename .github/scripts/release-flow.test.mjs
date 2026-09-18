import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { delimiter, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

// Exercise the real entry points with isolated commands and a network-denying
// registry/GitHub fixture. No test can publish a package or write to GitHub.
function run(script, scenario = {}, overrides = {}) {
  const directory = mkdtempSync(join(tmpdir(), "uswds-release-flow-"));
  try {
    const bytes = Buffer.from("tested package");
    const manifest = {
      name: "@uswds/uswds",
      version: "3.15.0",
      source: "a".repeat(40),
      runId: "123",
      sha256: createHash("sha256").update(bytes).digest("hex"),
      integrity: `sha512-${createHash("sha512").update(bytes).digest("base64")}`,
    };
    const artifacts = join(directory, "release-artifacts");
    const bin = join(directory, "bin");
    mkdirSync(artifacts);
    mkdirSync(bin);
    writeFileSync(join(artifacts, "manifest.json"), JSON.stringify(manifest));
    writeFileSync(
      join(artifacts, "package.tgz"),
      scenario.tampered ? "other" : bytes,
    );
    writeFileSync(join(artifacts, "notes.md"), "Release notes");
    writeFileSync(join(artifacts, "SHA256SUMS"), manifest.sha256);
    const command = `#!/usr/bin/env node
const fs = require('node:fs');
fs.appendFileSync(process.env.TEST_LOG, JSON.stringify({command: process.argv[1].split('/').pop(), args: process.argv.slice(2)}) + '\\n');
if (process.env.FAIL_UPLOAD === 'true' && process.argv[2] === 'release') process.exit(1);
`;
    for (const name of ["npm", "gh"]) {
      writeFileSync(join(bin, name), command);
      chmodSync(join(bin, name), 0o755);
    }
    const preload = join(directory, "network.mjs");
    writeFileSync(
      preload,
      `
import { appendFileSync, readFileSync } from 'node:fs';
const scenario = JSON.parse(process.env.TEST_SCENARIO);
const manifest = JSON.parse(readFileSync('release-artifacts/manifest.json'));
const published = {name: manifest.name, version: manifest.version, dist: {integrity: scenario.conflict ? 'wrong' : manifest.integrity}};
const reply = (data, status = 200) => ({status, ok: status < 400, json: async () => data, text: async () => JSON.stringify(data)});
let candidateReads = 0;
globalThis.fetch = async (url, options = {}) => {
  const method = options.method || 'GET';
  appendFileSync(process.env.TEST_LOG, JSON.stringify({url, method, body: options.body && JSON.parse(options.body)}) + '\\n');
  if (url.startsWith('https://registry.npmjs.org/@uswds%2fuswds/')) {
    if (scenario.outage) return reply({}, 503);
    if (url.endsWith('/latest')) return reply({name: manifest.name, version: '3.14.0', dist: {integrity: 'old'}});
    if (!url.endsWith('/3.15.0')) throw new Error('Unexpected registry URL');
    candidateReads++;
    if (scenario.newVersion && candidateReads === 1) return reply({}, 404);
    return reply(published);
  }
  const prefix = 'https://api.github.com/repos/uswds/uswds/';
  if (!url.startsWith(prefix)) throw new Error('Network access denied');
  const path = url.slice(prefix.length);
  if (path === 'git/ref/tags/v3.15.0' && method === 'GET') return scenario.existingTag ? reply({object: {type: 'commit', sha: scenario.wrongTag ? 'b'.repeat(40) : manifest.source}}) : reply({}, 404);
  if (path === 'git/refs' && method === 'POST') return reply({});
  if (path === 'releases/tags/v3.15.0' && method === 'GET') return scenario.existingDraft ? reply({id: 42, draft: true}) : reply({}, 404);
  if (path === 'releases' && method === 'POST') return reply({id: 42, draft: true});
  if (path === 'releases/42' && method === 'PATCH') return reply({});
  throw new Error('Unexpected GitHub request');
};
`,
    );
    const log = join(directory, "events.jsonl");
    const result = spawnSync(
      process.execPath,
      [
        "--import",
        preload,
        fileURLToPath(new URL(`../../scripts/${script}.mjs`, import.meta.url)),
      ],
      {
        cwd: directory,
        encoding: "utf8",
        env: {
          PATH: `${bin}${delimiter}${process.env.PATH}`,
          TEST_LOG: log,
          TEST_SCENARIO: JSON.stringify(scenario),
          FAIL_UPLOAD: String(Boolean(scenario.failUpload)),
          GITHUB_REPOSITORY: "uswds/uswds",
          GITHUB_REF: "refs/heads/develop",
          GITHUB_ACTOR: "ryparker",
          GITHUB_TRIGGERING_ACTOR: "ryparker",
          GITHUB_RUN_ID: manifest.runId,
          SOURCE_SHA: manifest.source,
          RELEASE_VERSION: manifest.version,
          RELEASE_CHANNEL: "latest",
          CONFIRM_VERSION: manifest.version,
          RELEASE_AUTOMATION_ENABLED: "true",
          ...overrides,
        },
      },
    );
    const events = existsSync(log)
      ? readFileSync(log, "utf8").trim().split("\n").map(JSON.parse)
      : [];
    return { ...result, events };
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test("publication sends only the tested tarball with scripts disabled and provenance enabled", () => {
  const result = run("publish-verified", { newVersion: true });
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(
    result.events.filter((event) => event.command),
    [
      {
        command: "npm",
        args: [
          "publish",
          "./release-artifacts/package.tgz",
          "--ignore-scripts",
          "--provenance",
          "--access",
          "public",
          "--tag",
          "latest",
        ],
      },
    ],
  );
});

test("publication recovery does not republish or move tags", () => {
  const result = run("publish-verified");
  assert.equal(result.status, 0, result.stderr);
  assert.equal(
    result.events.some((event) => event.command),
    false,
  );
});

test("publication refuses tampering, registry failure, and conflicting published bytes", () => {
  for (const scenario of [
    { tampered: true },
    { outage: true },
    { conflict: true },
  ]) {
    const result = run("publish-verified", scenario);
    assert.notEqual(result.status, 0);
    assert.equal(
      result.events.some((event) => event.command),
      false,
    );
  }
});

test("every writing entry point rejects unauthorized partial reruns before any side effects", () => {
  for (const script of ["publish-verified", "record-release"]) {
    const result = run(script, {}, { GITHUB_TRIGGERING_ACTOR: "someone-else" });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /authorized maintainers/);
    assert.deepEqual(result.events, []);
  }
});

test("recording creates the source tag and keeps the release draft until assets upload", () => {
  const result = run("record-release");
  assert.equal(result.status, 0, result.stderr);
  const writes = result.events.filter(
    (event) => event.command || event.method !== "GET",
  );
  assert.equal(writes[0].body.sha, "a".repeat(40));
  assert.equal(writes[1].body.draft, true);
  assert.equal(writes[2].command, "gh");
  assert.deepEqual(writes[3].body, { draft: false });
  const recovery = run("record-release", {
    existingTag: true,
    existingDraft: true,
  });
  assert.equal(recovery.status, 0, recovery.stderr);
  assert.equal(
    recovery.events.some((event) => event.method === "POST"),
    false,
  );
});

test("wrong tags and failed uploads cannot publish the GitHub release", () => {
  for (const scenario of [
    { existingTag: true, wrongTag: true },
    { failUpload: true },
  ]) {
    const result = run("record-release", scenario);
    assert.notEqual(result.status, 0);
    assert.equal(
      result.events.some((event) => event.method === "PATCH"),
      false,
    );
  }
});
