// Import page template elements
import {
  DefaultContent as BannerContent,
  DefaultContentLangEs as EsBannerContent,
} from "../../components/usa-banner/content";
import TitleContent from "../../components/usa-site-title/usa-site-title.json";
import HeaderContent from "../../components/usa-header/usa-header.json";
import {
  DefaultContent as IdentifierContent,
  EsContent as EsIdentifierContent,
} from "../../components/usa-identifier/content";
import FooterContent from "../../components/usa-footer/usa-footer.json";

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
};

export const CreateAccountPage = (args) =>
  Component({
    ...args,
    banner: {
      ...BannerContent,
    },
    ...IdentifierContent,
    ...DefaultContent,
  });

export const CreateAccountPageSpanish = (args) =>
  Component({
    ...args,
    banner: {
      ...EsBannerContent,
    },
    ...EsIdentifierContent,
    ...EsContent,
  });
