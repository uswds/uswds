import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const severities = ["info", "low", "moderate", "high", "critical"];

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

/**
 * Validate npm's v2 audit report before applying the release policy.
 * Call npm with --audit-level=info so exit 1 means any reported vulnerability.
 * An unsuccessful or inconsistent scan must never become a clean result.
 */
export function verifyNpmAudit(source, exitCode, policy) {
  if (!["production", "development"].includes(policy)) {
    throw new Error("Audit policy must be production or development.");
  }

  if (exitCode !== 0 && exitCode !== 1) {
    throw new Error(
      `npm audit did not complete successfully (exit ${exitCode}).`,
    );
  }

  let report;
  try {
    report = JSON.parse(source);
  } catch {
    throw new Error("npm audit returned empty or malformed JSON.");
  }

  if (
    !isObject(report) ||
    Object.hasOwn(report, "error") ||
    report.auditReportVersion !== 2 ||
    !isObject(report.metadata?.vulnerabilities) ||
    !isObject(report.vulnerabilities)
  ) {
    throw new Error("npm audit returned an error or an unsupported report.");
  }

  const counts = report.metadata.vulnerabilities;
  for (const severity of [...severities, "total"]) {
    if (!Number.isSafeInteger(counts[severity]) || counts[severity] < 0) {
      throw new Error(
        `npm audit has an invalid ${severity} vulnerability count.`,
      );
    }
  }

  const actual = Object.fromEntries(
    severities.map((severity) => [severity, 0]),
  );
  for (const vulnerability of Object.values(report.vulnerabilities)) {
    if (
      !isObject(vulnerability) ||
      !severities.includes(vulnerability.severity)
    ) {
      throw new Error("npm audit contains an invalid vulnerability entry.");
    }
    actual[vulnerability.severity] += 1;
  }

  if (
    severities.some((severity) => counts[severity] !== actual[severity]) ||
    counts.total !==
      severities.reduce((sum, severity) => sum + counts[severity], 0)
  ) {
    throw new Error("npm audit vulnerability entries and counts disagree.");
  }

  if (exitCode !== (counts.total > 0 ? 1 : 0)) {
    throw new Error("npm audit exit status and vulnerability counts disagree.");
  }

  if (policy === "production" && counts.high + counts.critical > 0) {
    throw new Error(
      `Production dependencies have ${counts.high + counts.critical} high/critical vulnerabilities; release is blocked.`,
    );
  }
  if (policy === "development" && counts.critical > 0) {
    throw new Error(
      `Development dependencies have ${counts.critical} critical vulnerabilities.`,
    );
  }

  return Object.fromEntries(
    [...severities, "total"].map((severity) => [severity, counts[severity]]),
  );
}

// Keep stdout machine-readable; workflows consume only successfully verified counts.
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  try {
    const [reportPath, status, policy, ...extra] = process.argv.slice(2);
    if (!reportPath || !/^(0|[1-9]\d*)$/.test(status) || extra.length > 0) {
      throw new Error(
        "Usage: node verify-npm-audit.mjs <report.json> <npm-exit-code> <production|development>",
      );
    }
    const counts = verifyNpmAudit(
      readFileSync(reportPath, "utf8"),
      Number(status),
      policy,
    );
    console.log(JSON.stringify(counts));
  } catch (error) {
    console.error(`npm audit verification failed: ${error.message}`);
    process.exitCode = 1;
  }
}
