import Component from "./usa-checkbox.twig";
import Tile from "./usa-checkbox--tile.twig";
import TestComponent from "./test/test-patterns/test-usa-multi-column-checkboxes.twig";
import TestComponentMultiple from "./test/test-patterns/test-usa-checkbox.twig";

export default {
  title: "Components/Form Inputs/Checkbox",
};

const Template = (args) => Component(args);
const TileTemplate = (args) => Tile(args);
const TestTemplate = (args) => TestComponent(args);
const TestTemplateMultiple = (args) => TestComponentMultiple(args);

export const Default = Template.bind({});
export const CheckboxTile = TileTemplate.bind({});
export const TestMultipleColumns = TestTemplate.bind({});
export const TestMultipleFieldsets = TestTemplateMultiple.bind({});
