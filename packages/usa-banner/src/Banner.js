import * as content from "./content/usa-banner.json";

const templateString = (data) => {
  // Get the data object and destructure.
  const { banner, domain, https } = data;

  // Create the template with passed data.
  /* html */ return `
  <section
    class="usa-banner"
    aria-label="Official website of the United States government"
  >
    <div class="usa-accordion">
      <header class="usa-banner__header">
        <div class="usa-banner__inner">
          <img
            aria-hidden="true"
            class="usa-banner__header-flag"
            src="https://cdnjs.cloudflare.com/ajax/libs/uswds/3.3.0/img/us_flag_small.png"
            alt=""
          />
          <p class="usa-banner__header-text">
            ${banner.text}
          </p>
          <button
          type="button"
          class="usa-accordion__button usa-banner__button"
          aria-expanded="false"
          aria-controls="gov-banner-default"
          >
            <span class="usa-banner__button-text">
              ${banner.action}
            </span>
          </button>
        </div>
      </header>
      <div
        class="usa-banner__content usa-accordion__content"
        id="gov-banner-default"
        hidden>
        <div class="grid-row grid-gap-lg">
          <div class="usa-banner__guidance tablet:grid-col-6">
            <img
              class="usa-banner__icon usa-media-block__img"
              src="https://cdnjs.cloudflare.com/ajax/libs/uswds/3.3.0/img/icon-dot-gov.svg"
              role="img"
              alt=""
              aria-hidden="true"
            />
            <div class="usa-media-block__body">
              <p>
                ${domain.heading}
                ${domain.text}
              </p>
            </div>
          </div>
          <div class="usa-banner__guidance tablet:grid-col-6">
            <img
              class="usa-banner__icon usa-media-block__img"
              src="https://cdnjs.cloudflare.com/ajax/libs/uswds/3.3.0/img/icon-https.svg"
              role="img"
              alt=""
              aria-hidden="true"
            />
            <div class="usa-media-block__body">
            <p>
              ${https.heading}
              ${https.pretext}
                <span class="icon-lock">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="52"
                    height="64"
                    viewBox="0 0 52 64"
                    class="usa-banner__lock-image"
                    role="img"
                    aria-labelledby="banner-lock-description-default"
                    focusable="false"
                  >
                    <title id="banner-lock-title-default">Lock</title>
                    < id="banner-lock-description-default">Locked padlock icon</  desc>
                    <path
                      fill="#000000"
                      fill-rule="evenodd"
                      d="M26 0c10.493 0 19 8.507 19 19v9h3a4 4 0 0 1 4 4v28a4 4 0 0   1-4   4H4a4 4 0 0 1-4-4V32a4 4 0 0 1 4-4h3v-9C7 8.507 15.507 0 26   0zm0  8c-5.979 0-10.843 4.77-10.996 10.712L15 19v9h22v-9c0-6. 075-4.  925-11-11-11z"/>
                  </svg>
                </span>
                ${https.posttext}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
`;
};

class BannerComponent extends HTMLElement {
  constructor() {
    super();

    this.template = document.createElement("template");
    this.template.innerHTML = templateString(content);
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === "tld" || name === "locale") {
      this.render();
    }
  }

  connectedCallback() {
    /**
     *
     * ! ShadowDOM experiment
     * ! Markup still showed up via shadow root and styles were lost.
     *
     */
    // this.attachShadow({ mode: "open" });
    // const bannerShadowDOM = this.shadowRoot;
    // this.template.innerHTML = templateString(content);
    // bannerShadowDOM.appendChild(this.template.content.cloneNode(true));

    this.appendChild(this.template.content.cloneNode(true));

    // const bannerElem = bannerShadowDOM.querySelector(".usa-banner");
    // const accordionElem = bannerShadowDOM.querySelector(".usa-accordion");

    // banner.on(bannerElem);
    // accordion.on(bannerElem);

    this.render();
  }

  render() {
    // ? Set defaults and/or fallback if attributes aren't set.
    const locale = this.getAttribute("locale") || "en";
    const tld = this.getAttribute("tld") || "gov";

    // const content2 = this.template.content.cloneNode(true);
    // this.innerHTML = "";
    // this.append(content2);

    // this.append(banner);
  }

  static get observedAttributes() {
    return ["locale", "tld"];
  }
}

window.customElements.define("usa-banner", BannerComponent);
