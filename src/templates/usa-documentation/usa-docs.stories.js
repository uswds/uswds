import Component from "./usa-docs.twig";

import { LevelTwoData } from "../../components/usa-sidenav/content";

export default {
  title: "Templates/Documentation Page",
  args: {
      sidenav: {
        ...LevelTwoData,
      }
  }
};

export const DocumentationPage = () => Component({ ...LevelTwoData });
