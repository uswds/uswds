import path from 'node:path'
import { promises as fs } from 'node:fs';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sassVars from 'get-sass-vars';

async function extractTokensFromSass(pathToScss) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const scss = await fs.readFile(pathToScss, 'utf-8')
  const json = await sassVars(scss, { 
    sassOptions: {
        loadPaths: [
          path.resolve(__dirname, '../packages/uswds/'),
          path.resolve(__dirname, '../packages/'),
        ]
      }
    }
  );

  return json;
}

function walkStyles(sassObj) {
  const result = {};
  for (const [key, value] of Object.entries(sassObj)) {    
    if (typeof value === 'string') {
      result[key] = {
        '$value': value
      }
    } else if (typeof value === 'object') {
      result[key] = walkStyles(value)
    }
  }
  
  return result;
}

function getTokenFileName(path){
  const sassFileName = path.split('/').pop();
  const jsonFileName = sassFileName.replace(/^_/,'').replace(/scss$/,"json");
  return jsonFileName;
}

function transformStyleJson(tokenJson, tokenType) {
  // Apply whatever massaging has to happen for particular token types

  // rm extraneous key for system colors
  const topLevelKey = Object.keys(tokenJson)[0];
  if (topLevelKey.match(/^\$system\-color|\$tokens\-color/)) {
    tokenJson = tokenJson[topLevelKey]
  }

  // Add $type for styledictionary/DTCG format
  tokenJson['$type'] = tokenType;
  return tokenJson;
}

export async function sassToJson(pathToScss, tokenType){
  const sassObj = await extractTokensFromSass(pathToScss)
  let tokenJson = walkStyles(sassObj);
  tokenJson = transformStyleJson(tokenJson, tokenType)
  const tokenFileName = getTokenFileName(pathToScss);
  console.info(`Converting ${tokenFileName}`);
  writeFileSync(`tokens/${tokenType}/${tokenFileName}`, JSON.stringify(tokenJson, null, 2));
}
