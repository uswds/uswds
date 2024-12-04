const { readdirSync } = require("fs");
const path = require("path");

/**
 * Returns an array of token JSON file names (without extensions) from a specified directory.
 * 
 * @param {string} dir - Directory of token JSON files.
 * @returns {Array} An array of token file names without extensions.
 */
module.exports = (dir) => {
  const dirPath = path.resolve(dir);
  return readdirSync(dirPath)
    .filter((file) => file.endsWith(".json"))
    .map((file) => file.replace(".json", ""));
}
