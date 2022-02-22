import prefix from "./usa-input-prefix.twig";
import suffix from "./usa-input-suffix.twig";

export default {
  title: "Components/Form Inputs/Input Prefix or Suffix",
};

const PrefixTemplate = (args) => prefix(args);
const SuffixTemplate = (args) => suffix(args);

export const Prefix = PrefixTemplate.bind({});
export const Suffix = SuffixTemplate.bind({});
