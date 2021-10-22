const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// syncronously check if a file exists
function checkFileExistsSync(filepath){
  let flag = true;
  try{
    fs.accessSync(filepath, fs.constants.F_OK);
  }catch(e){
    flag = false;
  }
  return flag && filepath;
}

// builds the file object for html page gen
function buildFileObj(file){
  const name = file.replace('/src/components', '').replace('.twig', '.html')
  const templateFile = file.replace('.html', '.twig')
  const dataFile = templateFile.replace('.twig', '.json')
  const data = checkFileExistsSync(dataFile)
    ? JSON.parse(fs.readFileSync(dataFile, 'utf-8'))
    : {}

  const fileObj = {
    filename: name,
    template: templateFile,
    templateParameters: data,
  }
  return fileObj
}

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
      results.push(buildFileObj(file));
    }
  });
  return results;
}

const files = walk('./src/components', '.twig');

const htmlPlugins = files.map( file =>
  new HtmlWebpackPlugin({
      inject: false,
      filename: file.filename,
      template: file.template,
      templateParameters: file.templateParameters,
    }))


// TODO: for each data set, create an html file based on its closest relative twig template

module.exports = {
  mode: 'production',
  stats: {
    entrypoints: false,
    children: false,
  },
  entry: {
    main: './html-templates/main.js',
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
