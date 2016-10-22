const gulp = require('gulp');
const webpack = require('webpack-stream');
const exec = require('child_process').exec;

// Clear all files from temp directory.
gulp.task('clean', () => {
    // Clean up build folder.
})

// Bundle all JS into one file.
gulp.task('build', () => {
    // Transpile and bundle engine code.
    return gulp.src('engine/core.js')
        .pipe(webpack( require('./webpack.config.js') ))
        .pipe(gulp.dest('./build'));
})

// Bundle built files into single HTML file.
gulp.task('build:game', () => {
    console.log('Building game...')
    return exec('node ./builder/gamec.js gamecontent/ build/', function(err, stdout, stderr) {
        if (err || stderr) {
            console.error({ err, stderr });
            return;
        }
        console.log(stdout);
    })
})

gulp.task('watch:game', ['build:game'], () => {
	return gulp.watch('gamecontent/**/*', ['build:game'])
})

gulp.task('watch', ['build'], () => {
    console.log('Watching for changes...')
    return gulp.watch('engine/**/*', ['build'])
})
