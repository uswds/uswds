// Import page template elements
import { DefaultContent as BannerContent } from "../../components/usa-banner/content";
import TitleContent from "../../components/usa-site-title/usa-site-title.json";
import { DefaultContent as HeaderContent } from "../../components/usa-header/content";
import { LevelThreeContent as SidenavContent } from "../../components/usa-sidenav/content";
import { DefaultContent as IdentifierContent } from "../../components/usa-identifier/content";
import { DefaultContent as FooterContent } from "../../components/usa-footer/content";

// Import page content
import Component from "./usa-docs.twig";

export default {
  title: "Pages/Documentation",
  args: {
    banner: {
      ...BannerContent,
    },
    ...TitleContent,
    ...HeaderContent,
    ...FooterContent,
    ...SidenavContent,
    ...IdentifierContent,
  },
};

export const DocumentationPage = (args) =>
  Component({
    ...args
  });
