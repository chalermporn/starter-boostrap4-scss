var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var merge = require('merge-stream');
var minifyCss = require('gulp-minify-css');
var cssmin = require('gulp-cssmin');
var order = require('gulp-order');
var prefix = require('gulp-autoprefixer');
var rename = require('gulp-rename');

var browserSync = require('browser-sync').create();

var paths = {
   bowerDir: './bower_components',
   public: './public/assets',
   resource: './resource',
};

gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: './'
        },
    });
});


gulp.task('cssAllMin', function () {
    var sassStream,
        cssStream;

    //compile sass
    sassStream = gulp.src(paths.resource+'/scss/**/*.scss')

    .pipe(sass({
        errLogToConsole: true
    }));
    //select additional css files
    cssStream = gulp.src('./css');


    //merge the two streams and concatenate their contents into a single file
    return merge(sassStream, cssStream)
        .pipe(order([
            "bootstrap.css",
            "main.css"
        ]))
        .pipe(concat('all.css'))
        .pipe(gulp.dest(paths.public + '/css/'))
        .pipe(cssmin())
        .pipe(prefix())
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(gulp.dest(paths.public + '/css/')) // save .min.css

    .pipe(browserSync.reload({
        stream: true
    }));
});

gulp.task('watch', ['browserSync', 'cssAllMin'], function () {
    gulp.watch(paths.resource +'/scss/*.scss', ['cssAllMin']);
    //gulp.watch('./scss/*.scss', ['styles']);
    gulp.watch('./*.html', browserSync.reload);
    // Other watchers
});