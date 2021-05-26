const server = require("browser-sync").create();
const run = require("gulp-run-command").default;

const serverOptions = {
  server: ["./build/"],
  notify: false,
  open: false,
  port: 3333,
}

/**
 * ! Cache doesn't clear in patternlab like you would expect
 * https://github.com/pattern-lab/patternlab-node/wiki/Incremental-Builds#possible-issues
 * So we rebuild with the patternlab cli, which seems to be working for now
 */
async function rebuildPL() {
  return run("npm run pl:build --pattern")();
}

async function buildPL() {
  return run("npm run pl:build")();
}

/**
 * Used in a11y task in `test.js` to exit server.
 */
async function exitServer() {
  return server.exit();
}

module.exports = {
  serve(done) {
    // See https://browsersync.io/docs/options for more options.
    server.init(serverOptions);
    done();
  },
  server,
  buildPL,
  rebuildPL,
  exitServer
}
