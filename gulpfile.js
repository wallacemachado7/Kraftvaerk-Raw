const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const webp = require('gulp-webp');
const htmlmin = require('gulp-htmlmin');
const tiny = require('gulp-tiny');
const gulpCopy = require('gulp-copy');
const fileinclude = require('gulp-file-include');
const version = require('gulp-version-number');
const svgmin = require('gulp-svgmin');
const rename = require('gulp-rename');
const gulpIgnore = require('gulp-ignore');
const replace = require('gulp-replace');

function htmlModify() {
  return gulp
    .src(['./**/*.html', '!./node_modules/**', '!./build/**', '!./cache/**', '!./css/**', '!./img/**', '!./js/**', '!./libs-not-used/**', '!./scss/**'])
    .pipe(
      fileinclude({
        prefix: '@@',
        basepath: '@file',
      })
    )
    .pipe(
      version({
        value: '%TS%',
        append: {
          key: 'v',
          to: ['css', 'js'],
        },
      })
    )
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build/'));
}
gulp.task('htmlminify', htmlModify);

function copyFile() {
  return gulp.src('./*.{png,jpg,jpeg}').pipe(gulpCopy('build/'));
}
gulp.task('copyfile', copyFile);

function copyFonts() {
  return gulp.src('./fonts/**').pipe(gulpCopy('build/'));
}
gulp.task('copyfonts', copyFonts);

function copyFakeApi() {
  return gulp
    .src('./fake-api.json', { allowEmpty: true })
    .pipe(gulpCopy('build/'));
}
gulp.task('copyfakeapi', copyFakeApi);

function tinyPng() {
  return gulp
    .src('./img/**/*.{png,jpg,jpeg}')
    .pipe(
      tiny({
        apiKey: [
          '5dJy9lQRSff7TtmRcD037qJy7v7yQFk5', // Wallace
          'BvB4ZdlC9rtLkcb8nKw1mK3kHvypKbRq', // Allan
          'JxT2Gz61pXf2PMZDLCNlT2B5d1Fq5jDT', // Lucas
        ],
        cache: true,
        log: false,
      })
    )
    .pipe(gulp.dest('build/img/'));
}
gulp.task('tinypng', tinyPng);

function webpimg() {
  return gulp
    .src(['./img/**/*.{jpg,png,tiff}'])
    .pipe(webp({ quality: 95 }))
    .pipe(gulp.dest('img/'))
    .pipe(gulp.dest('build/img/'))
    .pipe(browserSync.stream());
}
gulp.task('webpconverter', webpimg);

function minifySvg() {
  return gulp
    .src(['./img/**/*.svg'])
    .pipe(svgmin())
    .pipe(gulp.dest('build/img/'));
}
gulp.task('minifysvg', minifySvg);

function compilaSass() {
  return gulp
    .src('./scss/**/*.scss')
    .pipe(
      sass({
        outputStyle: 'compressed',
      })
    )
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 3 versions'],
        cascade: false,
      })
    )
    .pipe(gulp.dest('css/'))
    .pipe(gulp.dest('build/css/'))
    .pipe(browserSync.stream());
}
gulp.task('sass', compilaSass);

function gulpJS() {
  return gulp
    .src('./js/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('build/js/'))
    .pipe(browserSync.stream());
}
gulp.task('mainjs', gulpJS);

function gulpCss() {
  return gulp
    .src('./css/libs/**/*.css')
    .pipe(gulp.dest('build/css/libs/'))
    .pipe(browserSync.stream());
}
gulp.task('libCss', gulpCss);

function pluginJS() {
  return gulp
    .src('./js/libs/**/*.js')
    .pipe(gulp.dest('build/js/libs/'))
    .pipe(browserSync.stream());
}
// function pluginCSS() {
//   return gulp
//     .src('./lib/**/*.css')
//     .pipe(gulp.dest('css/lib/'))
//     .pipe(gulp.dest('build/css/lib/'))
//     .pipe(browserSync.stream());
// }
gulp.task('pluginjs', pluginJS);
// gulp.task('plugincss', pluginCSS);

function browser() {
  setTimeout(() => {
    browserSync.init({
      server: {
        baseDir: './build',
      },
    });
  }, 500);
}
gulp.task('browser-sync', browser);

function watch() {
  gulp.watch('./scss/**/*.scss', compilaSass);
  gulp.watch('./scss/**/*.scss', htmlModify);
  gulp.watch('./js/**/*.js', gulpJS);
  gulp.watch('lib/**/*.js', pluginJS);
  // gulp.watch('lib/**/*.css', pluginCSS);
  gulp.watch('./css/libs/**/*.css', gulpCss);
  gulp.watch('./js/**/*.js', htmlModify);
  gulp.watch('./*.html', htmlModify);
  gulp.watch('./fake-api.json', copyFakeApi);
  gulp.watch('./img/**/*.svg', minifySvg);
  gulp.watch('./img/**/*.{jpg,png,tiff}', webpimg);
  gulp.watch('./img/**/*.{jpg,png,tiff}', tinyPng);
  gulp.watch('./*.{jpg,png,tiff}', copyFile);
  gulp.watch(['*.html']).on('change', browserSync.reload);
}

gulp.task('watch', watch);

gulp.task(
  'default',
  gulp.parallel(
    'minifysvg',
    'copyfile',
    'htmlminify',
    'copyfakeapi',
    'copyfonts',
    'watch',
    'browser-sync',
    'sass',
    'mainjs',
    'pluginjs',
    'libCss'
  )
);
gulp.task(
  'build',
  gulp.parallel(
    'webpconverter',
    'minifysvg',
    'copyfile',
    'htmlminify',
    'copyfakeapi',
    'tinypng',
    'sass',
    'mainjs',
    'pluginjs',
    'libCss'
  )
);

// #region WordPress
function tinyPngWp() {
  return gulp
    .src('./img/**/*.{png,jpg,jpeg}')
    .pipe(
      tiny({
        apiKey: [
          '5dJy9lQRSff7TtmRcD037qJy7v7yQFk5', // Wallace
          'BvB4ZdlC9rtLkcb8nKw1mK3kHvypKbRq', // Allan
          'JxT2Gz61pXf2PMZDLCNlT2B5d1Fq5jDT', // Lucas
        ],
        cache: true,
        log: false,
      })
    )
    .pipe(gulp.dest('./img'));
}
gulp.task('tinypngwp', tinyPngWp);
function webpimgWp() {
  return gulp
    .src(['./img/**/*.{jpg,png,tiff}'])
    .pipe(webp({ quality: 95 }))
    .pipe(gulp.dest('./img/'))
    .pipe(browserSync.stream());
}
gulp.task('webpconverterwp', webpimgWp);
function gulpJSWP() {
  function condition(file) {
    return file.path.includes('.min') || file.path.includes('lib');
  }
  return gulp
    .src('./js/**/*.js')
    .pipe(gulpIgnore.exclude(condition))
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    .pipe(uglify())
    .pipe(
      rename(function (path) {
        path.extname = '.min.js';
      })
    )
    .pipe(gulp.dest('./js'))
    .pipe(browserSync.stream());
}
function gulpJSLibsWP() {
  function condition(file) {
    return file.path.includes('.min');
  }
  return gulp
    .src('./js/libs/**/*.js')
    .pipe(gulpIgnore.exclude(condition))
    .pipe(
      rename(function (path) {
        path.extname = '.min.js';
      })
    )
    .pipe(gulp.dest('./js/libs'))
    .pipe(browserSync.stream());
}
function gulpCSSWP() {
  function condition(file) {
    return file.path.includes('.min');
  }
  return gulp
    .src('./css/**/*.css')
    .pipe(gulpIgnore.exclude(condition))
    .pipe(
      rename(function (path) {
        path.extname = '.min.css';
      })
    )
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.stream());
}
function phpModify() {
  const unique = new Date().getTime();
  return gulp
    .src(['./header.php', './footer.php'])
    .pipe(
      replace(/\.min\.js(.*)">/g, `.min.js?v=${unique}">`)
    )
    .pipe(
      replace(/\.css(.*)">/g, `.css?v=${unique}">`)
    ).pipe(gulp.dest('./'))
    .pipe(browserSync.stream());
}
gulp.task('phpmodify', phpModify);
gulp.task('maincsswp', gulpCSSWP);
gulp.task('mainjswp', gulpJSWP);
gulp.task('mainjslibswp', gulpJSLibsWP);
function browserWP() {
  setTimeout(() => {
    browserSync.init({
      server: {
        baseDir: './',
      },
    });
  }, 500);
}
gulp.task('browser-syncWP', browserWP);
function watchWp() {
  gulp.watch('./scss/**/*.scss', compilaSass);
  gulp.watch(['./js/libs/**/*.js', '!./js/libs/**/*.min.js'], gulpJSLibsWP);
  gulp.watch(
    ['./js/**/*.js', '!./js/**/*.min.js', '!./js/libs/**/*.min.js'],
    gulpJSWP
  );
  gulp.watch(
    ['./js/**/*.js', '!./js/**/*.min.js', '!./js/libs/**/*.min.js'],
    phpModify
  );
  gulp.watch(['./css/**/*.css', '!./css/**/*.min.css'], gulpCSSWP);
  gulp.watch(['./css/**/*.css', '!./css/**/*.min.css'], phpModify);
  // gulp.watch('lib/**/*.js', pluginJS);
  gulp.watch('./img/**/*.{jpg,png,tiff}', webpimg);
  gulp.watch(['*.php']).on('change', browserSync.reload);
}
gulp.task('watchWp', watchWp);

gulp.task(
  'wp',
  gulp.parallel(
    'watchWp',
    'browser-syncWP',
    'mainjswp',
    'sass',
    'mainjslibswp',
    'maincsswp'
  )
);
gulp.task(
  'wp-build',
  gulp.parallel(
    'webpconverterwp',
    'tinypngwp',
    'mainjswp',
    'sass',
    'mainjslibswp',
    'maincsswp'
  )
);
//#endregion
