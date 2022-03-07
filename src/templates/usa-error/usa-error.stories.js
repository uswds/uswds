import Component from "./usa-error.twig";
import {
  DefaultContent as BannerContent,
  DefaultContentLangEs as EsBannerContent,
} from "../../components/usa-banner/content";
import {
  DefaultContent as IdentifierContent,
  EsContent as EsIdentifierContent,
} from "../../components/usa-identifier/content";
import FooterContent from "../../components/usa-footer/usa-footer.json";
import DefaultContent from "./usa-error.json";
import EsContent from "./usa-error~lang-es.json";

export default {
  title: "Pages/Error",
  args: {
    ...BannerContent,
    ...FooterContent,
  },
};

export const PageNotFound = (args) =>
  Component({
    ...args,
    ...IdentifierContent,
    ...DefaultContent,
  });

export const PageNotFoundSpanish = (args) =>
  Component({
    ...args,
    ...EsBannerContent,
    ...EsIdentifierContent,    
    ...EsContent,
  });
