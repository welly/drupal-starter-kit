const fs = require('fs')
const gulp = require('gulp')
const gUtil = require('gulp-util')
const builder = require('./libs/builder')
const compile = require('./libs/compiler')
const patternLab = require('./libs/pattern-lab')
const replace = require('gulp-replace')

let isProd = false

// If "prod" is passed from the command line as an argument, i.e. with
// `npm run gulp drupal-theme --envi=prod`, then update the defaults
if (gUtil.env.envi === 'prod') {
  isProd = true
}

var themeFolder = 'starter_kit';

gulp.task('drupal-theme', function (done) {
  const location = '../docroot/themes/custom/' + themeFolder + '/';

  compile.compileSass(location + 'sass/*.scss', location + 'css', isProd)
    .then(() => {done()})
  compile.compileJs(location + 'js/src/*.js', location + 'js/', isProd )
    .then(() => {done()})

  if (!isProd) {
    gulp.watch([location + 'sass/*.scss'], function (done) {
      compile.compileSass(location + 'sass/*.scss', location + 'css', isProd)
        .then(() => {
          done()
        })
    })
    gulp.watch([location + 'js/src/*.js'], function (done) {
      compile.compileJs(location + 'js/src/*.js', location + 'js/', isProd)
        .then(() => {
          done()
        })
    })
  }
})

gulp.task('pattern-lab', function (done) {
  const location = '../pattern-lab/source/_patterns';

  patternLab.buildDependencies(location, isProd)
    .then(() => {
      patternLab.buildPatternLabAssets(location, '../pattern-lab/source/lab-assets')
      done()
    })

  if (!isProd) {
    gulp.watch([
      '../pattern-lab/source/_base/scss/*/*.{scss,sass}',
      '../pattern-lab/source/_patterns/*/*/scss/*.{scss,sass}',
    ], function (done) {
      patternLab.buildCssDependencies(location, isProd)
        .then(() => {
          patternLab.buildPatternLabAssets(location, '../pattern-lab/source/lab-assets')
          done()
        })
    })

    gulp.watch([
      '../pattern-lab/source/_patterns/*/*/js/*.js',
    ], function (done) {
      patternLab.buildJsDependencies(location, isProd)
        .then(() => {
          patternLab.buildPatternLabAssets(location, '../pattern-lab/source/lab-assets')
          done()
        })
    })
  }
})

gulp.task('copy-pattern-lab', function (done) {
  const destination = '../docroot/themes/custom/custom_theme'
  const location = '../pattern-lab/source/_patterns';
  const promises = []

  promises.push(patternLab.buildDependencies(location, isProd))

  try {
    const destinationDir = fs.statSync(destination + '/patterns')

    if (destinationDir.isDirectory()) {
      promises.push(builder.clearDestinationDirectory(destination + '/patterns'))
    }
  }
  catch (err) {

  }

  Promise.all(promises)
    .then(() => {

      builder.copyPatternType(location, '01-pages', destination + '/patterns/01-pages');
      builder.copyPatternType(location, '02-sections', destination + '/patterns/02-sections');
      builder.copyPatternType(location, '03-blocks', destination + '/patterns/03-blocks');
      builder.copyPatternType(location, '04-elements', destination + '/patterns/04-elements');

      gulp.src(location + '/../assets/css/*.css')
        .pipe(replace('/assets/images/', '/themes/custom/' + themeFolder + '/assets/images/'))
        .pipe(replace('../../assets/fonts/', '../assets/fonts/'))
        .pipe(gulp.dest(destination + '/css'))

      gulp.src(location + '/../assets/js/*.js')
        .pipe(gulp.dest(destination + '/js'))

      gulp.src(location + '/../assets/images/**/*')
        .pipe(gulp.dest(destination + '/assets/images'))

      gulp.src(location + '/../assets/fonts/**/*')
        .pipe(gulp.dest(destination + '/assets/fonts'))

      done();

    })
    .catch((error) => {
      console.log(error)
    })
})


gulp.task('prod', function (done) {
  done()
});
