const { readdirSync } = require("fs");
const path = require("path");



/** Returns an array of available token JSON file names. 
 *  Used by style-dictionary configs to iteratively build tokens.
 * 
 * @param {string} dir - Directory of token JSON files.
 * @returns  Array of token file names without file extension.
 */
module.exports = (dir) => {
  const dirPath = path.resolve(dir);
  return readdirSync(dirPath)
    .filter((file) => file.endsWith(".json"))
    .map((file) => file.slice(0, -5));
}
