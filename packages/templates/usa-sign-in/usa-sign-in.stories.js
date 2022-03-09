// Import page template elements
import {
  DefaultContent as BannerContent,
  DefaultContentLangEs as EsBannerContent,
} from "../../components/usa-banner/src/content";
import TitleContent from "../../components/usa-site-title/src/usa-site-title.json";
import HeaderContent from "../../components/usa-header/src/usa-header.json";
import {
  DefaultContent as IdentifierContent,
  EsContent as EsIdentifierContent,
} from "../../components/usa-identifier/src/content";
import SidenavContent from "../../components/usa-sidenav/src/usa-sidenav~three-levels.json";
import FooterContent from "../../components/usa-footer/src/usa-footer.json";

// Import sign in form elements
import SignInForm from "./usa-sign-in.twig";
import SignInMultipleForm from "./usa-sign-in--multiple/usa-sign-in--multiple.twig";
import DefaultContent from "./usa-sign-in.json";
import EsContent from "./usa-sign-in~lang-es.json";
import MultipleContent from "./usa-sign-in--multiple/usa-sign-in--multiple.json";
import EsMultipleContent from "./usa-sign-in--multiple/usa-sign-in--multiple~lang-es.json";

export default {
  title: "Pages/Sign-In",
  args: {
    ...TitleContent,
    ...SidenavContent,
    ...FooterContent,
    ...HeaderContent,
  },
};

export const SignInPage = (args) =>
  SignInForm({
    ...args,
    banner: {
      ...BannerContent,
    },
    ...IdentifierContent,
    ...DefaultContent,
  });

export const SignInPageSpanish = (args) =>
  SignInForm({
    ...args,
    banner: {
      ...EsBannerContent,
    },
    ...EsIdentifierContent,
    ...EsContent,
  });

export const MultipleSignInPage = (args) =>
  SignInMultipleForm({
    ...args,
    banner: {
      ...BannerContent,
    },
    ...IdentifierContent,
    ...MultipleContent,
  });

export const MultipleSignInPageSpanish = (args) =>
  SignInMultipleForm({
    ...args,
    banner: {
      ...EsBannerContent,
    },
    ...EsIdentifierContent,
    ...EsMultipleContent,
  });
