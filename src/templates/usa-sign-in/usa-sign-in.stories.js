import SignInForm from "./usa-sign-in.twig";
import SignInMultipleForm from "./usa-sign-in--multiple.twig";

import { 
  DefaultContent as BannerData,
  DefaultContentLangEs as EsBannerData 
} from "../../components/usa-banner/content";
import * as TitleData from "../../components/usa-site-title/usa-site-title.json";
import { LevelTwoData as SidenavData } from "../../components/usa-sidenav/content";
import { 
  Data as IdentifierData,
  EsData as EsIdentifierData,
 } from "../../components/usa-identifier/content";
import { Data as FooterData } from "../../components/usa-footer/content";

import { 
  SignInData, 
  EsSignInData,
  SignInMultipleData, 
  EsSignInMultipleData,
} from "./content";

export default {
  title: "Pages/Sign In",
  parameters: {
    layout: 'fullscreen',
  },
};

export const SignInPage = (args) => SignInForm({ 
  ...BannerData, 
  ...IdentifierData, 
  ...SignInData,
});

export const SignInPageSpanish = (args) => SignInForm({ 
  ...EsBannerData, 
  ...EsIdentifierData, 
  ...EsSignInData,
});

export const MultipleSignInPage = (args) => SignInMultipleForm({ 
  ...BannerData, 
  ...IdentifierData, 
  ...SignInMultipleData,
});

export const MultipleSignInPageSpanish = (args) => SignInMultipleForm({ 
  ...EsBannerData, 
  ...EsIdentifierData, 
  ...EsSignInMultipleData,
});