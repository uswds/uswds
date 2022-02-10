import SignInForm from "./usa-sign-in.twig";
import SignInMultipleForm from "./usa-sign-in--multiple.twig";

import { DefaultContent as BannerData } from "../../components/usa-banner/content";
import { headerData as HeaderData } from "../../components/usa-header/content";
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
  ...HeaderData, 
  ...SidenavData, 
  ...IdentifierData, 
  ...FooterData, 
  ...SignInData,
});

export const SignInPageSpanish = () => SignInForm({ 
  ...BannerData, 
  ...HeaderData, 
  ...SidenavData, 
  ...IdentifierData, 
  ...FooterData, 
  ...EsSignInData,
});

export const MultipleSignInPage = () => SignInMultipleForm({ 
  ...BannerData, 
  ...HeaderData, 
  ...SidenavData, 
  ...IdentifierData, 
  ...FooterData, 
  ...SignInMultipleData,
});

export const MultipleSignInPageSpanish = () => SignInMultipleForm({ 
  ...BannerData, 
  ...HeaderData, 
  ...SidenavData, 
  ...IdentifierData, 
  ...FooterData, 
  ...EsSignInMultipleData,
});