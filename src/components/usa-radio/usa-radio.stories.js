import "../../stylesheets/uswds.scss";
import Component from "./usa-radio.twig";
import Tile from "./usa-radio--tile.twig";

export default {
  title: "Components/Radio",
};

const Template = (args) => Component(args);
const TileTemplate = (args) => Tile(args);

export const Default = Template.bind({});
export const RadioTile = TileTemplate.bind({});
