'use strict';
// Small Gulp ESLint Prettier plugin based on:
// https://github.com/bhargavrpatel/gulp-prettier
// and using https://github.com/prettier/prettier-eslint.

// Include Our Plugins.
const Buffer = require('safe-buffer').Buffer;
const through = require('through2');
const PluginError = require('plugin-error');
const format = require('prettier-eslint');

module.exports = function() {
  return through.obj(function(file, encoding, callback) {
    if (file.isNull()) {
      return callback(null, file);
    }

    if (file.isStream()) {
      return callback(
        new PluginError('gulp-tasks/format', 'Streaming not supported')
      );
    }

    const unformattedCode = file.contents.toString('utf8');

    try {
      const formattedCode = format({
        text: unformattedCode,
        filePath: file.path
      });

      if (formattedCode !== unformattedCode) {
        file.isPrettier = true;
        file.contents = Buffer.from(formattedCode);
      }

      this.push(file);
    }
    catch (error) {
      this.emit(
        'error',
        new PluginError('gulp-tasks/format', error, { fileName: file.path })
      );
    }

    callback();
  });
};
