import Component from "./usa-date-picker.twig";

export default {
  title: "Components/Form Inputs/Date Picker",
  argTypes: {
    defaultValue: {
      name: "Default Value (YYYY-MM-DD)",
      control: { type: 'text' },
    },
    rangeDate: {
      name: "Range Date (YYYY-MM-DD)",
      control: { type: 'text' },
    },
    restrictedStart: {
      name: "Restricted Date: Start (YYYY-MM-DD)",
      control: { type: 'text' },
    },
    restrictedEnd: {
      name: "Restricted Date: End (YYYY-MM-DD)",
      control: { type: 'text' },
    },
    disabled: {
      name: "Disabled",
      defaultValue: 'false',
      control: { type: 'boolean' },
    },
  },
};

const Template = (args) => Component(args);

export const Default = Template.bind({});

export const DefaultValue = Template.bind({});
DefaultValue.argTypes = {
  defaultValue: {
    defaultValue: "1995-03-06",
  },
  rangeDate: {
    table: { disable: true },
  },
  restrictedStart: {
    table: { disable: true },
  },
  restrictedEnd: {
    table: { disable: true },
  },
};

export const RangeDate = Template.bind({});
RangeDate.argTypes = {
  rangeDate: {
    defaultValue: "2022-01-07",
  },
  defaultValue: {
    table: { disable: true },
  },
  restrictedStart: {
    table: { disable: true },
  },
  restrictedEnd: {
    table: { disable: true },
  },
};

export const RestrictedDate = Template.bind({});
RestrictedDate.argTypes = {
  restrictedStart: {
    defaultValue: "1995-03-06",
  },
  restrictedEnd: {
    defaultValue: "1995-03-15",
  },
  defaultValue: {
    table: { disable: true },
  },
  rangeDate: {
    table: { disable: true },
  },
};

export const Disabled = Template.bind({});
Disabled.argTypes = {
  disabled: {
    defaultValue: 'true',
  },
  defaultValue: {
    table: { disable: true },
  },
  rangeDate: {
    table: { disable: true },
  },
  restrictedStart: {
    table: { disable: true },
  },
  restrictedEnd: {
    table: { disable: true },
  },
};
