import Component from "./usa-validation.twig";
import TextareaComponent from "./usa-validation--textarea.twig";

export default {
  title: "Components/Validation",
};

const Template = (args) => Component(args);
const TextareaTemplate = (args) => TextareaComponent(args);

export const InputValidation = Template.bind({});
export const TextareaValidation = TextareaTemplate.bind({});
