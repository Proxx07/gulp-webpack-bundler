const fs = require('fs');
const gulp = require('gulp');

const gulpInclude = require('gulp-file-include');
const htmlclean = require('gulp-htmlclean');

const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const changed = require('gulp-changed');

const sass = require('gulp-sass')(require('sass'));
const groupMedia = require('gulp-group-css-media-queries');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const webpcss = require('gulp-webp-css');

const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const webpHtml = require('gulp-webp-html');

const webpack = require('webpack-stream');
const babel = require('gulp-babel');

const TASK_NAME = require('./tasks.js');

gulp.task(TASK_NAME.CLEAN, (done) => {
  if (fs.existsSync('./docs')) {
    return (
      gulp.src('./docs/', { read: false })
        .pipe(clean({ force: true }))
    )
  }
  done();
});

gulp.task(TASK_NAME.HTML, () => {
  return (
    gulp.src('./src/pages/**/*.html')
      .pipe(changed('./docs/'))
      .pipe(gulpInclude({
        prefix: "@@",
        basepath: "src/templates"
      }))
      .pipe(webpHtml())
      .pipe(htmlclean())
      .pipe(gulp.dest('./docs/'))
  )
});

gulp.task(TASK_NAME.STYLES, () => {
  return (
    gulp.src('./src/styles/*.scss')
      .pipe(sass())
      .pipe(autoprefixer())
      .pipe(webpcss())
      .pipe(groupMedia())
      .pipe(csso())
      .pipe(gulp.dest('./docs/styles/'))
  )
});

gulp.task(TASK_NAME.SCRIPTS, () => {
  return (
    gulp.src('./src/scripts/*.js')
      .pipe(changed('./docs/scripts/'))
      .pipe(babel())
      .pipe(webpack(require('../webpack.config.js')))
      .pipe(gulp.dest('./docs/scripts'))
  )
})

gulp.task(TASK_NAME.IMAGES, () => {
  return (
    gulp.src('./src/images/**/*')
      .pipe(changed('./docs/images/'))

      .pipe(webp())
      .pipe(gulp.dest('./docs/images/'))

      .pipe(gulp.src('./src/images/**/*'))
      .pipe(imagemin({ verbose: true }))
      .pipe(gulp.dest('./docs/images/'))
  )
});

gulp.task(TASK_NAME.FONTS, () => {
  return (
    gulp.src('./src/fonts/**/*')
      .pipe(changed('./docs/fonts/'))
      .pipe(gulp.dest('./docs/fonts/'))
  )
});

gulp.task(TASK_NAME.FILES, () => {
  return (
    gulp.src('./src/files/**/*')
      .pipe(changed('./docs/files/'))
      .pipe(gulp.dest('./docs/files/'))
  )
});

gulp.task(TASK_NAME.SERVER, () => {
  return (
    gulp.src('./docs/')
      .pipe(server({
        livereload: true,
        open: true
      }))
  )
});

gulp.task(TASK_NAME.STATIC, gulp.series(TASK_NAME.IMAGES, TASK_NAME.FONTS, TASK_NAME.FILES))
