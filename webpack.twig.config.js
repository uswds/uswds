const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// filter out anything that starts with an underscore or is not a twig file
function walk(dir, ext) {
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
const allData = walk('./src/components', '.json');

const htmlPlugins = allData.map(
  d => {
    const output = d.substr(0, d.lastIndexOf('.'));
    // const regex = /^(.*[\\/])/
    const template = files.filter(file => file.includes(output.substr(0, output.lastIndexOf('/'))));
    console.log("template", template[0])
    console.log("data", d)
    // const template = files.filter(name)
    // Create new HTMLWebpackPlugin with options
    return new HtmlWebpackPlugin({
      inject: false,
      filename: d.replace('/src/components', '').replace('.json', '.html'),
      template: path.resolve(__dirname, template.length > 0 ? template[0] : {}),
      templateParameters: JSON.parse(fs.readFileSync(`${d}`, 'utf-8')),
      hash: true,
    })
  }
);

console.log(path.resolve(__dirname, './src/components'))


// TODO: for each data set, create an html file based on its closest relative twig template

module.exports = {
  mode: 'production',
  stats: {
    entrypoints: false,
    children: false,
  },
  context: path.resolve(__dirname, './html-templates'),
  entry: {
    main: './main.js',
  },
  output: {
    path: path.resolve(__dirname, './html-templates'),
  },
  module: {
    rules: [
      {
        test: /\.twig$/,
        use: "twigjs-loader",
        resolve: {
          alias: {
            '@components': path.resolve(__dirname, './src/components')
          },
        },
      },
    ],
  },
  plugins: [].concat(htmlPlugins),
}
