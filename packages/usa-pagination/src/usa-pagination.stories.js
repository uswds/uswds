import { expect } from "storybook/test";
import Component from "./usa-pagination.twig";
import TestComponent from "./test/test-patterns/test-pagination-all.twig";
import TestElements from "./test/test-patterns/test-pagination-elements.twig";

import {
  DefaultContent,
  UnboundedContent,
  ButtonContent,
  EsContent,
  EsUnboundedContent,
} from "./content";

export default {
  title: "Components/Pagination",
};

const Template = (args) => Component(args);
const TestTemplate = (args) => TestComponent(args);
const TestElementsTemplate = (args) => TestElements(args);

export const Default = Template.bind({});
Default.args = DefaultContent;

export const Unbounded = Template.bind({});
Unbounded.args = UnboundedContent;

// Pagination items can be authored as links or as buttons. Set
// `pagination.element` to "button" for a control that acts on the current page
// rather than navigating to a new URL.
export const Buttons = Template.bind({});
Buttons.args = ButtonContent;

export const Spanish = Template.bind({});
Spanish.args = EsContent;

export const SpanishUnbounded = Template.bind({});
SpanishUnbounded.args = EsUnboundedContent;

export const Test = TestTemplate.bind({});

// The two elements rendered together, so any styling difference between them is
// visible rather than something you have to remember.
export const TestElementComparison = TestElementsTemplate.bind({});

// Regression test for issue #5981: at 320 CSS pixels wide, which is what 400%
// browser zoom gives on a 1280px-wide window, every pagination pattern must
// fit on screen. No page control may be cut off, and the page must not scroll
// sideways (WCAG 1.4.10 Reflow). The "fullscreen" layout leaves the page
// margins to the test page's own `grid-container`, as on a real site.
export const TestSmallScreen = TestTemplate.bind({});
TestSmallScreen.globals = { viewport: { value: "mobile1", isRotated: false } };
TestSmallScreen.parameters = { layout: "fullscreen" };
TestSmallScreen.play = async ({ canvasElement, step }) => {
  const viewportWidth = document.documentElement.clientWidth;

  await step("renders at the 320px reflow width", async () => {
    expect(viewportWidth).toBe(320);
  });

  await step("every page control is fully on screen", async () => {
    const controls = canvasElement.querySelectorAll(
      ".usa-pagination__button, .usa-pagination__link",
    );
    const offScreen = [...controls]
      .map((control) => ({ control, box: control.getBoundingClientRect() }))
      // Previous and Next are hidden at this width.
      .filter(({ box }) => box.width > 0)
      .filter(({ box }) => box.left < 0 || box.right > viewportWidth)
      .map(
        ({ control, box }) =>
          `"${control.getAttribute("aria-label")}" spans ${box.left}px to ${box.right}px`,
      );
    expect(offScreen, offScreen.join("\n")).toEqual([]);
  });

  await step("the page does not scroll sideways", async () => {
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      viewportWidth,
    );
  });

  await step("the default pattern fits inside the page margins", async () => {
    // Patterns with two ellipses, such as "1 … 9 10 11 … 24" in the default
    // story, are the most common, and they have room to spare at this width.
    const defaultPatterns = [
      ...canvasElement.querySelectorAll(".usa-pagination"),
    ].filter(
      (nav) => nav.querySelectorAll(".usa-pagination__overflow").length === 2,
    );
    expect(defaultPatterns.length).toBeGreaterThan(0);

    const outside = defaultPatterns
      .map((nav) => {
        const container = nav.closest(".grid-container");
        const styles = getComputedStyle(container);
        const box = container.getBoundingClientRect();
        const left = box.left + parseFloat(styles.paddingLeft);
        const right = box.right - parseFloat(styles.paddingRight);
        const list = nav
          .querySelector(".usa-pagination__list")
          .getBoundingClientRect();
        return { nav, left, right, list };
      })
      .filter(({ left, right, list }) => list.left < left || list.right > right)
      .map(
        ({ nav, left, right, list }) =>
          `"${nav.getAttribute("aria-label")}" spans ${list.left}px to ${list.right}px, margins are ${left}px to ${right}px`,
      );
    expect(outside, outside.join("\n")).toEqual([]);
  });
};
