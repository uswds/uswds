import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
// import Styles from './_button.scss'
import Styles from '../stylesheets/components/_usa-button.scss'

@customElement('usa-button')
export class ButtonComponent extends LitElement {
    /**
   * Is this the principal call to action on the page?
   */
  @property({type: String}) mode?: 'secondary'
  /**
   * How large should the button be?
   */
  @property({type: String}) size?: 'big'
  /**
   * Which direction in hue should the button be?
   */
  @property({type: String}) accent?: 'cool' | 'warm'
  /**
   * How should the button be presented?
   */
  @property({type: Array}) variant?:
    [
      'base'
      | 'outline'
      | 'inverse'
      | 'unstyled'
    ]
  /**
   * Button contents
   */
  @property({type: String}) label?: string
  /**
   * Optional click handler
   */
  @property() onClick?: () => void

  static get styles() {
		return [Styles];
  }

  render() { // Defines a template to be "rendered" as part of the component.
    const buttonMode = this.mode ? `usa-button--${this.mode}` : null
    const buttonSize = this.size ? `usa-button--${this.size}` : null
    const buttonAccent = this.accent ? `usa-button--${this.accent}` : null
    const buttonVariant = this.variant
      ? this.variant.map((v) => `usa-button--${v}`).join(' ') : null

    const handleButtonVariants = () => {
      const VariantList = [buttonMode, buttonSize, buttonAccent, buttonVariant]
      const ClassList:string = VariantList.indexOf(null) === -1 ? 'usa-button'
        : ['usa-button', VariantList.filter((v) => v !== null).join(' ')].join(' ')
      return ClassList
    }

    const includeWrapper = this.variant?.includes('outline')
      && this.variant?.includes('inverse') ? true : false

    const wrapperClasses = {
      'bg-base-darkest': includeWrapper,
      'padding-1': includeWrapper,
    }

    const wrapperStyles = {
      'max-width': 'fit-content'
    }

    return html`
      ${ includeWrapper
          ? html`
          <div
            class=${classMap(wrapperClasses)}
            .style=${includeWrapper && styleMap(wrapperStyles)}>
              <button
              type="button"
              class=${handleButtonVariants()}
              @click=${this.onClick}
            >
              ${this.label}
            </button>
          </div>`
          : html`
          <button
            type="button"
            class=${handleButtonVariants()}
            @click=${this.onClick}
          >
            ${this.label}
          </button>`
        }
      `
  }
}

export default ButtonComponent
