const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// const ext = '.twig';
// const twigFiles = [];
// const componentsDir = path.join(__dirname, './src/components/')

// fs.readdir(componentsDir, (_err, dir) =>
//     dir.forEach( dirName => {
//       const componentsFiles = `${componentsDir}${dirName}/`
//       twigFiles.push(fs.readdir(
//           componentsFiles, (_err2, files) => files.filter((e)=> console.log(path.extname(e).toLowerCase() === ext))
//         )
//       )
//     }
//   )
// );
// // path.extname(e).toLowerCase() === ext

// console.log(twigFiles)

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
