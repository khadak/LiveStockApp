// Gulp.js configuration
var
    // modules
    gulp = require('gulp'),

    newer = require('gulp-newer'),
    imagemin = require('gulp-imagemin'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    assets = require('postcss-assets'),
    autoprefixer = require('autoprefixer'),
    mqpacker = require('css-mqpacker'),
    cssnano = require('cssnano'),

    // folders
    folder = {
        src: 'src/',
        build: 'build/'
    }
;


// image processing
gulp.task('images', function() {
    var out = folder.src + 'images/';
    return gulp.src(folder.src + 'images/**/*')
        .pipe(newer(out))
        .pipe(imagemin({ optimizationLevel: 7 }))
        .pipe(gulp.dest(out));
});


// CSS processing
gulp.task('css', ['images'], function() {

    var postCssOpts = [
        assets({ loadPaths: ['images/'] }),
        autoprefixer({ browsers: ['last 2 versions', '> 2%'] }),
        mqpacker
    ];

    if (!devBuild) {
        postCssOpts.push(cssnano);
    }

    return gulp.src(folder.src + 'scss/main.scss')
        .pipe(sass({
            outputStyle: 'nested',
            imagePath: 'images/',
            precision: 3,
            errLogToConsole: true
        }))
        .pipe(postcss(postCssOpts))
        .pipe(gulp.dest(folder.src + 'scss/'))
        .pipe(gulp.dest(folder.build + 'css/'));

});

// watch for changes
gulp.task('watch', function() {

    // image changes
    gulp.watch(folder.src + 'images/**/*', ['images']);

    // html changes
    gulp.watch(folder.src + 'html/**/*', ['html']);

    // css changes
    gulp.watch(folder.src + 'scss/**/*', ['css']);

});

// run all tasks
gulp.task('run', ['css']);

// default task
gulp.task('default', ['run', 'watch']);



