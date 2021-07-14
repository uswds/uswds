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
    const ClassList:string = VariantList.indexOf(null) === -1 ? 'usa-button' : ['usa-button', VariantList.filter((v) => v !== null)].join(' ')
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
        <div class=${classMap(wrapperClasses)} style=${includeWrapper && styleMap(wrapperStyles)}>
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

// .usa-button--secondary

// Button uses secondary color.

// .usa-button--accent-cool

// Button uses accent-cool color.

// .usa-button--accent-warm

// Button uses accent-warm color.

// .usa-button--base

// Button uses base color.

// .usa-button--outline

// Transparent button with a color stroke.

// .usa-button--inverse

// Light color button for dark backgrounds.

// .usa-button--big

// A bigger button.

// .usa-button--unstyled

// A button that looks like a link.

// {%- if (classes == 'usa-button--outline usa-button--inverse') -%}
// <div class="bg-base-darkest padding-1" style="max-width: fit-content">
// {% endif -%}

// <button class="usa-button {{ classes }}">Default</button>
// {% if (category != 'disabled') and (category != 'big') -%}
// <button class="usa-button {{ classes }} usa-button--hover">Hover</button>
// <button class="usa-button {{ classes }} usa-button--active">Active</button>
// <button class="usa-button {{ classes }} usa-focus">Focus</button>
// <button class="usa-button {{ classes }}" disabled>Disabled</button>
// {%- endif -%}
// <button class="usa-button {{ classes }} usa-button--unstyled">Unstyled button</button>

// {%- if (classes == 'usa-button--outline usa-button--inverse') %}
// </div>
// {%- endif %}
