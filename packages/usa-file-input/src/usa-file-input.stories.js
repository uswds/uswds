import Component from "./usa-file-input.twig";
import TestComponent from "./test/test-patterns/test-usa-file-input.twig";
import TestComponentCustomText from "./test/test-patterns/test-usa-file-input-custom-text.twig";

import {
  DefaultContent,
  ErrorContent,
  MultipleContent,
  SpecificContent,
  WildcardContent,
} from "./content";

export default {
  title: "Components/Form Inputs/File Input",
  argTypes: {
    disabled_state: {
      name: "Disabled state",
      control: { type: "radio" },
      options: ["none", "disabled", "aria-disabled"],
    },
  },
};

const Template = (args) => Component(args);
const TestTemplate = (args) => TestComponent(args);
const TestTemplateCustomText = (args) => TestComponentCustomText(args);

export const Default = Template.bind({});
Default.args = DefaultContent;

export const Error = Template.bind({});
Error.args = ErrorContent;

export const Multiple = Template.bind({});
Multiple.args = MultipleContent;

export const Specific = Template.bind({});
Specific.args = SpecificContent;

export const Wildcard = Template.bind({});
Wildcard.args = WildcardContent;

export const Disabled = Template.bind({});
Disabled.args = {
  ...DefaultContent,
  disabled_state: "disabled",
};

export const AriaDisabled = Template.bind({});
AriaDisabled.args = {
  ...DefaultContent,
  disabled_state: "aria-disabled",
};

export const TestMultipleInputs = TestTemplate.bind({});
TestMultipleInputs.args = {
  DefaultContent,
  SpecificContent,
};

export const TestCustomText = TestTemplateCustomText.bind({});
TestCustomText.args = {
  multiple: false,
  include_plural: false,
  drag_text: "Arrastre archivo aquí o",
  drag_text_plural: "Arrastre archivos aquí o",
  choose_text: "elegir de la carpeta",
  no_file_text: "No hay archivos seleccionados",
  no_file_text_singular: "Ningún archivo seleccionado",
  change_file_text: "Cambiar archivos",
  change_file_text_singular: "Cambiar archivo",
  selected_file_text: "archivo seleccionado",
  selected_file_text_plural: "archivos seleccionados",
  error_message: "Este no es un tipo de archivo válido.",
};
