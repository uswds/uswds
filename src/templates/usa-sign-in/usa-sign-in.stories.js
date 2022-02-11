// Import page template elements
import { 
  DefaultContent as BannerData,
  DefaultContentLangEs as EsBannerData 
} from "../../components/usa-banner/content";
import * as TitleData from "../../components/usa-site-title/usa-site-title.json";
import { 
  Data as IdentifierData,
  EsData as EsIdentifierData,
 } from "../../components/usa-identifier/content";
import { LevelTwoData as SidenavData } from "../../components/usa-sidenav/content";
import { Data as FooterData } from "../../components/usa-footer/content";

// Import sign in form elements
import SignInForm from "./usa-sign-in.twig";
import SignInMultipleForm from "./usa-sign-in--multiple.twig";
import { 
  SignInData, 
  EsSignInData,
  SignInMultipleData, 
  EsSignInMultipleData,
} from "./content";


export default {
  title: "Pages/Sign In",
  args: {
    ...TitleData,
    ...SidenavData,
    ...FooterData
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export const SignInPage = (args) => SignInForm({ 
  ...args,
  ...BannerData, 
  ...IdentifierData, 
  ...SignInData,
});

export const SignInPageSpanish = (args) => SignInForm({ 
  ...args,
  ...EsBannerData, 
  ...EsIdentifierData, 
  ...EsSignInData,
});

export const MultipleSignInPage = (args) => SignInMultipleForm({ 
  ...args,
  ...BannerData, 
  ...IdentifierData, 
  ...SignInMultipleData,
});

export const MultipleSignInPageSpanish = (args) => SignInMultipleForm({ 
  ...args,
  ...EsBannerData, 
  ...EsIdentifierData, 
  ...EsSignInMultipleData,
});