import { expect } from "storybook/test";
import Component from "./usa-checkbox.twig";
import TileComponent from "./usa-checkbox--tile.twig";
import TestComponent from "./test/test-patterns/test-usa-checkbox.twig";

export default {
  title: "Components/Form Inputs/Checkbox",
  args: {
    disabled_state: "none",
    indeterminate_state: false,
  },
  argTypes: {
    disabled_state: {
      name: "Disabled state",
      control: { type: "radio" },
      options: ["none", "disabled", "aria-disabled"],
    },
    indeterminate_state: {
      name: "Toggle indeterminate state",
      control: { type: "boolean" },
    },
  },
};

const Template = (args) => Component(args);
const TileTemplate = (args) => TileComponent(args);
const TestTemplate = (args) => TestComponent(args);

// Indeterminate styling must obscure both checked and unchecked states.
const testIndeterminateStyles = async ({ canvasElement, step }) => {
  const inputs = canvasElement.querySelectorAll(".usa-checkbox__input");
  const initialStates = Array.from(inputs, (input) => ({
    checked: input.checked,
    indeterminate: input.indeterminate,
    dataIndeterminate: input.getAttribute("data-indeterminate"),
  }));

  try {
    for (const stateSource of ["property", "attribute"]) {
      for (const checked of [false, true]) {
        await step(`${stateSource}, checked=${checked}`, async () => {
          inputs.forEach((input) => {
            input.checked = checked;
            input.indeterminate = stateSource === "property";
            input.toggleAttribute(
              "data-indeterminate",
              stateSource === "attribute",
            );
            const label = input.nextElementSibling;
            expect(
              getComputedStyle(label, "::before").backgroundImage,
            ).toContain("checkbox-indeterminate");
            expect(input.checked).toBe(checked);

            input.indeterminate = false;
            input.removeAttribute("data-indeterminate");
            const image = getComputedStyle(label, "::before").backgroundImage;
            if (checked) {
              expect(image).toContain("correct8");
            } else {
              expect(image).toBe("none");
            }
          });
        });
      }
    }
  } finally {
    inputs.forEach((input, index) => {
      input.checked = initialStates[index].checked;
      input.indeterminate = initialStates[index].indeterminate;
      const { dataIndeterminate } = initialStates[index];
      if (dataIndeterminate === null) {
        input.removeAttribute("data-indeterminate");
      } else {
        input.setAttribute("data-indeterminate", dataIndeterminate);
      }
    });
  }
};

export const Default = Template.bind({});
Default.play = testIndeterminateStyles;

export const Disabled = Template.bind({});
Disabled.args = {
  disabled_state: "disabled",
};
Disabled.play = testIndeterminateStyles;

export const AriaDisabled = Template.bind({});
AriaDisabled.args = {
  disabled_state: "aria-disabled",
};
AriaDisabled.play = testIndeterminateStyles;

export const Tile = TileTemplate.bind({});
Tile.play = testIndeterminateStyles;

export const DisabledTile = TileTemplate.bind({});
DisabledTile.args = {
  disabled_state: "disabled",
};
DisabledTile.play = testIndeterminateStyles;

export const AriaDisabledTile = TileTemplate.bind({});
AriaDisabledTile.args = {
  disabled_state: "aria-disabled",
};
AriaDisabledTile.play = testIndeterminateStyles;

export const Test = TestTemplate.bind({});
Test.argTypes = {
  disabled_state: {
    table: { disable: true },
  },
  indeterminate_state: {
    table: { disable: true },
  },
};

export const Indeterminate = Template.bind({});
Indeterminate.args = {
  indeterminate_state: true,
};
Indeterminate.argTypes = {
  indeterminate_state: {
    table: { disable: true },
  },
};

export const IndeterminateTile = TileTemplate.bind({});
IndeterminateTile.args = {
  indeterminate_state: true,
};
IndeterminateTile.argTypes = {
  indeterminate_state: {
    table: { disable: true },
  },
};
