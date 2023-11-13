const fs = require('fs');

const gulp = require('gulp');
const gulpInclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const server = require('gulp-server-livereload');
const clean = require('gulp-clean');

const sourceMaps = require('gulp-sourcemaps');
//const imagemin = require('gulp-imagemin');

const webpack = require('webpack-stream');
const babel = require('gulp-babel');
const changed = require('gulp-changed');

const TASK_NAME = require('./tasks-dev.js');

gulp.task(TASK_NAME.CLEAN, (done) => {
  if (fs.existsSync('./dist')) {
    return gulp.src('./dist/', { read: false }).pipe(clean({ force: true }));
  }
  done();
});

gulp.task(TASK_NAME.HTML, () => {
  return gulp
    .src('./src/pages/**/*.html')
    .pipe(changed('./dist/', { hasChanged: changed.compareContents }))
    .pipe(
      gulpInclude({
        prefix: '@@',
        basepath: 'src/templates',
      })
    )
    .pipe(gulp.dest('./dist/'));
});

gulp.task(TASK_NAME.STYLES, () => {
  return gulp.src('./src/styles/*.scss').pipe(sourceMaps.init()).pipe(sass()).pipe(sourceMaps.write()).pipe(gulp.dest('./dist/styles/'));
});

gulp.task(TASK_NAME.SCRIPTS, () => {
  return gulp
    .src('./src/scripts/*.js')
    .pipe(changed('./dist/scripts/'))
    .pipe(babel())
    .pipe(webpack(require('../webpack.config.js')))
    .pipe(gulp.dest('./dist/scripts'));
});

gulp.task(TASK_NAME.IMAGES, () => {
  return (
    gulp
      .src('./src/images/**/*')
      .pipe(changed('./dist/images/'))
      //.pipe(imagemin({ verbose: true }))
      .pipe(gulp.dest('./dist/images/'))
  );
});

gulp.task(TASK_NAME.FONTS, () => {
  return gulp.src('./src/fonts/**/*').pipe(changed('./dist/fonts/')).pipe(gulp.dest('./dist/fonts/'));
});

gulp.task(TASK_NAME.FILES, () => {
  return gulp.src('./src/files/**/*').pipe(changed('./dist/files/')).pipe(gulp.dest('./dist/files/'));
});

gulp.task(TASK_NAME.SERVER, () => {
  return gulp.src('./dist/').pipe(
    server({
      livereload: true,
      open: true,
    })
  );
});

gulp.task(TASK_NAME.STATIC, gulp.series(TASK_NAME.IMAGES, TASK_NAME.FONTS, TASK_NAME.FILES));

gulp.task(TASK_NAME.WATCH, () => {
  gulp.watch('./src/styles/**/*.scss', gulp.series(TASK_NAME.STYLES));
  gulp.watch('./src/scripts/**/*.js', gulp.series(TASK_NAME.SCRIPTS));
  gulp.watch('./src/**/*.html', gulp.series(TASK_NAME.HTML));
  gulp.watch('./src/images/**/*', gulp.series(TASK_NAME.IMAGES));
  gulp.watch('./src/fonts/**/*', gulp.series(TASK_NAME.FONTS));
  gulp.watch('./src/files/**/*', gulp.series(TASK_NAME.FILES));
});
