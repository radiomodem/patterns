const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const del = require('del');

gulp.task('css', ['css:clean'], () => {
  return gulp.src('css/*.css')
    .pipe($.plumber())
    .pipe($.cssnext({
      sourcemap: true
    }))
    .pipe($.csslint('css/.csslintrc'))
    .pipe($.csslint.reporter())
    .pipe($.csslint.reporter('fail'))
    .pipe($.sourcemaps.init({
      loadMaps: true
    }))
    .pipe($.minifyCss({
      keepSpecialComments: false
    }))
    .pipe($.sourcemaps.write('.', {
      sourceRoot: '/src/css'
    }))
    .pipe(gulp.dest('dist/css'))
    .pipe($.livereload())
    .pipe($.size({
      title: 'css',
      showFiles: true
    }));
});

gulp.task('css:clean', done => {
  del(['dist/css'], done);
});

gulp.task('css:stats', ['css'], () => {
  return gulp.src('dist/css/*.css')
    .pipe($.plumber())
    .pipe($.parker());
});

gulp.task('js', ['js:clean'], () => {
  return gulp.src('js/**/*.js')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.babel({
      modules: 'umd',
      moduleIds: true
    }))
    .pipe($.concat('modem.js'))
    .pipe($.uglify({
      preserveComments: false
    }))
    .pipe($.sourcemaps.write('.', {
      sourceRoot: '/src/js'
    }))
    .pipe(gulp.dest('dist/js'))
    .pipe($.livereload())
    .pipe($.size({
      title: 'js',
      showFiles: true
    }));
});

gulp.task('js:clean', done => {
  del(['dist/js'], done);
});

gulp.task('img', ['img:clean'], () => {
  return gulp.src('img/**')
    .pipe($.plumber())
    .pipe($.changed('dist/img'))
    .pipe($.imagemin({
      svgoPlugins: [
        {removeTitle: true},
        {removeDesc: true}
      ]
    }))
    .pipe(gulp.dest('dist/img'))
    .pipe($.size({
      title: 'img',
      showFiles: true
    }));
});

gulp.task('img:clean', done => {
  del(['dist/img'], done);
});

gulp.task('styleguide', () => {
  return gulp.src('config.yml')
    .pipe($.plumber())
    .pipe($.hologram());
});

gulp.task('html', ['styleguide'], () => {
  return gulp.src('dist/**/*.html')
    .pipe($.plumber())
    .pipe($.minifyHtml())
    .pipe(gulp.dest('dist'))
    .pipe($.livereload())
    .pipe($.size({
      title: 'html',
      showFiles: true
    }));
});

gulp.task('copy', () => {
  return gulp.src([
    'favicon.ico',
    'CNAME',
    'lib/**',
    'audio/*'
  ], {
    base: '.'
  })
    .pipe($.plumber())
    .pipe($.changed('dist'))
    .pipe($.if('*.css', $.minifyCss({
      keepSpecialComments: false
    })))
    .pipe($.if('*.js', $.uglify({
      preserveComments: false
    })))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', [
  'css',
  'js',
  'img',
  'html',
  'copy'
]);

gulp.task('default', ['build']);

gulp.task('watch', ['build'], () => {
  $.livereload.listen();

  gulp.watch('css/**/*.css', ['css', 'html']);
  gulp.watch('css/*.md', ['html']);
  gulp.watch('js/**/*.js', ['js']);
  gulp.watch('tpl/**/*.html', ['html']);
});

gulp.task('serve', ['watch'], () => {
  return gulp.src('dist')
    .pipe($.plumber())
    .pipe($.webserver({
      open: true,
      livereload: true
    }));
});

gulp.task('deploy', ['deploy:clean', 'build'], () => {
  return gulp.src('dist/**/*')
    .pipe($.plumber())
    .pipe($.ghPages({
      branch: 'gh-pages',
      cacheDir: '.tmp',
      force: true
    }))
    .pipe($.size({
      title: 'deploy'
    }));
});

gulp.task('deploy:clean', done => {
  del(['.tmp'], done);
});
