// Import page template elements
import {
  DefaultContent as BannerContent,
  DefaultContentLangEs as EsBannerContent,
} from "../../components/usa-banner/content";
import {
  DefaultContent as IdentifierContent,
  EsContent as EsIdentifierContent,
} from "../../components/usa-identifier/content";
import FooterContent from "../../components/usa-footer/usa-footer.json";

// Import page content
import Component from "./usa-create-account.twig";
import DefaultContent from "./usa-create-account.json";
import EsContent from "./usa-create-account~lang-es.json";

export default {
  title: "Pages/Create Account",
  args: {
    ...FooterContent,
  },
};

export const CreateAccountPage = (args) =>
  Component({
    ...args,
    ...BannerContent,
    ...IdentifierContent,
    ...DefaultContent,
  });

export const CreateAccountPageSpanish = (args) =>
  Component({
    ...args,
    ...EsBannerContent,
    ...EsIdentifierContent,
    ...EsContent,
  });
