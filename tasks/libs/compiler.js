const autoPrefix = require('gulp-autoprefixer')
const babel = require('gulp-babel')
const gulp = require('gulp')
const gulpIf = require('gulp-if')
const cleanCSS = require('gulp-clean-css')
const notify = require('gulp-notify')
const plumber = require('gulp-plumber')
const rename = require('gulp-rename')
const sass = require('gulp-sass')
const sizeReport = require('gulp-sizereport')
const stripCssComments = require('gulp-strip-css-comments')
const stripDebug = require('gulp-strip-debug')
const uglify = require('gulp-uglify')

/**
 * Compile the given JS file.
 *
 * @param location {string}
 *   The location of the JS file
 * @param destination {string}
 *   The location to output the JS file
 * @param isProd {boolean}
 *   A flag indicating if the task should be run in production mode.
 *
 * @returns {Promise<any>}
 *   A promise
 */
exports.compileJs = function (location, destination, isProd) {

  const plumberErrorHandler = {
    errorHandler: function(err) {
      notify.onError({
        title: 'Gulp',
        message: 'Error: <%= error.message %>'
      })(err);

      if (isProd) {
        this.emit('end');
        process.exit(1);
      }
    }
  };

  return new Promise((resolve, reject) => {
    gulp
      .src(location)
      .pipe(plumber(plumberErrorHandler))
      .pipe(
        babel({
          presets: ['@babel/preset-env'] // ES6
        })
      )
      // .pipe(concat(fileName))
      .pipe(gulpIf(isProd, stripDebug()))
      .pipe(gulpIf(isProd, uglify()))
      .pipe(
        rename({ extname: '.min.js' })
      )
      .pipe(gulp.dest(function (file) {
        return destination
      }))
      .on('end', () => {
        resolve()
      })
    // .pipe(sizeReport({
    //   gzip: true
    // }))
  })
}

/**
 * Compile the given SASS file.
 *
 * @param location {string}
 *   The location of the SASS file
 * @param destination {string}
 *   The location to output the SASS file
 * @param isProd {boolean}
 *   A flag indicating if the task should be run in production mode.
 *
 * @returns {Promise<any>}
 *   A promise
 */
exports.compileSass = (location, destination, isProd) => {

  const plumberErrorHandler = {
    errorHandler: function(err) {
      notify.onError({
        title: 'Gulp',
        message: 'Error: <%= error.message %>'
      })(err);

      if (isProd) {
        this.emit('end');
        process.exit(1);
      }
    }
  };

  return new Promise((resolve, reject) => {
    gulp.src(location)
      .pipe(plumber(plumberErrorHandler))
      .pipe(
        sass({
          includePaths: [
            'node_modules/susy/sass',
            'node_modules/breakpoint-sass/stylesheets',
            '../pattern-lab/source/_base/scss',
          ],
          errLogToConsole: true
        })
      )
      .pipe(
        autoPrefix({
          Browserslist: ['> 1%', 'last 2 versions', 'Firefox ESR']
        })
      )
      .pipe(
        stripCssComments({
          preserve: true
        })
      )
      .pipe(gulpIf(isProd, cleanCSS()))
      .pipe(
        rename(function (file) {
          file.dirname = '';
        })
      )
      .pipe(gulp.dest(function (file) {
        return destination
      }))
      .on('end', () => {
        resolve()
      })
    // .pipe(sizeReport({
    //   gzip: true
    // }))
  })
}
