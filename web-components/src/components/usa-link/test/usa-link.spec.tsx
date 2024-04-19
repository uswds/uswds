import { newSpecPage } from '@stencil/core/testing';
import { UsaLink } from '../usa-link';

describe('usa-link', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [UsaLink],
      html: `<usa-link></usa-link>`,
    });
    expect(page.root).toEqualHtml(`
      <usa-link>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </usa-link>
    `);
  });
});
