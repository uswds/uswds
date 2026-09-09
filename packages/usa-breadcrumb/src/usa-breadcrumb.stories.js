import { expect } from "storybook/test";
import Component from "./usa-breadcrumb.twig";
import { DefaultContent, TruncateContent } from "./content";

export default {
  title: "Components/Breadcrumb",
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = DefaultContent;
// Regression test for issue #6689: by default the breadcrumb must wrap to
// additional lines so no text is lost — it must never truncate the trail to a
// single clipped line.
Default.play = async ({ canvasElement, step }) => {
  const list = canvasElement.querySelector(".usa-breadcrumb__list");
  const styles = getComputedStyle(list);
  await step("default breadcrumb wraps instead of truncating", async () => {
    expect(styles.whiteSpace).not.toBe("nowrap");
    expect(styles.overflow).not.toBe("hidden");
    expect(styles.textOverflow).not.toBe("ellipsis");
  });
};

export const Truncate = Template.bind({});
Truncate.args = TruncateContent;
// The opt-in `.usa-breadcrumb--truncate` variant keeps the legacy single-line,
// ellipsis-clipped behavior for teams that explicitly want it.
Truncate.play = async ({ canvasElement, step }) => {
  const list = canvasElement.querySelector(".usa-breadcrumb__list");
  const styles = getComputedStyle(list);
  await step("truncate variant clips the trail to a single line", async () => {
    expect(styles.whiteSpace).toBe("nowrap");
    expect(styles.textOverflow).toBe("ellipsis");
    expect(styles.overflow).toBe("hidden");
  });
};
