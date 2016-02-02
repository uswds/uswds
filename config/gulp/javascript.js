var gulp = require( 'gulp' );
var browserify = require( 'gulp-browserify' );
var sourcemaps = require( 'gulp-sourcemaps' );
var rename = require( 'gulp-rename' );

var files = [

  'js/start.js',

];

var options = {

  // TODO

};

gulp.task( 'javascript', function ( done ) {

  return gulp.src( files )
    //.pipe( sourcemaps.init() )
    .pipe( browserify( options ) )
    //.pipe( sourcemaps.write() )
    .pipe( rename( { basename: 'components' } ) )
    .pipe( gulp.dest( 'dist/js' ) );

} );
