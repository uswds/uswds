import Component from "./usa-error.twig";

import { DefaultContent as BannerData } from "../../components/usa-banner/content";
import { headerData as HeaderData } from "../../components/usa-header/content";
import { LevelTwoData as SidenavData } from "../../components/usa-sidenav/content";
import { Data as IdentifierData } from "../../components/usa-identifier/content";
import { Data as FooterData } from "../../components/usa-footer/content";
import { Data, EsData } from "./content";

export default {
  title: "Pages/Error",
  parameters: {
    layout: 'fullscreen',
  },
};

export const PageNotFound = () => Component({ 
  ...BannerData, 
  ...HeaderData, 
  ...SidenavData, 
  ...IdentifierData, 
  ...FooterData, 
  ...Data,
});

export const PageNotFoundSpanish = () => Component({ 
  ...BannerData, 
  ...HeaderData, 
  ...SidenavData, 
  ...IdentifierData, 
  ...FooterData, 
  ...EsData,
});
  