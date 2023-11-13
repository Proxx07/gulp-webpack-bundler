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
  if (fs.existsSync('./build')) {
    return (
      gulp.src('./build/', { read: false })
        .pipe(clean({ force: true }))
    )
  }
  done();
});

gulp.task(TASK_NAME.HTML, () => {
  return (
    gulp.src('./src/pages/**/*.html')
      .pipe(changed('./build/'))
      .pipe(gulpInclude({
        prefix: "@@",
        basepath: "src/templates"
      }))
      .pipe(webpHtml())
      .pipe(htmlclean())
      .pipe(gulp.dest('./build/'))
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
      .pipe(gulp.dest('./build/styles/'))
  )
});

gulp.task(TASK_NAME.SCRIPTS, () => {
  return (
    gulp.src('./src/scripts/*.js')
      .pipe(changed('./build/scripts/'))
      .pipe(babel())
      .pipe(webpack(require('../webpack.config.js')))
      .pipe(gulp.dest('./build/scripts'))
  )
})

gulp.task(TASK_NAME.IMAGES, () => {
  return (
    gulp.src('./src/images/**/*')
      .pipe(changed('./build/images/'))

      .pipe(webp())
      .pipe(gulp.dest('./build/images/'))

      .pipe(gulp.src('./src/images/**/*'))
      .pipe(imagemin({ verbose: true }))
      .pipe(gulp.dest('./build/images/'))
  )
});

gulp.task(TASK_NAME.FONTS, () => {
  return (
    gulp.src('./src/fonts/**/*')
      .pipe(changed('./build/fonts/'))
      .pipe(gulp.dest('./build/fonts/'))
  )
});

gulp.task(TASK_NAME.FILES, () => {
  return (
    gulp.src('./src/files/**/*')
      .pipe(changed('./build/files/'))
      .pipe(gulp.dest('./build/files/'))
  )
});

gulp.task(TASK_NAME.SERVER, () => {
  return (
    gulp.src('./build/')
      .pipe(server({
        livereload: true,
        open: true
      }))
  )
});

gulp.task(TASK_NAME.STATIC, gulp.series(TASK_NAME.IMAGES, TASK_NAME.FONTS, TASK_NAME.FILES))
