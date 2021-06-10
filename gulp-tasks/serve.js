const server = require("browser-sync");
const run = require("gulp-run-command").default;
const dutil = require("./utils/doc-util");

server.create("USWDS Server");

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
  dutil.logMessage("exitServer", "Exiting server");
  return server.exit();
}

function serve(done) {
  dutil.logMessage("serve", "Starting server");

  // See https://browsersync.io/docs/options for more options.

  server
    .init(serverOptions, () => {
      if (server.active) {
        server.exit();
      } else {
        done();
      }
    });

  done();
}

module.exports = {
  serve,
  server,
  buildPL,
  rebuildPL,
  exitServer,
}
