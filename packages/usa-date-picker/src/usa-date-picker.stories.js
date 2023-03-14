import Component from "./usa-date-picker.twig";

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
};

const Template = (args) => Component(args);

export const Default = Template.bind({});

export const DefaultDate = Template.bind({});
DefaultDate.argTypes = {
  defaultDate: {
    defaultValue: "1995-03-06",
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

export const RangeDate = Template.bind({});
RangeDate.argTypes = {
  rangeDate: {
    defaultValue: "2022-01-07",
  },
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
RestrictedDate.argTypes = {
  restrictedDateStart: {
    defaultValue: "1995-03-06",
  },
  restrictedDateEnd: {
    defaultValue: "1995-03-15",
  },
  defaultDate: {
    table: { disable: true },
  },
  rangeDate: {
    table: { disable: true },
  },
};

export const Disabled = Template.bind({});
Disabled.argTypes = {
  disabled_state: {
    defaultValue: "disabled",
  },
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
AriaDisabled.argTypes = {
  disabled_state: {
    defaultValue: "aria-disabled",
  },
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
