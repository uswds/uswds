import Component from "./usa-error.twig";

import { DefaultContent as BannerData } from "../../components/usa-banner/content";
import * as TitleData from "../../components/usa-site-title/usa-site-title.json";
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
  args: {
    ...BannerData, 
    ...TitleData,
    ...HeaderData, 
    ...SidenavData, 
    ...IdentifierData, 
    ...FooterData, 
  }
};

export const PageNotFound = (args) => Component({ 
  ...args,
  ...Data,
});

export const PageNotFoundSpanish = (args) => Component({ 
  ...args,
  ...EsData,
});
  