import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'usa-button',
  styleUrl: 'usa-button.scss',
  shadow: true,
})
export class UsaButton {
  /**
   * The button text.
   */
  @Prop() text: string;

  /**
   * The color variant of the button.
   */
  @Prop() variant: 'accent-cool' | 'accent-warm' | 'base' | 'outline' | 'outline-inverse' | 'secondary' | 'unstyled';

  /**
   * The big button variant.
   * ? Currently, the only size option available.
   */
  @Prop() big: boolean;


  /**
   * The button type.
   * ? Might not work since `type` is reserved.x`
   * @type {string}
   */
  @Prop() type: 'button' | 'submit' | 'reset';

  render() {
    return (
      <button type={ this.type || "button" } class={`usa-button ${ this.variant ? `usa-button--${this.variant}` : "" }`}><slot></slot> {this.type}</button>
    );
  }
}
