const gulp = require('gulp');
const sass = require('gulp-sass');
const webpack = require('webpack-stream');

gulp.task('clean', () => {
    // Clean up build folder.
})

gulp.task('bundle', () => {
    // Transpile and bundle engine code.
    return gulp.src('engine/core.js')
        .pipe(webpack( require('./webpack.config.js') ))
        .pipe(gulp.dest(__dirname));
});

gulp.task('bundle:watch', ['bundle'], () => {
    return gulp.watch('engine/**/*.js', ['bundle']);
});

gulp.task('watch', ['bundle:watch']);