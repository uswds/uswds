// Import page template elements
import { 
  DefaultContent as BannerData,
  DefaultContentLangEs as EsBannerData 
} from "../../components/usa-banner/content";
import * as TitleData from "../../components/usa-site-title/usa-site-title.json";
import { headerData as HeaderData } from "../../components/usa-header/content";
import { 
  Data as IdentifierData,
  EsData as EsIdentifierData,
 } from "../../components/usa-identifier/content";
import { Data as FooterData } from "../../components/usa-footer/content";

// Import page content
import Component from "./usa-create-account.twig";
import { Data, EsData } from "./content";

export default {
  title: "Patterns/Page Patterns/Create Account",
  args: {
    ...TitleData,
    ...HeaderData, 
    ...FooterData,
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export const CreateAccountPage = (args) => Component({ 
  ...args,
  ...BannerData, 
  ...IdentifierData, 
  ...Data 
});

export const CreateAccountPageSpanish = (args) => Component({ 
  ...args,
  ...EsBannerData,
  ...EsIdentifierData,
  ...EsData 
});
