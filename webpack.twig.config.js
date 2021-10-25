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
function buildFileObj(dir, file, dataFile){

  const templateFile = file.replace('.html', '.twig')
  const dataFilePath = `${dir}/${dataFile}`

  const name = !dataFile
    ? file.replace('/src/components', '').replace('.twig', '.html')
    : `${dir.replace('/src/components', '')}/${dataFile.replace('.json', '.html')}`

  function buildModifierData(dataSource) {
    const regexDashes = /--([\s\S]*)$/
    const regexTilda = /~([\s\S]*)$/
    let modifiedData;

    if (dataSource.indexOf('--') > -1) {
      const rootDataFile = dataSource.replace(regexDashes, '.json')
      modifiedData = Object.assign(
          JSON.parse(fs.readFileSync(rootDataFile, 'utf-8')),
          JSON.parse(fs.readFileSync(dataSource, 'utf-8'))
        )
      }

    if (dataSource.indexOf('~') > -1) {
      const rootDataFile = dataSource.replace(regexTilda, '.json')
      modifiedData = Object.assign(
          JSON.parse(fs.readFileSync(rootDataFile, 'utf-8')),
          JSON.parse(fs.readFileSync(dataSource, 'utf-8'))
        )
      }

      return modifiedData || JSON.parse(fs.readFileSync(dataSource, 'utf-8'))
    }

  const data = checkFileExistsSync(dataFilePath)
    ? buildModifierData(dataFilePath)
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
      // in each directory, we need to build modifers
      const allData = fs.readdirSync(dir).filter( f => f.indexOf('.json') > -1)

      if (allData.length > 0) {
        allData.forEach((d) => {
          results.push(buildFileObj(dir, file, d));
        })
      } else {
        results.push(buildFileObj(dir, file))
      }
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

module.exports = {
  mode: 'production',
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
