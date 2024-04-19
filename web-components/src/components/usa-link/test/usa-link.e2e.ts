import { newE2EPage } from '@stencil/core/testing';

describe('usa-link', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<usa-link></usa-link>');

    const element = await page.find('usa-link');
    expect(element).toHaveClass('hydrated');
  });
});
