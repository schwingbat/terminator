const gulp = require('gulp');
const sass = require('gulp-sass');
const webpack = require('webpack-stream');
const exec = require('child_process').exec;

// Clear all files from temp directory.
gulp.task('clean', () => {
    // Clean up build folder.
})

// Bundle all JS into one file.
gulp.task('build:engine', () => {
    // Transpile and bundle engine code.
    return gulp.src('engine/core.js')
        .pipe(webpack( require('./webpack.config.js') ))
        .pipe(gulp.dest(__dirname));
})

// Bundle built files into single HTML file.
gulp.task('build:game', () => {
    return exec('./gamebuilder/gamebuilder.js');
})

gulp.task('bundle', () => {

})

gulp.task('bundle:watch', ['bundle'], () => {
    return gulp.watch('engine/**/*.js', ['bundle'])
})

gulp.task('engine:watch', ['build:engine'], () => {
    return gulp.watch('engine/**/*', ['build:engine'])
})

gulp.task('watch', () => {
    gulp.watch('engine/**/*.js', ['build:engine'])
})