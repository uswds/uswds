const { readdirSync } = require("fs");

// Gets all files from directory that are not index.js, removes file extenstion.
const getJSON = (path) =>
  readdirSync(path)
    .filter((file) => file.endsWith(".json"))
    .map((file) => file.slice(0, -5));

module.exports = getJSON(__dirname);
