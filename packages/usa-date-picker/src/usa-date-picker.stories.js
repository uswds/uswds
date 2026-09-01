import Component from "./usa-date-picker.twig";
import datePicker from "./index";

export default {
  title: "Components/Form Inputs/Date Picker",
  argTypes: {
    defaultDate: {
      name: "Default Date (YYYY-MM-DD)",
      control: { type: "text" },
    },
    rangeDate: {
      name: "Range Date (YYYY-MM-DD)",
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
  defaultDate: "1995-03-06",
};
DefaultDate.argTypes = {
  rangeDate: {
    table: { disable: true },
  },
  restrictedDateStart: {
    table: { disable: true },
  },
  restrictedDateEnd: {
    table: { disable: true },
  },
};

export const RangeDate = Template.bind({});
RangeDate.args = {
  rangeDate: "2022-01-07",
};
RangeDate.argTypes = {
  defaultDate: {
    table: { disable: true },
  },
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
  defaultDate: {
    table: { disable: true },
  },
  rangeDate: {
    table: { disable: true },
  },
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled_state: "disabled",
};
Disabled.argTypes = {
  defaultDate: {
    table: { disable: true },
  },
  rangeDate: {
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
  defaultDate: {
    table: { disable: true },
  },
  rangeDate: {
    table: { disable: true },
  },
  restrictedDateStart: {
    table: { disable: true },
  },
  restrictedDateEnd: {
    table: { disable: true },
  },
};
