import Component from "./usa-error.twig";
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
