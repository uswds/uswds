// Import page template elements
import { DefaultContent as BannerData } from "../../components/usa-banner/content";
import * as TitleData from "../../components/usa-site-title/usa-site-title.json";
import { headerData as HeaderData } from "../../components/usa-header/content";
import { LevelThreeData as SidenavData } from "../../components/usa-sidenav/content";
import { Data as IdentifierData } from "../../components/usa-identifier/content";
import { Data as FooterData } from "../../components/usa-footer/content";

// Import page content
import Component from "./usa-docs.twig";

export default {
  title: "Pages/Documentation",
  args: {
    ...TitleData,
    ...HeaderData, 
    ...FooterData,
    ...SidenavData, 
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export const DocumentationPage = (args) => Component({ 
  ...args,
  ...BannerData, 
  ...IdentifierData, 
  ...FooterData, 
});
  