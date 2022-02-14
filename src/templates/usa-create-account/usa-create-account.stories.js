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
import { DefaultContent as FooterContent } from "../../components/usa-footer/content";

// Import page content
import Component from "./usa-create-account.twig";
import { DefaultContent, EsContent } from "./content";

export default {
  title: "Pages/Create Account",
  args: {
    ...TitleContent,
    ...HeaderContent,
    ...FooterContent,
  },
  parameters: {
    layout: "fullscreen",
  },
};

export const CreateAccountPage = (args) =>
  Component({
    ...args,
    ...BannerContent,
    ...IdentifierContent,
    ...DefaultContent,
  });

export const CreateAccountPageSpanish = (args) =>
  Component({
    ...args,
    ...EsBannerContent,
    ...EsIdentifierContent,
    ...EsContent,
  });
