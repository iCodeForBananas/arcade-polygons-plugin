const gulp = require('gulp')
const util = require('gulp-util')
const concat = require('gulp-concat')
const rename = require('gulp-rename')
const uglify = require('gulp-uglify')

// Build by default
gulp.task('default', ['build'])

// The build task
gulp.task('build', function () {
  gulp.src(['node_modules/sat/SAT.js', 'src/**/*.js'])
    .pipe(concat('arcade-polygons-plugin.js'))
    .pipe(gulp.dest('dist'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .on('error', util.log)
    .pipe(gulp.dest('dist'))
})

// The watch task
gulp.task('watch', function () {
  gulp.watch('src/**/*.js', ['build'])
})
