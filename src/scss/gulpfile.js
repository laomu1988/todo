var path = require('path');
var gulp = require('gulp');
var dateformat = require('dateformat');
var plugins = require('gulp-load-plugins')({
    // DEBUG: true,
    pattern: ['gulp-*', 'gulp.*'],
    replaceString: /\bgulp[\-.]/
});
var config = {
    src: './src',
    dest: './public/',
    version: function () {
        return dateformat('yyyy-mm-dd-hh');
    }
};

gulp.task('riot', function () {
    // common文件夹下的单独合并成一个文件
    return gulp.src([config.src + 'tags/*.html'])
        .pipe(plugins.riotCss({js: 'tags.js'}))
        .pipe(gulp.dest(config.dest + 'js/'));
    // 其他文件夹下的文件分别单独生成
    return gulp.src([config.src + 'tags/*.html', config.src + 'tags/*/*.html', '!' + config.src + 'tags/*/_*.html'])
        .pipe(plugins.riotCss({define: 'tags/'}))
        .pipe(gulp.dest(config.dest + 'js/tags/'));
});

gulp.task('importjs', ['riot'], function () {
    // importjs
    return gulp.src([config.src + 'js/*.js', config.src + 'js/*/*.js'])
        .pipe(gulp.dest(config.dest + 'js'))
        .pipe(plugins.imports())
        .pipe(gulp.dest(config.dest + 'js'));
    //console.log('import完毕；')
});
/*
gulp.task('requirejs', ['importjs'], function (cb) {
    // requirejs
    var files = fs.readdirSync(config.dest + 'js');
    var requirejs = plugins.requirejs;
    files.forEach(function (file) {
        if (file.indexOf('common') >= 0) {
            return;
        }
        fs.stat(config.dest + 'js\\' + file, function (err, stat) {
            if (err) {
                return console.log(err);
            }
            if (!stat.isDirectory()) {
                requirejs({
                    name: file.substring(0, file.lastIndexOf('.')),
                    baseUrl: config.dest + 'js/',
                    out: file
                }).pipe(gulp.dest(config.dest + 'js/')); // pipe it to the output DIR
            }
        });
    });
    cb();
});
gulp.task('jsmin', ['requirejs'], function () {
    // min js
    return gulp.src([config.dest + 'js/*.js', '!' + config.dest + '/js/*.min.js'])
        .pipe(plugins.uglify({mangle: true}))
        .pipe(plugins.rename(function (path) {
            path.extname = ".min.js";
        }))
        .pipe(gulp.dest(config.dest + 'js/'))
});
*/
gulp.task('js', ['importjs'/*, 'requirejs', 'jsmin'*/]);


gulp.task('scss', function () {
    return gulp.src(config.src + 'scss/*.scss')
        .pipe(plugins.sass().on('error', plugins.sass.logError))
        //.pipe(gulp.dest(config.src + 'css'))
        .pipe(gulp.dest(config.dest + 'css'))
});

gulp.task('cssmin', ['css'], function () {
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


gulp.task('default', ['riot', 'js', 'css', 'html'], function () {
    // livereload.listen();
    gulp.watch([config.src + '**/*.scss'], ['css']);
    gulp.watch([config.src + 'tags/**/*.html',config.src + 'js/*.js',config.src + 'js/**/*.js'], ['js']);
    gulp.watch([config.src + '*.html'], ['html']);
});