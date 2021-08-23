import { LitElement, html } from 'lit';
import {
  customElement,
} from 'lit/decorators.js';
import {ifDefined} from 'lit/directives/if-defined.js';
import '../../js/components/banner'
import handleClasses from '../../shared/utils/handlers';
import { prefix as PREFIX } from '../../shared/const/config.js'
import { Lock, LockHTTPS, LockGov, Flag } from './assets/images';
import BanerStyles from './_usa-banner.scss'

const HEADER = `${PREFIX}-banner__header`;
const EXPANDED_CLASS = `${PREFIX}-banner__header--expanded`;

@customElement('usa-banner')
export class BannerComponent extends LitElement {
  expanded: boolean;
  headerClassList;

  constructor () {
    super()
    this.expanded = false;
    this.headerClassList = handleClasses([
      this.expanded ? EXPANDED_CLASS : null,
    ], HEADER)
  }

  static get properties() {
    return {
      expanded: { type: Boolean },
      headerClassList: { type: String}
    };
  }

  static get styles() {
		return [BanerStyles];
  }

 protected render() {
    return html`
      <section class="usa-banner" aria-label="Official government website">
        <div class="usa-accordion">
        <header class=${ifDefined(this.headerClassList)}>
      <div class="usa-banner__inner">
        <div class="grid-col-auto">
          <img
            class="usa-banner__header-flag"
            src=${Flag}
            alt="U.S. flag"
          />
        </div>
        <div class="grid-col-fill tablet:grid-col-auto">
          <p class="usa-banner__header-text">
            An official website of the United States government
          </p>
          <p class="usa-banner__header-action" aria-hidden="true">
            Here’s how you know
          </p>
        </div>
        <button
          class="usa-accordion__button usa-banner__button"
          aria-expanded="false"
          aria-controls="gov-banner-default"
          @click=${(e: Event) => this._toggleExpanded(e)}
        >
          <span class="usa-banner__button-text">Here’s how you know</span>
        </button>
      </div>
    </header>
    <div class="usa-banner__content usa-accordion__content" id="gov-banner-default">
      <div class="grid-row grid-gap-lg">
        <div class="usa-banner__guidance tablet:grid-col-6">
          <img
            class="usa-banner__icon usa-media-block__img"
            src=${LockGov}
            role="img"
            alt=""
            aria-hidden="true"
          />
          <div class="usa-media-block__body">
            <p>
              <strong> Official websites use .gov </strong>
              <br />
              A <strong>.gov</strong> website belongs to an official government
              organization in the United States.
            </p>
          </div>
        </div>
        <div class="usa-banner__guidance tablet:grid-col-6">
          <img
            class="usa-banner__icon usa-media-block__img"
            src=${LockHTTPS}
            role="img"
            alt=""
            aria-hidden="true"
          />
          <div class="usa-media-block__body">
            <p>
              <strong> Secure .gov websites use HTTPS </strong>
              <br />
              A <strong>lock</strong> (
              <span class="icon-lock">
                <img
                  class="usa-banner__icon usa-media-block__img"
                  src=${Lock}
                  role="img"
                  alt=""
                  aria-hidden="true"
                />
              </span>
              ) or <strong>https://</strong> means you’ve safely connected to
              the .gov website. Share sensitive information only on official,
              secure websites.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
`
  }

  private _toggleExpanded = (e: Event) => {
    e.preventDefault()
    this.expanded = !this.expanded
    this.headerClassList = handleClasses([
      this.expanded ? EXPANDED_CLASS : null,
    ], HEADER)
    console.log(this.expanded)
    console.log(this.headerClassList)
  }
}

export default BannerComponent

declare global {
  interface HTMLElementTagNameMap {
    "usa-banner": BannerComponent,
  }
}
