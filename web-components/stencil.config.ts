import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { postcss } from '@stencil-community/postcss';
import autoprefixer from 'autoprefixer';


export const config: Config = {
  namespace: 'web-components',
  plugins: [
    sass({
      includePaths: [
        '../packages/'
      ]
    }),
    // TODO: Get all required USWDS postcss plugins.
    //? Autoprefixer looks for browserslistrc in current or parent directories.
    //? See: https://github.com/browserslist/browserslist?tab=readme-ov-file#queries
    postcss({
      plugins: [autoprefixer()]
    })
  ],
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
      externalRuntime: false,
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
  testing: {
    browserHeadless: "new",
  },
};
