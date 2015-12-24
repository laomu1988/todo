var path = require('path');
var gulp = require('gulp');
var dateformat = require('dateformat');
var plugins = require('gulp-load-plugins')({
    // DEBUG: true,
    pattern: ['gulp-*', 'gulp.*'],
    replaceString: /\bgulp[\-.]/
});
console.log('test');
var config = {
    src: './src/',
    dest: './public/',
    version: function () {
        return dateformat('yyyy-mm-dd-hh');
    }
};

gulp.task('riot', function () {
    console.log('riot');
    // common文件夹下的单独合并成一个文件
    return gulp.src([config.src + 'tags/*.html'])
        .pipe(plugins.riotCss({js: 'tags.js'}))
        .pipe(gulp.dest(config.dest + 'js/'));
});

gulp.task('importjs', ['riot'], function () {
    // importjs
    return gulp.src([config.src + 'js/*.js', config.src + 'js/*/*.js'])
        .pipe(plugins.imports())
        .pipe(gulp.dest(config.dest + 'js'))
        .pipe(gulp.dest(config.dest + 'js'));
    //console.log('import完毕；')
});
gulp.task('js', ['importjs']);


gulp.task('scss', function () {
    console.log('scss');
    return gulp.src(config.src + 'scss/*.scss')
        .pipe(plugins.sass().on('error', plugins.sass.logError))
        .pipe(gulp.dest(config.dest + 'css'))
});

gulp.task('cssmin', ['scss'], function () {
    console.log('cssmin');
    return gulp.src([config.dest + 'css/*.css', '!' + config.dest + 'css/*.min.css'])
        .pipe(plugins.minifyCss({keepBreaks: true}))
        .pipe(plugins.rename(function (path) {
            path.extname = ".min.css";
        }))
        .pipe(gulp.dest(config.dest + 'css'))
});

gulp.task('css', ['scss', 'cssmin']);

gulp.task('html', function () {
    return gulp.src([config.src + '*.html', '!' + config.src + '_*.html'])
        .pipe(plugins.imports())
        .pipe(plugins.replace(/\?ver=[^\"]*/g, '?ver=' + config.version()))
        .pipe(gulp.dest(config.dest))
});

gulp.task('default', ['js', 'css', 'html'], function () {
    console.log('default');
    gulp.watch([config.src + 'scss/*.scss'], ['css']);
    gulp.watch([config.src + 'tags/*.html', config.src + 'js/*.js'], ['js']);
    gulp.watch([config.src + '*.html'], ['html']);
});