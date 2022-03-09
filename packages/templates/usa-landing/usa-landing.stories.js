// Import page template elements
import { DefaultContent as BannerContent } from "../../usa-banner/src/content";
import TitleContent from "../../usa-site-title/src/usa-site-title.json";
import HeaderContent from "../../usa-header/src/usa-header.json";
import { DefaultContent as IdentifierContent } from "../../usa-identifier/src/content";
import FooterContent from "../../usa-footer/src/usa-footer.json";

// Import page content
import Component from "./usa-landing.twig";

export default {
  title: "Pages/Landing",
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

export const LandingPage = (args) =>
  Component({
    ...args,
  });
