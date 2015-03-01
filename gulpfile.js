"use strict"

var gulp = require("gulp")
  , $ = require("gulp-load-plugins")()
  , del = require("del")

var copyright = [
  "/*!"
, " * Copyright (c) 2015 Modem."
, " *"
, " * Permission is hereby granted, free of charge, to any person obtaining a copy"
, " * of this software and associated documentation files (the \"Software\"), to"
, " * deal in the Software without restriction, including without limitation the"
, " * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or"
, " * sell copies of the Software, and to permit persons to whom the Software is"
, " * furnished to do so, subject to the following conditions:"
, " *"
, " * The above copyright notice and this permission notice shall be included in"
, " * all copies or substantial portions of the Software."
, " *"
, " * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR"
, " * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,"
, " * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE"
, " * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER"
, " * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING"
, " * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER"
, " * DEALINGS IN THE SOFTWARE."
, " */"
]

gulp.task("css", ["css:clean"], function () {
  return gulp.src("css/*.css")
    .pipe($.plumber())
    .pipe($.myth())
    .pipe($.minifyCss({
      keepSpecialComments: false
    }))
    .pipe($.header(copyright.join("\n") + "\n"))
    .pipe(gulp.dest("dist/css"))
    .pipe($.livereload())
    .pipe($.size({
      title: "css"
    , showFiles: true
    }))
})

gulp.task("css:clean", function (done) {
  del(["dist/css"], done)
})

gulp.task("js", ["js:clean"], function () {
  return gulp.src("js/**/*.js")
    .pipe($.plumber())
    .pipe($.babel({
      modules: "umd"
    , moduleIds: true
    }))
    .pipe($.concat("modem.js"))
    .pipe($.uglify({
      preserveComments: false
    }))
    .pipe($.header(copyright.join("\n") + "\n"))
    .pipe(gulp.dest("dist/js"))
    .pipe($.livereload())
    .pipe($.size({
      title: "js"
    , showFiles: true
    }))
})

gulp.task("js:clean", function (done) {
  del(["dist/js"], done)
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

gulp.task("img:clean", function (done) {
  del(["dist/img"], done)
})

gulp.task("fonts", ["fonts:clean"], function () {
  return gulp.src("fonts/*")
    .pipe($.plumber())
    .pipe(gulp.dest("dist/fonts"))
})

gulp.task("fonts:clean", function (done) {
  del(["dist/fonts"], done)
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
    .pipe($.livereload())
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
      branch: "gh-pages"
    , cacheDir: ".tmp"
    }))
})

gulp.task("deploy:clean", function (done) {
  del([".tmp"], done)
})

gulp.task("analyse:css", function () {
  return gulp.src("dist/css/*.css")
    .pipe($.plumber())
    .pipe($.parker())
})
