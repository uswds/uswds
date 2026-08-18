import Component from "./usa-date-range-picker.twig";
import datePicker from "../../usa-date-picker/src/index";

export default {
  title: "Components/Form Inputs/Date Range Picker",
  argTypes: {
    defaultDateStart: {
      name: "Default Date: Start (YYYY-MM-DD)",
      control: { type: "text" },
    },
    defaultDateEnd: {
      name: "Default Date: End (YYYY-MM-DD)",
      control: { type: "text" },
    },
    restrictedDateStart: {
      name: "Restricted Date: Start (YYYY-MM-DD)",
      control: { type: "text" },
    },
    restrictedDateEnd: {
      name: "Restricted Date: End (YYYY-MM-DD)",
      control: { type: "text" },
    },
    disabled_state: {
      name: "Disabled state",
      control: { type: "radio" },
      options: ["none", "disabled", "aria-disabled"],
    },
  },
  decorators: [
    (Story) => {
      datePicker.off?.();

      const story = Story();

      window.requestAnimationFrame(() => {
        datePicker.on();
      });

      return story;
    },
  ],
};

const Template = (args) => Component(args);

export const Default = Template.bind({});

export const DefaultDate = Template.bind({});
DefaultDate.args = {
  defaultDateStart: "1995-03-06",
  defaultDateEnd: "1995-03-15",
};
DefaultDate.argTypes = {
  restrictedDateStart: {
    table: { disable: true },
  },
  restrictedDateEnd: {
    table: { disable: true },
  },
};

export const RestrictedDate = Template.bind({});
RestrictedDate.args = {
  restrictedDateStart: "1995-03-06",
  restrictedDateEnd: "1995-03-15",
};
RestrictedDate.argTypes = {
  defaultDateStart: {
    table: { disable: true },
  },
  defaultDateEnd: {
    table: { disable: true },
  },
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled_state: "disabled",
};
Disabled.argTypes = {
  defaultDateStart: {
    table: { disable: true },
  },
  defaultDateEnd: {
    table: { disable: true },
  },
  restrictedDateStart: {
    table: { disable: true },
  },
  restrictedDateEnd: {
    table: { disable: true },
  },
};

export const AriaDisabled = Template.bind({});
AriaDisabled.args = {
  disabled_state: "aria-disabled",
};
AriaDisabled.argTypes = {
  defaultDateStart: {
    table: { disable: true },
  },
  defaultDateEnd: {
    table: { disable: true },
  },
  restrictedDateStart: {
    table: { disable: true },
  },
  restrictedDateEnd: {
    table: { disable: true },
  },
};
