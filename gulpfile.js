const gulp = require('gulp');
require('./gulp/dev.js');
require('./gulp/prod.js');
const TASK_NAME_DEV = require('./gulp/tasks-dev.js');
const TASK_NAME_PROD = require('./gulp/tasks.js');

gulp.task(
  TASK_NAME_DEV.DEFAULT,
  gulp.series(
    TASK_NAME_DEV.CLEAN,
    gulp.parallel(TASK_NAME_DEV.SCRIPTS, TASK_NAME_DEV.STYLES, TASK_NAME_DEV.STATIC, TASK_NAME_DEV.HTML),
    gulp.parallel(TASK_NAME_DEV.SERVER, TASK_NAME_DEV.WATCH),
  ),
);

gulp.task(
  TASK_NAME_PROD.BUILD,
  gulp.series(
    TASK_NAME_PROD.CLEAN,
    gulp.parallel(TASK_NAME_PROD.SCRIPTS, TASK_NAME_PROD.STYLES, TASK_NAME_PROD.STATIC, TASK_NAME_PROD.HTML),
    gulp.parallel(TASK_NAME_PROD.SERVER),
  ),
);
