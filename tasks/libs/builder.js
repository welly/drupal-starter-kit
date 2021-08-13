const fs      = require('fs')
const path    = require('path')
const gulp    = require('gulp')
const header  = require('gulp-header');
const rename  = require('gulp-rename')
const replace = require('gulp-replace')
const YAML    = require('yaml')

exports.clearDestinationDirectory = (directory) => {
  return clearDirectory(directory)
}

function clearDirectory(directory) {
  return new Promise((resolve, reject) => {
    readDirectory(directory)
      .then((directoryFiles) => {
        const promises = []


        directoryFiles.forEach((directoryFile) => {
          const directoryFilePath = directory + '/' + directoryFile;
          const file = fs.statSync(directoryFilePath)

          if (file.isDirectory()) {
            promises.push(clearDirectory(directoryFilePath))
          }
          else {
            fs.unlinkSync(directoryFilePath)
          }
        })

        if (promises.length) {
          Promise.all(promises)
            .then(() => {
              fs.rmdir(directory, (err) => {
                if (err) {
                  reject(err)
                }
                else {
                  resolve()
                }
              })

            })
        }
        else {
          fs.rmdir(directory, (err) => {
            if (err) {
              reject(err)
            }
            else {
              resolve()
            }
          })
        }
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}

exports.copyPatternType = (basePath, directory, destination) => {
  const parentDirectory = basePath + '/' + directory

  readDirectory(parentDirectory)
    .then((directoryFiles) => {
      directoryFiles.forEach((directoryFile) => {
        const directoryFilePath = parentDirectory + '/' + directoryFile;
        const relativePath      = directory + '/' + directoryFile;

        fs.stat(directoryFilePath, (err, file) => {
          if (err) {
            console.error('error reading directory', directoryFile)
          }
          else {
            if (file.isDirectory()) {
              processPatternDirectory(parentDirectory, destination, directoryFile, relativePath)
            }
          }
        })
      })
    })
    .catch((error) => {
      console.log(error)
    })
}

/**
 * Move the pattern CSS files.
 *
 * @param {string} sourceDirectory
 *   The pattern source directory
 * @param {string} destinationDirectory
 *   The pattern destination directory
 */
function moveCssFiles(sourceDirectory, destinationDirectory) {
  return new Promise((resolve, reject) => {
    const movedFiles = []

    gulp.src(sourceDirectory + '/dist/*.css')
      .pipe(
        rename(function (file) {
          movedFiles.push(file.basename + '.css')
        })
      )
      .pipe(replace('/assets/images/', '/themes/custom/custom_theme/assets/images/'))
      .pipe(gulp.dest(destinationDirectory + '/css'))
      .on('end', () => {
        resolve(movedFiles)
      })
  })
}


/**
 * Move the pattern JS files.
 *
 * @param {string} sourceDirectory
 *   The pattern source directory
 * @param {string} destinationDirectory
 *   The pattern destination directory
 */
function moveJsFiles(sourceDirectory, destinationDirectory) {
  return new Promise((resolve, reject) => {
    const movedFiles = []

    gulp.src(sourceDirectory + '/dist/*.js')
      .pipe(
        rename(function (file) {
          movedFiles.push(file.basename + '.js')
        })
      )
      .pipe(gulp.dest(destinationDirectory + '/js'))
      .on('end', () => {
        resolve(movedFiles)
      })

  })
}

/**
 * Move the pattern Twig files.
 *
 * @param {string} patternName
 *   The name of the pattern being processed.
 * @param {string} sourceDirectory
 *   The pattern source directory
 * @param {string} destinationDirectory
 *   The pattern destination directory
 */
function moveTwigFiles(patternName, sourceDirectory, destinationDirectory) {
  return new Promise((resolve, reject) => {
    const movedFiles = []

    gulp.src(sourceDirectory + '/_*.html.twig')
      .pipe(header("{{ attach_library('custom_theme/" + patternName + "') }}\n"))
      .pipe(
        rename(function (file) {
        })
      )
      .pipe(gulp.dest(destinationDirectory))
      .on('end', () => {
        resolve(movedFiles)
      })

  })
}

/**
 * Get the nice name for the given file name.
 *
 * @param {string} fileName
 *   The filename to process,
 *
 * @return {string}
 *   The file name with the number prefix removed.
 */
function niceNameGet(fileName) {
  return fileName.replace(/[0-9]+-/gi, '')
}

/**
 * Process the given pattern directory.
 *
 * @param {string} sourceDirectory
 *   The pattern source directory
 * @param {string} destinationDirectory
 *   The pattern destination directory
 * @param {string} patternName
 *   The name of the pattern being processed.
 * @param {string} relativePath
 *   The the relative path.
 */
function processPatternDirectory(sourceDirectory, destinationDirectory, patternName, relativePath) {
  console.log('\u001b[32m', 'processing pattern ' + patternName, '\u001b[0m');

  const promises       = []
  sourceDirectory      = sourceDirectory + '/' + patternName
  destinationDirectory = destinationDirectory + '/' + patternName

  promises.push(moveCssFiles(sourceDirectory, destinationDirectory))
  promises.push(moveJsFiles(sourceDirectory, destinationDirectory))
  promises.push(moveTwigFiles(niceNameGet(patternName), sourceDirectory, destinationDirectory))

  Promise.all(promises)
    .then((data) => {
      ymlBuild(niceNameGet(patternName), sourceDirectory, destinationDirectory, data[0], data[1], relativePath)
    })
    .catch((error) => {
    })
}

/**
 * Iterate through the given directory
 *
 * @param {string} directoryPath
 *   The directory to parse.
 *
 * @returns {Promise<any>}
 *   A promise that the directory items will be returned.
 */
function readDirectory(directoryPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(directoryPath, (err, items) => {
      if (err) {
        reject(err)
      }

      resolve(items)
    })
  })
}

/**
 * Build the YML files.
 *
 * @param {string} patternName
 *   The name of the pattern being processed.
 * @param {string} sourceDirectory
 *   The pattern source directory
 * @param {string} destinationDirectory
 *   The pattern destination directory
 * @param {array} cssFiles
 *   An array of CSS files to include as libraries.
 * @param {array} jsFiles
 *   An array of JS files to include as libraries.
 * @param {string} relativePath
 *   The the relative path.
 */
function ymlBuild(patternName, sourceDirectory, destinationDirectory, cssFiles, jsFiles, relativePath) {
  console.log('Building libraries for pattern ' + patternName)

  const destination = destinationDirectory + '/' + patternName + '.libraries.yml'
  const yml = buildYmlStructure(patternName, cssFiles, jsFiles, relativePath);

  if (yml !== false) {
    // console.log(yml)
    fs.writeFile(destination, YAML.stringify(yml), 'utf8', () => {});
  }
}

/**
 * Build the YML structure form the given data.
 *
 * @param {string} patternNiceName
 *   The name of the pattern being processed.
 * @param {array} cssFiles
 *   An array of CSS files to include as libraries.
 * @param {array} jsFiles
 *   An array of JS files to include as libraries.
 * @param {string} relativePath
 *   The the relative path.
 */
function buildYmlStructure(patternNiceName, cssFiles, jsFiles, relativePath) {
  if ((cssFiles.length) || (jsFiles.length) ) {
    const yml = {}
    yml[patternNiceName] = {}

    if (cssFiles.length) {
      yml[patternNiceName].css = {
        component: {}
      }

      cssFiles.forEach((cssFile) => {
        yml[patternNiceName].css.component['patterns/' + relativePath + '/css/' + cssFile] = {}
      })
    }

    if (jsFiles.length) {
      yml[patternNiceName].js = {}

      jsFiles.forEach((jsFile) => {
        yml[patternNiceName].js['patterns/' + relativePath + '/js/' + jsFile] = {}
      })
    }

    return yml;
  }
  else {
    return false;
  }
}
