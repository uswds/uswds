var gulp = require('gulp');
var dutil = require('./doc-util');
var spawn = require('child_process').spawn;
var cleanup = require('gulp-cleanup');
var inquirer = require('inquirer');

var task = /([\w\d-_]+)\.js$/.exec(__filename)[ 1 ];
var taskBuild = task + ':build';
var taskServe = task + ':serve';
var taskDev = task + ':development';

// Wrapper task for `bundle config --local.us_web_design_standards [ path to local gem ]`
// This task is specifically used to aid in checking standards development against
// the Jekyll site and the ruby gem package.
//
gulp.task('local-bundle-config', function (done) {

  if (! cFlags.local) {
    dutil.logMessage(
      'local-bundle-config',
      'Using us_web_design_standards gem from Github'
   );
    return done();
  }

  dutil.logMessage(
    'local-bundle-config',
    'Prompting for relative path to local us_web_design_standards_gem directory'
 );

  inquirer.prompt([ {

    type: 'input',
    name: 'gemPath',
    message: 'Relative path for us_web_design_standards Ruby gem. Press return to use the default value.',
    default: '../us_web_design_standards_gem',

  } ], function (answers) {

    dutil.logMessage('local-bundle-config', 'Configuring bundle to use local ruby gem');

    var bundleConfig = spawn('bundle', [

      'config',
      '--local',
      'local.us_web_design_standards',
      answers.gemPath,

    ]);

    bundleConfig.stdout.on('data', function (data) {

      if (/[\w\d]+/.test(data)) {

        dutil.logData('local-bundle-config', data);

      }

    });

    bundleConfig.on('error', function (error) { done(error); });

    bundleConfig.on('close', function (code) { if (0 === code) { done(); } });

  });

});

// Wrapper task for `bundle install` which installs gems for the Jekyll site.
//
gulp.task('bundle-gems', [ 'local-bundle-config' ], function (done) {

  var bundle = spawn('bundle', [ 'update' ]);

  bundle.stdout.on('data', function (data) {

    if (/[\w\d]+/.test(data)) {

      dutil.logData('bundle-gems', data);

    }

  });

  bundle.on('error', function (error) { done(error); });

  bundle.on('close', function (code) { if (0 === code) { done(); } });

});

// Base task for `gulp website` prints helpful information about available commands.
//
gulp.task(task, function (done) {

  dutil.logIntroduction();

  dutil.logHelp(
    'gulp ' + task,
    'This is the default website task. Please review the available commands.'
 );

  dutil.logCommand(
    'gulp ' + taskBuild,
    'Build the website.'
 );

  dutil.logCommand(
    'gulp ' + taskServe,
    'Preview the website locally and rebuild it when files change.'
 );

  done();

});

// Wrapper task for `jekyll serve --watch` which runs after `gulp bundle-gems` to make sure
// the gems are properly bundled.
//
gulp.task(taskServe, [ 'bundle-gems' ], function (done) {

  var jekyll = spawn('jekyll', [ 'serve', '-w' ]);

  jekyll.stdout.on('data', function (data) {

    if (/[\w\d]+/.test(data)) {

      data += '';
      data = data.replace(/[\s]+/g, ' ');

      if (/done|regen/i.test(data)) {

        dutil.logMessage(taskServe, data);

      } else {

        dutil.logData(taskServe, data);

      }

    }

  });

  jekyll.on('error', function (error) { done(error); });

  jekyll.on('close', function (code) { if (0 === code) { done(); } });


});

// Wrapper task for `jekyll build` which runs after `gulp bundle-gems` to make sure
// the gems are properly bundled.
//
gulp.task(taskBuild, [ 'bundle-gems' ], function (done) {

  var jekyll = spawn('jekyll', [ 'build' ]);

  jekyll.stdout.on('data', function (data) {

    if (/[\w\d]+/.test(data)) {

      data += '';
      data = data.replace(/[\s]+/g, ' ');
      dutil.logData(taskBuild, data);

    }

  });

  jekyll.on('error', function (error) { done(error); });

  jekyll.on('close', function (code) { if (0 === code) { done(); } });

});
