const del = require("del");
const spawn = require("cross-spawn");
const { src, dest, series } = require("gulp");
const crypto = require('crypto');
const fs = require('fs');
const dutil = require("./utils/doc-util");
const { build } = require("./build")

const hash = crypto.createHash('sha256');

let version = dutil.dirName.replace("@uswds/", "");

// Create a hash from the compiled ZIP users can compare and verify
// their download is authentic.
function createHash(file) {
  dutil.logMessage('createHash', 'Generating sha256sum hash from ZIP file.');

  const fileBuffer = fs.readFileSync(file);
  hash.update(fileBuffer);
  const dir = './security';
  const hex = hash.digest('hex');
  const fileName = `${dir}/${version}-zip-hash.txt`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  fs.writeFile(fileName, hex, (error) => {
    if (error) {
      return dutil.logError(`Error writing hash: ${error}`);
    }

    return dutil.logMessage('createHash', `Created sha256sum hash: ${hex}`);
  });
}

function getFilesize(file) {
  const stats = fs.statSync(`${file}`);
  const fileSizeInBytes = stats.size;
  const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
  return dutil.logMessage("zip size", `${fileSizeInMegabytes.toFixed(2)} M`);
}

function makeTmpDirectory() {
  dutil.logMessage(
    "make-tmp-directory",
    "Creating temporary release directory."
  );
  return src("dist/**/*").pipe(dest(version));
};

function cleanTmpDirectory() {
  dutil.logMessage(
    "clean-tmp-directory",
    "Deleting temporary release directory."
  );
  return del(version);
};

function zipArchives(done) {
  const zip = spawn("zip", [
    "--log-info",
    "-r",
    `./dist/${version}.zip`,
    version,
    '-x "*.DS_Store"',
  ]);

  dutil.logMessage(
    "zip-archives",
    `Creating a zip archive in dist/${version}.zip`
  );

  zip.stdout.on("data", (data) => {
    if (/[\w\d]+/.test(data)) {
      dutil.logData("zip-archives", data);
    }
  });

  zip.stderr.on("data", (data) => {
    dutil.logError("zip-archives", data);
  });

  zip.on("error", (error) => {
    dutil.logError("zip-archives", "Failed to create a zip archive");
    done(error);
  });

  zip.on("close", (code) => {
    if (code === 0) {
      createHash(`dist/${version}.zip`);
      getFilesize(`./dist/${version}.zip`);
      done();
    }
  });
};

exports.release = series(
  (done) => {
    dutil.logMessage(
      "release",
      `Creating a zip archive at dist/${version}.zip`
    );
    done();
  },
  build,
  makeTmpDirectory,
  zipArchives,
  cleanTmpDirectory
);
