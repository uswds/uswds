import Component from "./usa-error.twig";
import DefaultContent from "./usa-error.json";
import EsContent from "./usa-error~lang-es.json";

export default {
  title: "Pages/Error",
};

export const PageNotFound = () =>
  Component({
    ...DefaultContent,
  });

export const PageNotFoundSpanish = () =>
  Component({
    ...EsContent,
  });
