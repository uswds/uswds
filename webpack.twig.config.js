const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// const ext = '.twig';
// const twigFiles = [];
// const componentsDir = path.join(__dirname, './src/components/')

// const twigFiles = fs.readdir(componentsDir, (_err, dir) =>
//     dir.map( dirName => {
//       console.log(dirName)
//       const componentsFiles = `${componentsDir}${dirName}/`
//       return fs.readdir(
//           componentsFiles, (_err2, files) => files.map(file => path.extname(file).toLowerCase() === ext
//           ? file
//           : null
//         )
//       )
//     }
//   )
// );

// filter out anything that starts with an underscore or is not a twig file
function walk(dir, ext) {
  console.log(`${ext}`)
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    // eslint-disable-next-line no-param-reassign
    file = `${dir}/${file}`;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory() && path.basename(file).indexOf('_') !== 0) {
      /* Recurse into a subdirectory */
      results = results.concat(walk(file, ext));
    } else if (
      stat &&
      !stat.isDirectory() &&
      path.extname(file) === `${ext}` &&
      path.basename(file).indexOf('_') !== 0
    ) {
      /* Is a file */
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src/components', '.twig');
const data = walk('./src/components', '.json');

console.log(files, data)

// TODO: for each data set, create an html file based on its closest relative twig template

const file = './src/components/usa-banner/usa-banner.twig';
const dataFile = './src/components/usa-banner/content/usa-banner.json';

module.exports = {
  mode: 'production',
  entry: file,
  output: {
    path: path.resolve(__dirname, './html-templates'),
  },
  module: {
    rules: [
      {
        test: /\.twig$/,
        use: [
          'raw-loader',
          {
            loader: 'twig-html-loader',
            options: {
              data: JSON.parse(fs.readFileSync(`${dataFile}`, 'utf-8')),
            },
          },
        ],
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      filename: file.replace('.twig', '.html'),
      template: path.resolve(__dirname, file),
    })
  ],
}
