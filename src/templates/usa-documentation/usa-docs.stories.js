import Component from "./usa-docs.twig";

import { DefaultContent as BannerData } from "../../components/usa-banner/content";
import { headerData as HeaderData } from "../../components/usa-header/content";
import { LevelTwoData as SidenavData } from "../../components/usa-sidenav/content";
import { Data as IdentifierData } from "../../components/usa-identifier/content";
import { Data as FooterData } from "../../components/usa-footer/content";

export default {
  title: "Pages/Documentation",
  parameters: {
    layout: 'fullscreen',
  },
};

export const DocumentationPage = () => Component({ 
    ...BannerData, 
    ...HeaderData, 
    ...SidenavData, 
    ...IdentifierData, 
    ...FooterData, 
  });
  