// Import page template elements
import {
  DefaultContent as BannerContent,
  DefaultContentLangEs as EsBannerContent,
} from "../../components/usa-banner/content";
import TitleContent from "../../components/usa-site-title/usa-site-title.json";
import { DefaultContent as HeaderContent } from "../../components/usa-header/content";
import {
  DefaultContent as IdentifierContent,
  EsContent as EsIdentifierContent,
} from "../../components/usa-identifier/content";
import { LevelTwoContent as SidenavContent } from "../../components/usa-sidenav/content";
import { DefaultContent as FooterContent } from "../../components/usa-footer/content";

// Import sign in form elements
import SignInForm from "./usa-sign-in.twig";
import SignInMultipleForm from "./usa-sign-in--multiple.twig";
import {
  DefaultContent,
  EsContent,
  MultipleContent,
  EsMultipleContent,
} from "./content";

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
    ...BannerContent,
    ...IdentifierContent,
    ...DefaultContent,
  });

export const SignInPageSpanish = (args) =>
  SignInForm({
    ...args,
    ...EsBannerContent,
    ...EsIdentifierContent,
    ...EsContent,
  });

export const MultipleSignInPage = (args) =>
  SignInMultipleForm({
    ...args,
    ...BannerContent,
    ...IdentifierContent,
    ...MultipleContent,
  });

export const MultipleSignInPageSpanish = (args) =>
  SignInMultipleForm({
    ...args,
    ...EsBannerContent,
    ...EsIdentifierContent,
    ...EsMultipleContent,
  });
