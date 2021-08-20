import "../../stylesheets/uswds.scss"
import flagIcon from "../../img/us_flag_small.png"
import dotGovIcon from "../../img/icon-dot-gov.svg"
import httpsIcon from "../../img/icon-https.svg"
import component from "./usa-banner.twig"

const defaults = {
  images: {
    flagIcon,
    dotGovIcon,
    httpsIcon
  },
  banner: {
    id: "gov-banner-default",
    text: "An official website of the United States government",
    action: "Here's how you know",
    aria_label: "Official government website"
  },
  domain: {
    heading: "Official websites use .gov",
    text: `A <strong>.gov</strong> website belongs to an official government organization in the United States.`
  },
  https: {
    heading: "Secure .gov websites use HTTPS",
    pretext: `A <strong>lock</strong>`,
    posttext: `or <strong>https://</strong> means you’ve safely connected to the .gov website. Share sensitive information only on official, secure websites.`
  }
}

export default {
  title: "Components/Banner",
  argTypes: {
    banner: {
      id: { control: "text" },
      text: { control: "text" },
      action: { control: "text" },
      aria_label: { control: "text" }
    },
    domain: {
      header: { control: "text" },
      text: { control: "text" }
    },
    https: {
      heading: { control: "text" },
      pretext: { control: "text" },
      posttext: { control: "text" }
    }
  },
  args: defaults
}

const Template = (banner, domain, https, ...args) => component(banner, domain, https, ...args);

export const Default = Template.bind({});
Default.args = defaults;

export const DefaultSpanish = Template.bind({});
DefaultSpanish.args = {
  ...defaults,
  banner: {
    id: "gov-banner-default-lang-es",
    text: "Un sitio oficial del Gobierno de Estados Unidos",
    action: "Así es como usted puede verificarlo",
    aria_label: "Un sitio oficial del Gobierno de Estados Unidos"
  },
  domain: {
    heading: "Los sitios web oficiales usan .gov",
    text: `Un sitio web <strong>.gov</strong> pertenece a una organización oficial del Gobierno de Estados Unidos.`
  },
  https: {
    heading: "Los sitios web seguros .gov usan HTTPS",
    pretext: `Un <strong>candado</strong>`,
    posttext: `o <strong>https://</strong> significa que usted se conectó de forma segura a un sitio web .gov.  Comparta información sensible sólo en sitios web oficiales y seguros.`
  }
};

export const Mil = Template.bind({});
Mil.args = {
  ...defaults,
  banner: {
    id: "gov-banner-dot-mil",
    text: "An official website of the United States government",
    action: "Here’s how you know",
    aria_label: "Official government website,"
  },
  domain: {
    heading: "Official websites use .mil",
    text: `A <strong>.mil</strong> website belongs to an official U.S. Department of Defense organization.`
  },
  https: {
    heading: "Secure .mil websites use HTTPS",
    pretext: `A <strong>lock</strong>`,
    posttext: `or <strong>https://</strong> means you’ve safely connected to the .mil website. Share sensitive information only on official, secure websites.`
  }
};

export const MilSpanish = Template.bind({});
MilSpanish.args = {
  ...defaults,
  banner: {
    id: "gov-banner-dot-mil-lang-es",
    text: "Un sitio oficial del Gobierno de Estados Unidos",
    action: "Un sitio oficial del Gobierno de Estados Unidos,",
    aria_label: "Los sitios web oficiales usan .mil"
  },
  domain: {
    heading: "Los sitios web oficiales usan .mil",
    text: `Un sitio web <strong>.mil</strong> pertenece a una organización oficial del Departamento de Defensa de EE. UU.`
  },
  https: {
    heading: "Los sitios web seguros .mil usan HTTPS",
    pretext: `Un <strong>candado</strong>`,
    posttext: `o <strong>https://</strong> significa que usted se conectó de forma segura a un sitio web .mil.  Comparta información sensible sólo en sitios web oficiales y seguros.`
  }
};
