// Import page template elements
import { DefaultContent as BannerData } from "../../components/usa-banner/content";
import * as TitleData from "../../components/usa-site-title/usa-site-title.json";
import { headerData as HeaderData } from "../../components/usa-header/content";
import { LevelTwoData as SidenavData } from "../../components/usa-sidenav/content";
import { Data as IdentifierData } from "../../components/usa-identifier/content";
import { Data as FooterData } from "../../components/usa-footer/content";

// Import page content
import Component from "./usa-landing.twig";

export default {
  title: "Patterns/Page Patterns/Landing",
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

export const LandingPage = (args) => Component({ 
  ...args,
  ...BannerData, 
  ...IdentifierData, 
  ...FooterData, 
});
  