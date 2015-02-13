'use strict'

var gulp = require('gulp')
  , $ = require('gulp-load-plugins')()

gulp.task('styles', function () {
  return gulp.src('css/*.css')
    .pipe($.plumber())
    .pipe($.myth())
    .pipe($.minifyCss({
      keepSpecialComments: false
    }))
    .pipe(gulp.dest('dist/css'))
    .pipe($.livereload())
    .pipe($.size({
      title: 'styles'
    , showFiles: true
    }))
})

gulp.task('scripts', function () {
  var browserify = require('browserify')
    , to5ify = require('6to5ify')
    , source = require('vinyl-source-stream')
    , buffer = require('vinyl-buffer')

  return browserify()
    .transform(to5ify)
    .require('./js/modem.js', {
      entry: true
    })
    .bundle()
    .on('error', function (err) {
      $.util.log(err.message)
      this.emit('end')
    })
    .pipe(source('modem.js'))
    .pipe(buffer())
    .pipe($.plumber())
    .pipe($.uglify({
      preserveComments: false
    }))
    .pipe(gulp.dest('dist/js'))
    .pipe($.livereload())
    .pipe($.size({
      title: 'scripts'
    , showFiles: true
    }))
})

gulp.task('images', function () {
  return gulp.src('img/**')
    .pipe($.plumber())
    .pipe(gulp.dest('dist/img'))
})

gulp.task('fonts', function () {
  return gulp.src('fonts/*')
    .pipe($.plumber())
    .pipe(gulp.dest('dist/fonts'))
})

gulp.task('copy', function () {
  return gulp.src([
    'favicon.ico'
  , 'lib/**'
  , 'audio/*'
  ], {
    base: './'
  })
    .pipe($.if('*.css', $.minifyCss({
      keepSpecialComments: false
    })))
    .pipe($.if('*.js', $.uglify({
      preserveComments: false
    })))
    .pipe(gulp.dest('dist'))
})

gulp.task('styleguide', ['copy'], function () {
  return gulp.src('config.yml')
    .pipe($.plumber())
    .pipe($.hologram())
})

gulp.task('build', [
  'styles'
, 'scripts'
, 'images'
, 'fonts'
, 'styleguide'
])

gulp.task('serve', ['build'], function () {
  return gulp.src('dist')
    .pipe($.plumber())
    .pipe($.webserver({
      open: true
    , livereload: true
    }))
})

gulp.task('watch', ['serve'], function () {
  $.livereload.listen()

  gulp.watch('css/**/*.css', ['styles', 'styleguide'])
  gulp.watch('js/**/*.js', ['scripts'])
  gulp.watch('tpl/**/*.html', ['styleguide'])
})

gulp.task('deploy', ['build'], function () {
  return gulp.src('dist/**')
    .pipe($.plumber())
    .pipe($.ghPages())
    .pipe($.size())
})
