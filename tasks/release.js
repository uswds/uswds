const spawn = require("cross-spawn");
const { series } = require("gulp");
const crypto = require("crypto");
const fs = require("fs");
const dutil = require("./utils/doc-util");
const { build } = require("./build");

const hash = crypto.createHash("sha256");

const version = dutil.dirName.replace("@uswds/", "");

// Create a hash from the compiled tgz users can compare and verify
// their download is authentic.
function createHash(file) {
  dutil.logMessage("createHash", "Generating sha256sum hash from ZIP file.");

  const fileBuffer = fs.readFileSync(file);
  hash.update(fileBuffer);
  const dir = "./security";
  const hex = hash.digest("hex");
  const fileName = `${dir}/${version}-zip-hash.txt`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  fs.writeFile(fileName, hex, (error) => {
    if (error) {
      return dutil.logError(`Error writing hash: ${error}`);
    }

    return dutil.logMessage("createHash", `Created sha256sum hash: ${hex}`);
  });
}

function zipArchives(done) {
  const zip = spawn("npm", ["pack"]);

  dutil.logMessage("zip-archives", `Creating a tgz archive in root directory`);

  zip.stdout.on("data", (data) =>
    dutil.logData("zip-archives", `Created ${data}`)
  );

  zip.stderr.on("data", (data) => dutil.logError("zip-archives", data));

  // @TODO get data from stdout
  zip.on("close", (code) => {
    if (code === 0) {
      createHash(`./uswds-${version}.tgz`);
      done();
    }
  });
}

exports.release = series(
  (done) => {
    dutil.logMessage(
      "release",
      `Creating a tgz archive at ./uswds-${version}.tgz`
    );
    done();
  },
  build,
  zipArchives
);
