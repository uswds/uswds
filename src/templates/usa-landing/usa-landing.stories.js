// Import page template elements
import { DefaultContent as BannerContent } from "../../components/usa-banner/content";
import TitleContent from "../../components/usa-site-title/usa-site-title.json";
import { DefaultContent as HeaderContent } from "../../components/usa-header/content";
import { DefaultContent as IdentifierContent } from "../../components/usa-identifier/content";
import { DefaultContent as FooterContent } from "../../components/usa-footer/content";

// Import page content
import Component from "./usa-landing.twig";

export default {
  title: "Pages/Landing",
  args: {
    ...BannerContent,
    ...TitleContent,
    ...HeaderContent,
    ...IdentifierContent,
    ...FooterContent,  
  },
  parameters: {
    layout: "fullscreen",
  },
};

export const LandingPage = (args) =>
  Component({
    ...args,
  });
