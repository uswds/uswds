import component from "./usa-site-title.twig";
import Data from "./usa-site-title.yml";

export default {
  title: "Components/Site Title"
}

const Template = (args) => component(args);

export const Default = Template.bind(Data);
Default.args = Data;
