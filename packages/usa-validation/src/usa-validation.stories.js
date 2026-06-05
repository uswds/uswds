import Component from "./usa-validation.twig";
import TextareaComponent from "./usa-validation--textarea.twig";
import validator from "./index";

export default {
  title: "Components/Validation",
  decorators: [
    (Story) => {
      validator.off?.();

      const story = Story();

      window.requestAnimationFrame(() => {
        validator.on?.();
      });

      return story;
    },
  ],
};

const Template = (args) => Component(args);
const TextareaTemplate = (args) => TextareaComponent(args);

export const InputValidation = Template.bind({});
export const TextareaValidation = TextareaTemplate.bind({});
