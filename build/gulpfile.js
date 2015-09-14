var gulp = require("gulp");

var server = require("./tasks/server");
var server = require("./tasks/build");
var clean = require("./tasks/clean");
var browserify = require("./tasks/browserify");
var styles = require("./tasks/styles");
var images = require("./tasks/images");
var sprites = require("./tasks/sprites");
var watch = require("./tasks/watch");
var fonts = require("./tasks/fonts");
var jade = require("./tasks/jade");

gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'browserify', 'sprites', 'images', 'fonts', 'jade');
});
