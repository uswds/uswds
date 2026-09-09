import Component from "./usa-range.twig";
import range from "./index";

export default {
  title: "Components/Form Inputs/Range",
  args: {
    min: 0,
    max: 100,
    step: 10,
  },
  argTypes: {
    disabled_state: {
      name: "Disabled state",
      control: { type: "radio" },
      options: ["none", "disabled", "aria-disabled"],
    },
    text_unit: {
      name: "Unit",
      control: { type: "text" },
    },
    text_preposition: {
      name: "Preposition (of, for, in, de, etc.)",
      control: { type: "text" },
    },
    min: {
      name: "Min",
      control: { type: "number" },
    },
    max: {
      name: "Max",
      control: { type: "number" },
    },
    step: {
      name: "Step",
      control: { type: "number" },
    },
  },
  decorators: [
    (Story) => {
      range.off?.();

      const story = Story();

      window.requestAnimationFrame(() => {
        range.on();
      });

      return story;
    },
  ],
};

const Template = (args) => Component(args);

export const Range = Template.bind({});
Range.args = {
  text_unit: "",
  text_preposition: "",
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled_state: "disabled",
};

export const AriaDisabled = Template.bind({});
AriaDisabled.args = {
  disabled_state: "aria-disabled",
};
