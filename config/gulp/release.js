const del = require("del");
const spawn = require("cross-spawn");
const gulp = require("gulp");
const crypto = require('crypto');
const fs = require('fs');
const log = require("fancy-log");
const pkg = require("../../package.json");
const hash = crypto.createHash('sha256');
const dirName = pkg.name + '-' + pkg.version;

// Create a hash from the compiled ZIP users can compare and verify
// their download is authentic.
const createHash = (file) => {
  let file_buffer = fs.readFileSync(file);
  hash.update(file_buffer);
  const dir = './security';
  const hex = hash.digest('hex');
  const fileName = `${dir}/${dirName}-zip-hash.txt`;
  const fileContents = hex;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  fs.writeFile(fileName, fileContents, (error) => {
    if (error) return log(error);
  });
};

gulp.task("make-tmp-directory", () => {
  return gulp.src("dist/**/*").pipe(gulp.dest(dirName));
});

gulp.task("clean-tmp-directory", () => {
  return del(dirName);
});

gulp.task("zip-archives", (done) => {
  const zip = spawn("zip", [
    "--log-info",
    "-r",
    `./dist/${dirName}.zip`,
    dirName,
    '-x "*.DS_Store"',
  ]);

  zip.stdout.on("data", (data) => {
    if (/[\w\d]+/.test(data)) {
      log(data);
    }
  });

  zip.stderr.on("data", (error) => {
    log(error);
  });

  zip.on("error", (error) => {
    log(error);
    done(error);
  });

  zip.on("close", (code) => {
    if (code === 0) {
      createHash(`dist/${dirName}.zip`);
      done();
    }
  });
});

gulp.task("release",
  gulp.series(
    (done) => {
      done();
    },
    "build",
    "make-tmp-directory",
    "zip-archives",
    "clean-tmp-directory"
  )
);
