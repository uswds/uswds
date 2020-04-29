const browserifyConfig = {
  dist: {
    src: "src/js/main.js",
    dest: "./assets/js/main.js",
    options: {
      browserifyOptions: {
        debug: true,
        transform: [
          [
            "babelify",
            {
              presets: ["@babel/preset-env"]
            }
          ]
        ]
      }
    }
  }
};

const sassConfig = {
  dist: {
    src: "src/css/style.scss",
    dest: "./assets/css/style.css",
    options: {
      style: "nested",
      includePaths: ["node_modules/uswds/src/stylesheets"]
    }
  }
};

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    browserify: browserifyConfig,

    sass: sassConfig,

    watch: {
      js: {
        files: "src/js/**/*.js",
        task: "browserify"
      },
      sass: {
        files: "src/css/**/*.scss",
        task: "sass"
      }
    }
  });

  require("load-grunt-tasks")(grunt);

  // because `grunt js` is easier to type than `grunt browserify`
  grunt.registerTask("js", ["browserify"]);

  grunt.registerTask("default", ["js", "sass", "watch"]);
};
