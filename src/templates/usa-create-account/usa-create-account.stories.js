import Component from "./usa-create-account.twig";

import { DefaultContent as BannerData } from "../../components/usa-banner/content";
import { headerData as HeaderData } from "../../components/usa-header/content";
import { Data as IdentifierData } from "../../components/usa-identifier/content";
import { Data as FooterData } from "../../components/usa-footer/content";
import { FormData } from "./usa-create-account.json";


export default {
  title: "Templates/Create Account Page",
  parameters: {
    layout: 'fullscreen',
  },
};

export const CreateAccountPage = () => Component({ 
  ...BannerData, 
  ...HeaderData, 
  ...IdentifierData, 
  ...FooterData, 
  ...FormData 
});
