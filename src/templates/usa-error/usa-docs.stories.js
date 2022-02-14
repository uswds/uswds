import Component from "./usa-error.twig";

import { DefaultContent as BannerContent } from "../../components/usa-banner/content";
import TitleContent from "../../components/usa-site-title/usa-site-title.json";
import { DefaultContent as HeaderContent } from "../../components/usa-header/content";
import { DefaultContent as IdentifierContent } from "../../components/usa-identifier/content";
import { DefaultContent as FooterContent } from "../../components/usa-footer/content";
import { DefaultContent, EsContent } from "./content";

export default {
  title: "Pages/Error",
  parameters: {
    layout: "fullscreen",
  },
  args: {
    ...BannerContent,
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
    ...EsContent,
  });
