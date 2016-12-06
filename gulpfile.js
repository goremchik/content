var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    autoprefixer = require('gulp-autoprefixer'),
    clean = require('gulp-clean'),
    changed = require('gulp-changed'), // Проверка наличия изменений в файлах
    csso = require('gulp-csso'),
    scss = require('gulp-scss'),
    rigger = require('gulp-rigger'),
    browserSync = require('browser-sync');


var path = {
    src: 'src/',
    documentation: 'documentation/',
    build: 'build/'

};

gulp.task('js', function () {
    return gulp.src(path.src + 'js/*.js') // Откуда брать файлы и какие
    // .pipe(uglify())  // Минифмкация js
        .pipe(gulp.dest(path.build + 'js/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('scss', function () {
    return gulp.src([path.src + 'scss/*.scss' , '!' + path.src + 'scss/template.scss'])
        .pipe(scss())
        // .pipe(csso()) // Минифмкация css
        .pipe(gulp.dest(path.build + 'css/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('htc', function () {
    return gulp.src(path.src + 'scss/htc/*.htc')
        .pipe(scss())
        // .pipe(csso()) // Минифмкация css
        .pipe(gulp.dest(path.build + 'css/htc/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('clean', function () {
    return gulp.src(['build/*'], {read: false})
        .pipe(clean())
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('vendor', function () {
    return gulp.src(path.src + 'vendor/**/*')
        .pipe(gulp.dest(path.build + 'vendor/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('files', function () {
    return gulp.src(path.src + 'files/**/*')
        .pipe(gulp.dest(path.build + 'files/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('img', function () {
    return gulp.src(path.src + 'img/**/*')
        .pipe(gulp.dest(path.build + 'img/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('fonts', function () {
    return gulp.src(path.src + 'fonts/**/*')
        .pipe(gulp.dest(path.build + 'fonts/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('html', function () {
    return gulp.src([path.src + "*.html", "!" + path.src + "_*.html"])
         .pipe(rigger())
        .pipe(gulp.dest(path.build))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('copy', ['fonts', 'vendor', 'files', 'img', 'htc']);
gulp.task('build', ['copy', 'js', 'scss', 'html']);
gulp.task('default', ['clean'], function () {
    gulp.start(['build']);
});

gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: path.build
        },
    })
});

gulp.task('watch', ['browserSync'], function () {
    gulp.watch(path.src + 'scss/*.scss', ['scss']);
    gulp.watch([path.src + "html/*.html", path.src + "*.html"], ['html']);
    gulp.watch(path.src + 'js/*.js', ['js']);
});