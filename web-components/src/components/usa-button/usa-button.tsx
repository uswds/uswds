import { Component, Prop, Host, h } from '@stencil/core';

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

  render() {
    return (
      <Host>
        <button class="usa-button">{ this.text }</button>
      </Host>
    );
  }

}
