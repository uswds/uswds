const del = require("del");
const spawn = require("cross-spawn");
const gulp = require("gulp");
const dutil = require("./doc-util");
const crypto = require('crypto');
const fs = require('fs');

const task = "release";
const hash = crypto.createHash('sha256');

// Create a hash from the compiled ZIP users can compare and verify
// their download is authentic.
const createHash = (file) => {
  dutil.logMessage('createHash', 'Generating sha256sum hash from ZIP file.');

  let file_buffer = fs.readFileSync(file);
  hash.update(file_buffer);
  const dir = './security';
  const hex = hash.digest('hex');
  const fileName = `${dir}/${dutil.dirName}-zip-hash.txt`;
  const fileContents = hex;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  fs.writeFile(fileName, fileContents, (error) => {
    if (error) return dutil.logError(`Error writing hash: ${error}`);
  });
};

gulp.task("make-tmp-directory", () => {
  dutil.logMessage(
    "make-tmp-directory",
    "Creating temporary release directory."
  );
  return gulp.src("dist/**/*").pipe(gulp.dest(dutil.dirName));
});

gulp.task("clean-tmp-directory", () => {
  dutil.logMessage(
    "clean-tmp-directory",
    "Deleting temporary release directory."
  );
  return del(dutil.dirName);
});

gulp.task("zip-archives", (done) => {
  const zip = spawn("zip", [
    "--log-info",
    "-r",
    `./dist/${dutil.dirName}.zip`,
    dutil.dirName,
    '-x "*.DS_Store"',
  ]);

  dutil.logMessage(
    "zip-archives",
    `Creating a zip archive in dist/${dutil.dirName}.zip`
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
      createHash(`dist/${dutil.dirName}.zip`);
      done();
    }
  });
});

gulp.task(
  task,
  gulp.series(
    (done) => {
      dutil.logMessage(
        task,
        `Creating a zip archive at dist/${dutil.dirName}.zip`
      );
      done();
    },
    "build",
    "make-tmp-directory",
    "zip-archives",
    "clean-tmp-directory"
  )
);
