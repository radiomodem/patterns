"use strict"

var gulp = require("gulp")
  , $ = require("gulp-load-plugins")()

gulp.task("css", ["css:clean"], function () {
  return gulp.src("css/*.css")
    .pipe($.plumber())
    .pipe($.myth())
    .pipe($.minifyCss({
      keepSpecialComments: false
    }))
    .pipe(gulp.dest("dist/css"))
    .pipe($.livereload())
    .pipe($.size({
      title: "css"
    , showFiles: true
    }))
})

gulp.task("css:clean", function () {
  return gulp.src("dist/css")
    .pipe($.plumber())
    .pipe($.rimraf())
})

gulp.task("js", ["js:clean"], function () {
  var browserify = require("browserify")
    , to5ify = require("6to5ify")
    , source = require("vinyl-source-stream")
    , buffer = require("vinyl-buffer")

  return browserify()
    .transform(to5ify)
    .require("./js/modem.js", {
      entry: true
    })
    .bundle()
    .on("error", function (err) {
      $.util.log(err.message)
      this.emit("end")
    })
    .pipe(source("modem.js"))
    .pipe(buffer())
    .pipe($.plumber())
    .pipe($.uglify({
      preserveComments: false
    }))
    .pipe(gulp.dest("dist/js"))
    .pipe($.livereload())
    .pipe($.size({
      title: "js"
    , showFiles: true
    }))
})

gulp.task("js:clean", function () {
  return gulp.src("dist/js")
    .pipe($.plumber())
    .pipe($.rimraf())
})

gulp.task("img", ["img:clean"], function () {
  return gulp.src("img/**")
    .pipe($.plumber())
    .pipe(gulp.dest("dist/img"))
    .pipe($.size({
      title: "img"
    , showFiles: true
    }))
})

gulp.task("img:clean", function () {
  return gulp.src("dist/img")
    .pipe($.plumber())
    .pipe($.rimraf())
})

gulp.task("fonts", ["fonts:clean"], function () {
  return gulp.src("fonts/*")
    .pipe($.plumber())
    .pipe(gulp.dest("dist/fonts"))
})

gulp.task("fonts:clean", function () {
  return gulp.src("dist/fonts")
    .pipe($.plumber())
    .pipe($.rimraf())
})

gulp.task("copy", function () {
  return gulp.src([
    "favicon.ico"
  , "lib/**"
  , "audio/*"
  ], {
    base: "./"
  })
    .pipe($.if("*.css", $.minifyCss({
      keepSpecialComments: false
    })))
    .pipe($.if("*.js", $.uglify({
      preserveComments: false
    })))
    .pipe(gulp.dest("dist"))
})

gulp.task("styleguide", ["copy"], function () {
  return gulp.src("config.yml")
    .pipe($.plumber())
    .pipe($.hologram())
})

gulp.task("html", ["styleguide"], function () {
  return gulp.src("dist/**/*.html")
    .pipe($.plumber())
    .pipe($.minifyHtml())
    .pipe(gulp.dest("dist"))
    .pipe($.size({
      title: "html"
    , showFiles: true
    }))
})

gulp.task("build", [
  "css"
, "js"
, "img"
, "fonts"
, "html"
])

gulp.task("default", ["build"])

gulp.task("serve", ["build"], function () {
  return gulp.src("dist")
    .pipe($.plumber())
    .pipe($.webserver({
      open: true
    , livereload: true
    }))
})

gulp.task("watch", ["serve"], function () {
  $.livereload.listen()

  gulp.watch("css/**/*.css", ["css", "html"])
  gulp.watch("js/**/*.js", ["js"])
  gulp.watch("tpl/**/*.html", ["html"])
})

gulp.task("deploy", ["deploy:clean", "build"], function () {
  return gulp.src("dist/**/*")
    .pipe($.plumber())
    .pipe($.ghPages({
      remoteUrl: "git@github.com:radio-modem/patterns.git"
    , branch: "gh-pages"
    , cacheDir: ".tmp"
    }))
})

gulp.task("deploy:clean", function () {
  return gulp.src(".tmp")
    .pipe($.plumber())
    .pipe($.rimraf())
})
