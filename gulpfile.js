const gulp = require('gulp');
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
        .pipe(gulp.dest('./staging'));
})

// Bundle built files into single HTML file.
gulp.task('build:game', () => {
    console.log('Building game...')
    return exec('node ./gamebuilder/gamebuilder.js gamecontent/ staging/ build/', function(err, stdout, stderr) {
        if (err || stderr) {
            console.error({ err, stderr });
            return;
        }
        console.log(stdout);
    })
})

gulp.task('build', ['build:engine', 'build:game'])

// gulp.task('game:watch', ['build:engine', 'build:game'], () => {
//     return gulp.watch('gamecontent/**/*.js', ['build:engine', 'build:game'])
// })

// gulp.task('engine:watch', ['build:engine'], () => {
//     return gulp.watch('engine/**/*', ['build:engine'])
// })

gulp.task('watch', ['build'], () => {
    console.log('Watching for changes...')
    return gulp.watch(['engine/**/*', 'gamecontent/**/*', 'gamebuilder/**/*'], ['build'])
})
