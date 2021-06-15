var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var merge = require('merge-stream');
var nodemon = require('gulp-nodemon');
var browserSync = require("browser-sync");
var notify = require('gulp-notify');
var sassdoc = require('sassdoc');

var input = './app/**/*.sass';
var output = './app';
var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded'
};
var autoprefixerOptions = {
    browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
};

gulp.task('sass', function () {
    var sassStream = gulp
        .src(input)
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(autoprefixer(autoprefixerOptions));

    return merge(sassStream)
        .pipe(concat('app.css'))
        .pipe(gulp.dest(output));

});

gulp.task('sassdoc', function () {
    return gulp
        .src(input)
        .pipe(sassdoc())
        .resume();
});

gulp.task('browser-sync', ['nodemon'], function() {

    browserSync.init(null, {
        proxy: "https://localhost:3000",
        files: ["app/**/*.*"],
        browser: "google chrome",
        port: 7000
    });

    gulp.watch(input, ['sass']);
    gulp.watch("./app/*.html").on('change', browserSync.reload);
    gulp.watch("./app/*.js").on('change', browserSync.reload);
});

gulp.task('nodemon', function (cb) {
    var started = false;
    return nodemon({
        script: './bin/www',
        ignore: ["./app"]
    }).on('start', function () {
        if (!started) {
            cb();
            started = true;
        }
    });
});

gulp.task('prod', function () {
    var sassStream = gulp
        .src(input)
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(autoprefixer(autoprefixerOptions));

    return merge(sassStream)
        .pipe(concat('app.css'))
        .pipe(gulp.dest(output));
});

gulp.task('default', ['browser-sync'], function () {});