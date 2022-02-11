import SignInForm from "./usa-sign-in.twig";
import SignInMultipleForm from "./usa-sign-in--multiple.twig";

import { 
  DefaultContent as BannerData,
  DefaultContentLangEs as EsBannerData 
} from "../../components/usa-banner/content";
import TitleData from "../../components/usa-site-title/usa-site-title.json";
import { LevelTwoData as SidenavData } from "../../components/usa-sidenav/content";
import { Data as IdentifierData } from "../../components/usa-identifier/content";
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

export const SignInPage = () => SignInForm({ 
  ...BannerData, 
  ...TitleData, 
  ...SidenavData, 
  ...IdentifierData, 
  ...FooterData, 
  ...SignInData,
});

export const SignInPageSpanish = () => SignInForm({ 
  ...EsBannerData, 
  ...TitleData, 
  ...SidenavData, 
  ...IdentifierData, 
  ...FooterData, 
  ...EsSignInData,
});

export const MultipleSignInPage = () => SignInMultipleForm({ 
  ...BannerData, 
  ...TitleData, 
  ...SidenavData, 
  ...IdentifierData, 
  ...FooterData, 
  ...SignInMultipleData,
});

export const MultipleSignInPageSpanish = () => SignInMultipleForm({ 
  ...EsBannerData, 
  ...TitleData, 
  ...SidenavData, 
  ...IdentifierData, 
  ...FooterData, 
  ...EsSignInMultipleData,
});