const server = require("browser-sync").create();
const run = require("gulp-run-command").default;

const serverOptions = {
  server: ["./build/"],
  notify: false,
  open: false,
  port: 3333,
}

// our cache doesn't clear in patternlab like you would expect
// https://github.com/pattern-lab/patternlab-node/wiki/Incremental-Builds#possible-issues
// so we rebuild with the patternlab cli, which seems to be working
// for the time being
async function rebuildPL() {
  return run("npm run pl:build --pattern")();
}

async function buildPL() {
  return run("npm run pl:build")();
}

// giving us a way to exit the server when needed
// see a11y
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
