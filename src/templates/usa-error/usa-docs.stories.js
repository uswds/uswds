import Component from "./usa-error.twig";

import { DefaultContent as BannerData } from "../../components/usa-banner/content";
import { headerData as HeaderData } from "../../components/usa-header/content";
import { LevelTwoData as SidenavData } from "../../components/usa-sidenav/content";
import { Data as IdentifierData } from "../../components/usa-identifier/content";
import { Data as FooterData } from "../../components/usa-footer/content";
import { Data, EsData } from "./content";

export default {
  title: "Templates/404 Error Page",
  parameters: {
    layout: 'fullscreen',
  },
};

export const ErrorPage = () => Component({ 
  ...BannerData, 
  ...HeaderData, 
  ...SidenavData, 
  ...IdentifierData, 
  ...FooterData, 
  ...Data,
});

export const ErrorPageSpanish = () => Component({ 
  ...BannerData, 
  ...HeaderData, 
  ...SidenavData, 
  ...IdentifierData, 
  ...FooterData, 
  ...EsData,
});
  