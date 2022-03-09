// Import page template elements
import { DefaultContent as BannerContent } from "../../usa-banner/src/content";
import TitleContent from "../../usa-site-title/src/usa-site-title.json";
import HeaderContent from "../../usa-header/src/usa-header.json";
import SidenavContent from "../../usa-sidenav/src/usa-sidenav~three-levels.json";
import { DefaultContent as IdentifierContent } from "../../usa-identifier/src/content";
import FooterContent from "../../usa-footer/src/usa-footer.json";

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
    ...args,
  });
