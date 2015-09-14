var gulp = require('gulp');
var jade = require('gulp-jade');
var config = require("../config.json");
var server = require("./server");

gulp.task('jade', function() {
  return gulp.src(config.jade.src)
    .pipe(jade({pretty: true}))
    .pipe(gulp.dest(config.jade.dest))
    .pipe(server.refresh())
});
