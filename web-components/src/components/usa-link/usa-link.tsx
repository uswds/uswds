import { Component, Prop, h } from '@stencil/core';

// TODO: Validate links.
// TODO: Detect external (non `.gov` links).
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
   * Inverse link for dark backgrounds. Previously alt, but changed to avoid confusion with existing HTML alt attribute.
   * ? This would be a considered a new "mode."
   */
  @Prop() inverse: boolean = false;

  /**
   * Whether internal or external link.
   */
  @Prop() external: boolean = false;

  render() {
    return (
      // TODO: Create issue for missing `usa-link--alt` styles.
      <a href={this.href} class={`usa-link ${ this.inverse ? "usa-link--alt" : ""} ${ this.external ? "usa-link--external" : "" }`}>
        <span><slot /></span>
      </a>
    );
  }

}
