import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { verifyNpmAudit } from "../scripts/verify-npm-audit.mjs";

function auditReport(severities = []) {
  const counts = {
    info: 0,
    low: 0,
    moderate: 0,
    high: 0,
    critical: 0,
    total: 0,
  };
  const vulnerabilities = {};
  severities.forEach((severity, index) => {
    counts[severity] += 1;
    counts.total += 1;
    vulnerabilities[`package-${index}`] = { severity };
  });
  return {
    auditReportVersion: 2,
    vulnerabilities,
    metadata: { vulnerabilities: counts },
  };
}

describe("release npm audit verification", () => {
  for (const policy of ["production", "development"]) {
    it(`accepts a successful clean ${policy} scan`, () => {
      const report = auditReport();
      assert.deepEqual(
        verifyNpmAudit(JSON.stringify(report), 0, policy),
        report.metadata.vulnerabilities,
      );
    });

    it(`rejects a registry failure under the ${policy} policy`, () => {
      assert.throws(
        () =>
          verifyNpmAudit(
            JSON.stringify({ error: { code: "ENOTFOUND" } }),
            1,
            policy,
          ),
        /error or an unsupported report/,
      );
    });
  }

  it("allows noncritical development findings and preserves release-note counts", () => {
    const report = auditReport(["info", "low", "moderate", "high"]);
    assert.deepEqual(
      verifyNpmAudit(JSON.stringify(report), 1, "development"),
      report.metadata.vulnerabilities,
    );
  });

  for (const severity of ["info", "low", "moderate", "high", "critical"]) {
    it(`blocks ${severity} findings in production`, () => {
      assert.throws(
        () =>
          verifyNpmAudit(
            JSON.stringify(auditReport([severity])),
            1,
            "production",
          ),
        /none are allowed/,
      );
    });
  }

  it("blocks critical findings in development", () => {
    assert.throws(
      () =>
        verifyNpmAudit(
          JSON.stringify(auditReport(["critical"])),
          1,
          "development",
        ),
      /critical vulnerabilities/,
    );
  });

  for (const source of ["", "   ", "not JSON", '{"metadata":']) {
    it(`rejects empty or malformed output ${JSON.stringify(source)}`, () => {
      assert.throws(
        () => verifyNpmAudit(source, 1, "production"),
        /empty or malformed/,
      );
    });
  }

  for (const report of [
    null,
    [],
    {},
    { auditReportVersion: 1 },
    { ...auditReport(), error: null },
  ]) {
    it(`rejects an unsupported or error response ${JSON.stringify(report)}`, () => {
      assert.throws(
        () => verifyNpmAudit(JSON.stringify(report), 0, "production"),
        /error or an unsupported report/,
      );
    });
  }

  for (const count of [
    undefined,
    null,
    "0",
    -1,
    0.5,
    Number.MAX_SAFE_INTEGER + 1,
  ]) {
    it(`rejects invalid metadata counts: ${String(count)}`, () => {
      const report = auditReport();
      report.metadata.vulnerabilities.critical = count;
      assert.throws(
        () => verifyNpmAudit(JSON.stringify(report), 0, "production"),
        /invalid critical vulnerability count/,
      );
    });
  }

  it("rejects entries concealed by zero metadata counts", () => {
    const report = auditReport();
    report.vulnerabilities.hidden = { severity: "critical" };
    assert.throws(
      () => verifyNpmAudit(JSON.stringify(report), 0, "production"),
      /entries and counts disagree/,
    );
  });

  it("rejects an inconsistent total", () => {
    const report = auditReport(["high"]);
    report.metadata.vulnerabilities.total = 0;
    assert.throws(
      () => verifyNpmAudit(JSON.stringify(report), 1, "development"),
      /entries and counts disagree/,
    );
  });

  it("rejects an invalid vulnerability entry", () => {
    const report = auditReport(["high"]);
    report.vulnerabilities["package-0"].severity = "unknown";
    assert.throws(
      () => verifyNpmAudit(JSON.stringify(report), 1, "development"),
      /invalid vulnerability entry/,
    );
  });

  for (const [report, status] of [
    [auditReport(), 1],
    [auditReport(["high"]), 0],
  ]) {
    it(`rejects status ${status} that disagrees with report counts`, () => {
      assert.throws(
        () => verifyNpmAudit(JSON.stringify(report), status, "development"),
        /exit status and vulnerability counts disagree/,
      );
    });
  }

  for (const status of [2, 127, null]) {
    it(`rejects an unsuccessful audit exit ${status} even with clean JSON`, () => {
      assert.throws(
        () =>
          verifyNpmAudit(JSON.stringify(auditReport()), status, "production"),
        /did not complete successfully/,
      );
    });
  }

  it("runs by absolute path from the clean-room directory without package dependencies", () => {
    const cwd = mkdtempSync(join(tmpdir(), "uswds-audit-verifier-"));
    try {
      const reportPath = join(cwd, "audit.json");
      const verifier = fileURLToPath(
        new URL("../scripts/verify-npm-audit.mjs", import.meta.url),
      );
      writeFileSync(reportPath, JSON.stringify(auditReport()));
      const success = spawnSync(
        process.execPath,
        [verifier, reportPath, "0", "production"],
        { cwd, encoding: "utf8" },
      );
      assert.equal(success.status, 0, success.stderr);
      assert.equal(JSON.parse(success.stdout).total, 0);

      writeFileSync(
        reportPath,
        JSON.stringify({ error: { code: "ENOTFOUND" } }),
      );
      const failure = spawnSync(
        process.execPath,
        [verifier, reportPath, "1", "production"],
        { cwd, encoding: "utf8" },
      );
      assert.equal(failure.status, 1);
      assert.equal(failure.stdout, "");
      assert.match(failure.stderr, /npm audit verification failed/);
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });
});
