const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const del = require('del');

gulp.task('css', ['css:clean'], () => gulp.src('css/*.css')
  .pipe($.plumber())
  .pipe($.sourcemaps.init())
  .pipe($.postcss([
    require('postcss-import')(),
    require('postcss-url')(),
    require('postcss-cssnext')(),
    require('postcss-reporter')()
  ]))
  .pipe($.cssnano())
  .pipe($.sourcemaps.write('.', {
    sourceRoot: '/src/css'
  }))
  .pipe(gulp.dest('dist/css'))
  .pipe($.livereload())
  .pipe($.size({
    title: 'css',
    showFiles: true
  }))
);

gulp.task('css:clean', () => del(['dist/css']));

gulp.task('js', ['js:clean'], () => gulp.src('js/**/*.js')
  .pipe($.plumber())
  .pipe($.xo())
  .pipe($.rollup({
    format: 'amd',
    moduleId: 'modem',
    sourceMap: true,
    external: [
      'jquery'
    ],
    globals: {
      jquery: '$'
    }
  }))
  .pipe($.sourcemaps.init({
    loadMaps: true
  }))
  .pipe($.babel())
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
  }))
);

gulp.task('js:clean', () => del(['dist/js']));

gulp.task('img', ['img:clean'], () => gulp.src('img/**')
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
  }))
);

gulp.task('img:clean', () => del(['dist/img']));

gulp.task('styleguide', () => gulp.src('config.yml')
  .pipe($.plumber())
  .pipe($.hologram())
);

gulp.task('html', ['styleguide'], () => gulp.src('dist/**/*.html')
  .pipe($.plumber())
  .pipe($.htmlmin())
  .pipe(gulp.dest('dist'))
  .pipe($.livereload())
  .pipe($.size({
    title: 'html',
    showFiles: true
  }))
);

gulp.task('copy', () => gulp.src([
  'favicon.ico',
  'CNAME',
  'audio/*'
], {
  base: '.'
})
  .pipe($.plumber())
  .pipe($.changed('dist'))
  .pipe(gulp.dest('dist'))
);

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

gulp.task('serve', ['watch'], () => gulp.src('dist')
  .pipe($.plumber())
  .pipe($.webserver({
    open: true,
    livereload: true
  }))
);

gulp.task('deploy', ['deploy:clean', 'build'], () => gulp.src('dist/**/*')
  .pipe($.plumber())
  .pipe($.ghPages({
    branch: 'gh-pages',
    cacheDir: '.tmp',
    force: true
  }))
  .pipe($.size({
    title: 'deploy'
  }))
);

gulp.task('deploy:clean', () => del(['.tmp']));
