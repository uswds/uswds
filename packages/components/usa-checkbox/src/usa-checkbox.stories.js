import Component from "./usa-checkbox.twig";
import Tile from "./usa-checkbox--tile.twig";
import Test from "./usa-checkbox--test.twig";

export default {
  title: "Components/Form Inputs/Checkbox",
};

const Template = (args) => Component(args);
const TileTemplate = (args) => Tile(args);
const TestTemplate = (args) => Test(args);

export const Default = Template.bind({});
export const CheckboxTile = TileTemplate.bind({});
export const CheckboxTest = TestTemplate.bind({});
