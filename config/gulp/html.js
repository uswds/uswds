var gulp = require('gulp');
var dutil = require('./doc-util');
var Transform = require('stream').Transform;
var Path = require('path');
var Prism = require('prismjs');

gulp.task('html', function () {

  return gulp.src('src/html/**/*.html')
    .pipe(generateCodeSnippets())
    .pipe(gulp.dest('docs/_includes/code/components'));

});

function generateCodeSnippets () {
  var transformStream = new Transform({ objectMode: true });

  transformStream._transform = function (file, encoding, callback) {
    var error = null;
    var contents = file.contents.toString();
    var previewContent = new Buffer(contents);
    var codeContent = new Buffer(Prism.highlight(contents, Prism.languages.markup));
    var previewFile = file.clone({ contents: false });
    var codeFile = file.clone({ contents: false });
    var previewFileName = 'preview-' + Path.basename(file.path);
    var codeFileName = 'code-' + Path.basename(file.path);

    dutil.logMessage('generate-code-snippets', 'Generating files for ' + Path.basename(file.path));
    previewFile.path = Path.join(Path.dirname(previewFile.path), previewFileName);
    previewFile.contents = previewContent;
    codeFile.path = Path.join(Path.dirname(codeFile.path), codeFileName);
    codeFile.contents = codeContent;

    this.push(previewFile);
    this.push(codeFile);

    callback(error);
  };

  return transformStream;
}
