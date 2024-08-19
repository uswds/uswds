const { readdirSync } = require("fs");

/** Returns an array of available token JSON file names. 
 *  Used by style-dictionary configs to iteratively build tokens.
 * 
 * @param {string} path - Directory of token JSON files.
 * @returns  Array of token file names without file extension.
 */
const getJSON = (path) =>
  readdirSync(path)
    .filter((file) => file.endsWith(".json"))
    .map((file) => file.slice(0, -5));

module.exports = getJSON(__dirname);
