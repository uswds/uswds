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
const channel = process.env.RELEASE_CHANNEL;
const existing = await registryVersion(manifest.version);
const current = await registryVersion(channel);
const decision = publicationDecision(manifest, existing, current, channel);
if (decision === "publish") {
  // Install/build hooks cannot run in the OIDC-enabled publishing job.
  execFileSync(
    "npm",
    [
      "publish",
      "./release-artifacts/package.tgz",
      "--ignore-scripts",
      "--provenance",
      "--access",
      "public",
      "--tag",
      channel,
    ],
    { stdio: "inherit" },
  );
} else {
  console.log(
    "Identical artifact already published. Continuing release recovery without republishing or moving tags.",
  );
}
let verified = false;
for (let attempt = 0; attempt < 6; attempt += 1) {
  const published = await registryVersion(manifest.version);
  if (published) {
    publicationDecision(manifest, published, null, channel);
    verified = true;
    break;
  }
  await new Promise((done) => setTimeout(done, 10000));
}
if (!verified)
  throw new Error(
    "Published version was not visible in the registry; retry failed jobs in this run",
  );
