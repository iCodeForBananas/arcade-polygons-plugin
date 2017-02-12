const gulp = require('gulp')
const util = require('gulp-util')
const rename = require('gulp-rename')
const uglify = require('gulp-uglify')
const browserify = require('gulp-browserify')

// Build by default
gulp.task('default', ['build'])

// The build task
gulp.task('build', function () {
  gulp.src('src/ArcadePolygons.js')
    .pipe(browserify({
      transform: ['babelify'],
      extensions: ['.js']
    }))
    .pipe(rename({
      basename: 'arcade-polygons-plugin'
    }))
    .pipe(gulp.dest('dist'))
    .pipe(uglify())
    .on('error', util.log)
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist'))
})

// The watch task
gulp.task('watch', function () {
  gulp.watch('src/**/*.js', ['build'])
})
