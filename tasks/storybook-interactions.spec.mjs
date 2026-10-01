import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import sinon from "sinon";

const require = createRequire(import.meta.url);
const load = (filename, dependencies) => {
  const source = readFileSync(
    new URL(`../.storybook/${filename}`, import.meta.url),
    "utf8",
  );
  const module = { exports: {} };
  vm.runInNewContext(source, {
    module,
    require: (name) => dependencies[name] ?? require(name),
    process,
    console: dependencies.console ?? console,
  });
  return module.exports;
};

const fixture = () => {
  const original = new Error("Focus escaped the modal");
  const viewport = { width: 1280, height: 720 };
  const page = {
    viewportSize: () => viewport,
    waitForFunction: sinon.stub().resolves(),
    evaluate: sinon.stub().resolves({}),
    screenshot: sinon.stub().resolves(),
    locator: () => ({ ariaSnapshot: page.ariaSnapshot }),
    ariaSnapshot: sinon.stub().resolves("dialog"),
    setViewportSize: sinon.stub().resolves(),
  };
  const fs = {
    mkdir: sinon.stub().resolves(),
    writeFile: sinon.stub().resolves(),
  };
  const run = sinon.stub().rejects(original);
  const warn = sinon.stub();
  const interaction = load("interaction-tests.js", {
    "node:fs/promises": fs,
    "./tests/focus": run,
    console: { warn },
  });
  const invoke = () =>
    interaction(
      page,
      { id: "modal-focus" },
      { suite: "focus", scenario: "hidden" },
    );
  return { original, viewport, page, fs, run, warn, interaction, invoke };
};

describe("Storybook interactions", () => {
  for (const operation of [
    "mkdir",
    "screenshot",
    "evaluate",
    "ariaSnapshot",
    "writeFile",
    "setViewportSize",
  ]) {
    it(`preserves the interaction error when ${operation} fails`, async () => {
      const test = fixture();
      const stub = test.fs[operation] ?? test.page[operation];
      if (operation === "evaluate") {
        stub.onSecondCall().rejects(new Error("Evidence unavailable"));
      } else {
        stub.rejects(new Error("Diagnostic unavailable"));
      }
      await assert.rejects(test.invoke, (error) => error === test.original);
      assert(test.warn.calledOnce);
      assert(test.page.setViewportSize.calledOnceWithExactly(test.viewport));
      if (operation === "screenshot") assert(test.fs.writeFile.calledOnce);
    });
  }

  it("records evidence and restores the viewport after an interaction failure", async () => {
    const test = fixture();
    await assert.rejects(test.invoke, (error) => error === test.original);
    const evidence = JSON.parse(test.fs.writeFile.firstCall.args[1]);
    assert.equal(evidence.error, test.original.message);
    assert.equal(evidence.story, "modal-focus");
    assert.equal(evidence.accessibility, "dialog");
    assert(test.page.setViewportSize.calledOnceWithExactly(test.viewport));
    assert(test.warn.notCalled);
  });

  it("fails viewport restoration if the interaction otherwise passed", async () => {
    const test = fixture();
    const error = new Error("Viewport unavailable");
    test.run.resolves();
    test.page.setViewportSize.rejects(error);
    await assert.rejects(test.invoke, (actual) => actual === error);
  });

  for (const optOut of [
    { a11y: { disable: true } },
    { axe: { mode: "off" } },
    { axe: { skip: true } },
  ]) {
    it(`runs configured interactions with axe opt-out ${JSON.stringify(optOut)}`, async () => {
      const test = fixture();
      const checkA11y = sinon.stub().resolves();
      const parameters = {
        ...optOut,
        uswdsTest: { suite: "invalid-negative-control" },
      };
      const runner = load("test-runner.js", {
        "@storybook/test-runner": {
          getStoryContext: async () => ({ parameters }),
        },
        "axe-playwright": { checkA11y },
        "./interaction-tests": test.interaction,
      });
      await assert.rejects(
        () => runner.postVisit(test.page, { id: "negative-control" }),
        /Unknown interaction suite: invalid-negative-control/,
      );
      parameters.uswdsTest = { suite: "focus" };
      test.run.resolves();
      await runner.postVisit(test.page, { id: "focus" });
      assert(test.run.calledOnce);
      assert(checkA11y.notCalled);
    });
  }

  it("keeps normal axe checks for stories without configured interactions", async () => {
    const test = fixture();
    const checkA11y = sinon.stub().resolves();
    const runner = load("test-runner.js", {
      "@storybook/test-runner": {
        getStoryContext: async () => ({ parameters: {} }),
      },
      "axe-playwright": { checkA11y },
      "./interaction-tests": test.interaction,
    });
    test.page.waitForTimeout = sinon.stub().resolves();
    await runner.postVisit(test.page, { id: "ordinary-story" });
    assert(test.run.notCalled);
    assert(checkA11y.calledOnce);
  });
});
