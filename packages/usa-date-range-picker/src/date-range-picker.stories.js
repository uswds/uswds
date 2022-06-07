import Component from "./usa-date-range-picker.twig";

export default {
  title: "Components/Form Inputs/Date Range Picker",
  argTypes: {
    defaultStart: {
      name: "Default Value: Start (YYYY-MM-DD)",
      control: { type: 'text' },
    },
    defaultEnd: {
      name: "Default Value: End (YYYY-MM-DD)",
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
  defaultStart: {
    defaultValue: "1995-03-06",
  },
  defaultEnd: {
    defaultValue: "1995-03-15",
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
  defaultStart: {
    table: { disable: true },
  },
  defaultEnd: {
    table: { disable: true },
  },
};

export const Disabled = Template.bind({});
Disabled.argTypes = {
  disabled: {
    defaultValue: 'true',
  },
  defaultStart: {
    table: { disable: true },
  },
  defaultEnd: {
    table: { disable: true },
  },
  restrictedStart: {
    table: { disable: true },
  },
  restrictedEnd: {
    table: { disable: true },
  },
};
