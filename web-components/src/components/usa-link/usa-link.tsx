import { Component,Prop, Host, h } from '@stencil/core';

@Component({
  tag: 'usa-link',
  styleUrl: 'usa-link.scss',
  shadow: true,
})
export class UsaLink {
  /**
   * The link text.
   */
  @Prop() text: string;
  @Prop() href: string;

  render() {
    return (
      <Host>
        <a class="usa-link" href={this.href}>{ this.text }</a>
      </Host>
    );
  }

}
