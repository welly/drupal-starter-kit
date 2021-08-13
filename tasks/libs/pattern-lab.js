const concat   = require('gulp-concat')
const fs       = require('fs')
const gulp     = require('gulp')
const util     = require('util')
const compiler = require('./compiler')

/**
 * Build all the pattern lab assets.
 *
 * @param location {string}
 *   The location of the pattern lab.
 * @param destination {string}
 *   The location to write the files to.
 */
exports.buildPatternLabAssets = function(location, destination) {
  gulp.src(location + '/*/*/dist/*.css')
    .pipe(concat('patterns.style.css'))
    .pipe(gulp.dest(destination + '/css'))

  gulp.src(location + '/*/*/dist/*.min.js')
    .pipe(concat('patterns.min.js'))
    .pipe(gulp.dest(destination + '/js'))
}

/**
 * Build all the assets for the individual patterns.
 *
 * @param location {string}
 *   The location of the pattern lab
 * @param isProd {boolean}
 *   A flag indicating if the task should be run in production mode.
 *
 * @returns {Promise<any>}
 *  A promise on the tasks being run
 */
exports.buildDependencies = (location, isProd) => {
  console.log('Searching location ', location)

  const promises = []

  return new Promise((resolve, reject) => {
    promises.push(
      compiler.compileSass(
        location + '/../_base/scss/*.{scss,sass}',
        location + '/../assets/css',
        isProd
      )
    )

    promises.push(
      compiler.compileJs(
        location + '/../_base/js/*.js',
        location + '/../assets/js',
        isProd
      )
    )

    getPatterns(location).forEach((pattern) => {
      if (pattern.hasCss) {
        promises.push(
          compiler.compileSass(
            pattern.path + '/scss/*.{scss,sass}',
            pattern.path + '/dist',
            isProd
          )
        )
      }

      if (pattern.hasJs) {
        promises.push(
          compiler.compileJs(
            pattern.path + '/js/*.js',
            pattern.path + '/dist',
            isProd
          )
        )
      }
    })

    Promise.all(promises)
      .then(() => {
        resolve()
      })
      .catch((error) => {
        console.log('Error', error)
      })
  })
}

/**
 * Build the CSS dependencies for the individual patterns.
 *
 * @param location {string}
 *   The location of the pattern lab
 * @param isProd {boolean}
 *   A flag indicating if the task should be run in production mode.
 *
 * @returns {Promise<any>}
 *  A promise on the tasks being run
 */
exports.buildCssDependencies = (location, isProd) => {
  const promises = []

  return new Promise((resolve, reject) => {
    promises.push(
      compiler.compileSass(
        location + '/../_base/scss/*.{scss,sass}',
        location + '/../assets/css',
        isProd
      )
    )

    getPatterns(location).forEach((pattern) => {
      if (pattern.hasCss) {
        promises.push(
          compiler.compileSass(
            pattern.path + '/scss/*.{scss,sass}',
            pattern.path + '/dist',
            isProd
          )
        )
      }
    })

    Promise.all(promises)
      .then(() => {
        resolve()
      })
      .catch((error) => {
        console.log('Error', error)
      })
  })
}

/**
 * Build the JS dependencies for the individual patterns.
 *
 * @param location {string}
 *   The location of the pattern lab
 * @param isProd {boolean}
 *   A flag indicating if the task should be run in production mode.
 *
 * @returns {Promise<any>}
 *  A promise on the tasks being run
 */
exports.buildJsDependencies = (location, isProd) => {
  const promises = []

  return new Promise((resolve, reject) => {
    getPatterns(location).forEach((pattern) => {
      if (pattern.hasJs) {
        promises.push(
          compiler.compileJs(
            pattern.path + '/js/*.js',
            pattern.path + '/dist',
            isProd
          )
        )
      }
    })

    Promise.all(promises)
      .then(() => {
        resolve()
      })
      .catch((error) => {
        console.log('Error', error)
      })
  })
}

/**
 * Get the available patterns.
 *
 * @param location {string}
 *   The location to search.
 *
 * @returns {Array}
 *   An array available patterns.
 */
const getPatterns = (location) => {
  const patterns = []

  fs.readdirSync(location).forEach((patternType) => {
    const patternTypePath = location + '/' + patternType;

    if (!patternType.includes('00-base')) {
      if (fs.lstatSync(patternTypePath).isDirectory()) {
        fs.readdirSync(patternTypePath).forEach((pattern) => {
          const patternPath = patternTypePath + '/' + pattern;

          if (fs.lstatSync(patternPath).isDirectory()) {
            patterns.push({
              'path'  : patternPath,
              'hasCss': fs.existsSync(patternPath + '/scss/'),
              'hasJs' : fs.existsSync(patternPath + '/js/'),
            })
          }
        })
      }
    }

  })

  return patterns;
}


