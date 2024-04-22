import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'usa-link',
  styleUrl: 'usa-link.scss',
  shadow: true,
})

// From StencjilJS docs:
// The name of the ES6 class of the component SHOULD NOT have a prefix since classes are scoped. There is no risk of collision.
// https://stenciljs.com/docs/style-guide#component-ts-class
export class Link {

  /**
   * The link href.
   */
  @Prop() href?: string = '#';

  /**
   * The link label.
   */
  @Prop() text: string;

  /**
   * Whether internal or external link.
   */
  @Prop() isExternal: boolean = false;


  // isExternal() {
  //   const { href } = this;

  //   if (href !== "undefined") {
  //     return;
  //   }

  //   return !(/\.gov$/.test(href));
  // }

  // TODO: Add external & alt class.
  render() {
    return (
      <a href={this.href} class="usa-link">
        <slot>{this.text}</slot>
      </a>
    );
  }

}
