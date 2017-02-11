const gulp = require('gulp')
const util = require('gulp-util')
const concat = require('gulp-concat')
const rename = require('gulp-rename')
const uglify = require('gulp-uglify')
const babel = require('gulp-babel')

// Build by default
gulp.task('default', ['build'])

// The build task
gulp.task('build', function () {
  gulp.src(['src/**/*.js', 'node_modules/sat/SAT.js'])
    .pipe(concat('arcade-polygons-plugin.js'))
    .pipe(babel({
      presets: ['es2015']
    }))
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
