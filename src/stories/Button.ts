import { html } from 'lit-html'
import {classMap} from 'lit-html/directives/class-map.js';
import {styleMap} from 'lit-html/directives/style-map.js';
import './button.css'

export interface ButtonProps {
  /**
   * Is this the principal call to action on the page?
   */
  mode?: 'secondary'
  /**
   * How large should the button be?
   */
  size?: 'big'
  /**
   * Which direction in hue should the button be?
   */
  accent?: 'cool' | 'warm'
  /**
   * How should the button be presented?
   */
  variant?: ['base' | 'outline' | 'inverse' | 'unstyled']
  /**
   * Button contents
   */
  label: string
  /**
   * Optional click handler
   */
  onClick?: () => void
}
/**
 * Primary UI component for user interaction
 */
const Button = ({ mode, size, accent, variant, label, onClick }: ButtonProps) => {
  const buttonMode = mode ? `usa-button--${mode}` : null
  const buttonSize = size ? `usa-button--${size}` : null
  const buttonAccent = accent ? `usa-button--${accent}` : null
  const buttonVariant = variant ? variant.map((v) => `usa-button--${v}`).join(' ') : null

  const handleButtonVariants = () => {
    const VariantList = [buttonMode, buttonSize, buttonAccent, buttonVariant]
    const ClassList:string = VariantList.indexOf(null) === -1 ? 'usa-button'
      : ['usa-button', VariantList.filter((v) => v !== null)].join(' ')
    return ClassList
  }

  const includeWrapper = variant?.includes('outline') && variant?.includes('inverse') ? true : false

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
          style=${includeWrapper && styleMap(wrapperStyles)}>
          <button
            type="button"
            class=${handleButtonVariants()}
            @click=${onClick}
          >
            ${label}
          </button>
        </div>`
        : html`
        <button
          type="button"
          class=${handleButtonVariants()}
          @click=${onClick}
        >
          ${label}
        </button>`
      }
    `
};

export default Button //TODO: need to convert to lit-element
