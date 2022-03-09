import Component from "./usa-error.twig";
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
import { DefaultContent, EsContent } from "./content";

export default {
  title: "Pages/Error",
  args: {
    banner: {
      ...BannerContent,
    },
    ...TitleContent,
    ...HeaderContent,
    ...IdentifierContent,
    ...FooterContent,
  },
};

export const PageNotFound = (args) =>
  Component({
    ...args,
    ...DefaultContent,
  });

export const PageNotFoundSpanish = (args) =>
  Component({
    ...args,
    banner: {
      ...EsBannerContent,
    },
    ...EsContent,
    ...EsIdentifierContent,
  });
