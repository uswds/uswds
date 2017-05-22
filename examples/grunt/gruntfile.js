module.exports = function(grunt) {
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    sass: {
      options: {
        style: 'compressed',
        includePaths: [
          'node_modules/uswds/src/stylesheets',
        ],
      },
      dist: {
        files: {
          'assets/css/style.css': 'src/css/style.scss'
        },
      },
    },

    watch: {
      sass: {
        files: 'src/css/**/*.scss',
        tasks: ['sass'],
      },
    },

  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', [
    'sass',
    // 'watch'
  ]);
};
