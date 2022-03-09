// Import page template elements
import {
  DefaultContent as BannerContent,
  DefaultContentLangEs as EsBannerContent,
} from "../../usa-banner/src/content";
import TitleContent from "../../usa-site-title/src/usa-site-title.json";
import HeaderContent from "../../usa-header/src/usa-header.json";
import {
  DefaultContent as IdentifierContent,
  EsContent as EsIdentifierContent,
} from "../../usa-identifier/src/content";
import FooterContent from "../../usa-footer/src/usa-footer.json";

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
