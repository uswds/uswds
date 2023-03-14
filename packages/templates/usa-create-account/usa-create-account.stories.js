// Import page content
import Component from "./usa-create-account.twig";
import DefaultContent from "./usa-create-account.json";
import EsContent from "./usa-create-account~lang-es.json";

export default {
  title: "Pages/Create Account",
};

export const CreateAccountPage = () =>
  Component({
    ...DefaultContent,
  });

export const CreateAccountPageSpanish = () =>
  Component({
    ...EsContent,
  });
