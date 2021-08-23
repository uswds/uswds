import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import handleClasses from '../../shared/utils/handlers';
import ButtonStyles from './_usa-button.scss'

@customElement('usa-button')
export class ButtonComponent extends LitElement {
  /**
   * Is this the principal call to action on the page?
   */
  @property({type: String})
  mode?: 'secondary'
  /**
   * How large should the button be?
   */
  @property({type: String})
  size?: 'big'
  /**
   * Which direction in hue should the button be?
   */
  @property({type: String})
  accent?: 'cool' | 'warm'
  /**
   * How should the button be presented?
   */
  @property({type: Array})
  variant?: (
    'base'
      | 'outline'
      | 'inverse'
      | 'unstyled')[]
  /**
   * Button contents
   */
  @property({type: String})
  label?: string
  /**
   * Optional click handler
   */
  @property()
  onClick?: () => void

  static get styles() {
		return [ButtonStyles];
  }

  render() {
    const classList = handleClasses([
      this.mode ? `usa-button--${this.mode}` : null,
      this.size ? `usa-button--${this.size}` : null,
      this.accent ? `usa-button--${this.accent}` : null,
      this.variant ? this.variant.map((v) => `usa-button--${v}`).join(' ') : null
    ], 'usa-button')

    const includeWrapper = this.variant?.includes('outline' && 'inverse') ? true : false

    const wrapperClasses = {
      'bg-base-darkest': includeWrapper,
      'padding-1': includeWrapper,
    }

    const wrapperStyles = {
      'max-width': 'fit-content'
    }

    const buttonBase = () => html`
      <button
        type="button"
        class=${classList}
        @click=${this.onClick}
      >
        ${this.label}
      </button>`

    return html`
      ${ includeWrapper
          ? html`
          <div
            class=${classMap(wrapperClasses)}
            style=${styleMap(wrapperStyles)}
            >
            ${buttonBase()}
          </div>`
          : buttonBase()
        }
      `
  }
}

export default ButtonComponent

declare global {
  interface HTMLElementTagNameMap {
    "usa-button": ButtonComponent,
  }
}
