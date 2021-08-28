import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import handleClasses from '../../shared/utils/handlers';
import { prefix as PREFIX } from '../../shared/const/config.js'
import { Lock, LockHTTPS, LockGov, Flag } from './assets/images';
import { DefaultContent, MilContent } from './assets/content/content'
import BanerStyles from './_usa-banner.scss'

const HEADER = `${PREFIX}-banner__header`;
const EXPANDED_CLASS = `${PREFIX}-banner__header--expanded`;

@customElement('usa-banner')
export class BannerComponent extends LitElement {
  expanded: boolean;
  headerClassList: string | String;
  domain: string;
  language: string;
  content: any;

  static get properties() {
    return {
      expanded: {type: Boolean},
      headerClassList: {type: String},
      content: {attribute: false},
      language: {type: String, reflect: true},
      domain: {type: String, reflect: true},
    };
  }

  constructor () {
    super();
    this.expanded = false
    this.domain = ''
    this.language = ''
    this.headerClassList = handleClasses([
      this.expanded ? EXPANDED_CLASS : null,
    ], HEADER)
  }

  static get styles() {
		return [BanerStyles];
  }

 protected render() {
  this.content = this.domain === 'mil' ? MilContent : DefaultContent

  const header = () => html`
    <header class=${this.headerClassList}>
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
          ${this.content.banner.text}
        </p>
        <p class="usa-banner__header-action" aria-hidden="true">
          ${this.content.banner.action}
        </p>
      </div>
      <button
        class="usa-accordion__button usa-banner__button"
        aria-expanded=${this.expanded}
        aria-controls="gov-banner-default"
        @click=${(e: Event) => this._toggleExpanded(e)}
      >
        <span class="usa-banner__button-text">
          ${this.content.banner.action}
        </span>
      </button>
    </div>
  </header>
  `
  const guidance = () => html`
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
            <strong>${this.content.domain.heading}</strong>
            <br />
            ${unsafeHTML(this.content.domain.text)}
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
            <strong>${this.content.https.heading}</strong>
            <br />
            ${unsafeHTML(this.content.https.pretext)} (
            <span class="icon-lock">
              <img
                class="usa-banner__lock-image"
                src=${Lock}
                role="img"
                alt=""
                aria-hidden="true"
              />
            </span>
            ) ${unsafeHTML(this.content.https.posttext)}
          </p>
        </div>
      </div>
    </div>
  </div>
  `

  return html`
    <section class="usa-banner" aria-label=${this.content.banner.aria_label}>
      <div class="usa-accordion">
        ${header()}
        <div
          class="usa-banner__content usa-accordion__content"
          id=${this.content.banner.id}
          ?hidden=${!this.expanded}
          >
          ${guidance()}
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
  }
}

export default BannerComponent

declare global {
  interface HTMLElementTagNameMap {
    "usa-banner": BannerComponent,
  }
}
