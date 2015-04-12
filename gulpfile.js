"use strict"

var gulp = require("gulp")
  , $ = require("gulp-load-plugins")()
  , del = require("del")

gulp.task("css", ["css:clean"], function () {
  return gulp.src("css/*.css")
    .pipe($.plumber())
    .pipe($.myth({
      sourcemap: true
    }))
    .pipe($.csslint("css/.csslintrc"))
    .pipe($.csslint.reporter())
    .pipe($.csslint.reporter("fail"))
    .pipe($.sourcemaps.init({
      loadMaps: true
    }))
    .pipe($.minifyCss({
      keepSpecialComments: false
    }))
    .pipe($.sourcemaps.write("./", {
      sourceRoot: "/src/css"
    }))
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

gulp.task("css:stats", ["css"], function () {
  return gulp.src("dist/css/*.css")
    .pipe($.plumber())
    .pipe($.parker())
})

gulp.task("js", ["js:clean"], function () {
  return gulp.src("js/**/*.js")
    .pipe($.plumber())
    .pipe($.jshint("js/.jshintrc"))
    .pipe($.jshint.reporter())
    .pipe($.jshint.reporter("fail"))
    .pipe($.sourcemaps.init())
    .pipe($.babel({
      modules: "umd"
    , moduleIds: true
    }))
    .pipe($.concat("modem.js"))
    .pipe($.uglify({
      preserveComments: false
    }))
    .pipe($.sourcemaps.write("./", {
      sourceRoot: "/src/js"
    }))
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
    .pipe($.changed("dist/img"))
    .pipe(gulp.dest("dist/img"))
    .pipe($.size({
      title: "img"
    , showFiles: true
    }))
})

gulp.task("img:clean", function (done) {
  del(["dist/img"], done)
})

gulp.task("styleguide", function () {
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

gulp.task("copy", function () {
  return gulp.src([
    "favicon.ico"
  , "lib/**"
  , "audio/*"
  ], {
    base: "./"
  })
    .pipe($.plumber())
    .pipe($.changed("dist"))
    .pipe($.if("*.css", $.minifyCss({
      keepSpecialComments: false
    })))
    .pipe($.if("*.js", $.uglify({
      preserveComments: false
    })))
    .pipe(gulp.dest("dist"))
})

gulp.task("build", [
  "css"
, "js"
, "img"
, "html"
, "copy"
])

gulp.task("default", ["build"])

gulp.task("watch", ["build"], function () {
  $.livereload.listen()

  gulp.watch("css/**/*.css", ["css", "html"])
  gulp.watch("css/*.md", ["html"])
  gulp.watch("js/**/*.js", ["js"])
  gulp.watch("tpl/**/*.html", ["html"])
})

gulp.task("serve", ["watch"], function () {
  return gulp.src("dist")
    .pipe($.plumber())
    .pipe($.webserver({
      open: true
    , livereload: true
    }))
})

gulp.task("deploy", ["deploy:clean", "build"], function () {
  return gulp.src("dist/**/*")
    .pipe($.plumber())
    .pipe($.ghPages({
      branch: "gh-pages"
    , cacheDir: ".tmp"
    , force: true
    }))
})

gulp.task("deploy:clean", function (done) {
  del([".tmp"], done)
})
