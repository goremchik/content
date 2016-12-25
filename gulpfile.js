var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    autoprefixer = require('gulp-autoprefixer'),
    clean = require('gulp-clean'),
    changed = require('gulp-changed'), // Проверка наличия изменений в файлах
    csso = require('gulp-csso'),
    scss = require('gulp-scss'),
    rigger = require('gulp-rigger'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload;

var path = {
    src: 'src/',
    documentation: 'documentation/',
    build: 'build/'

};

gulp.task('js', function () {
    return gulp.src(path.src + 'js/*.js') // Откуда брать файлы и какие
    // .pipe(uglify())  // Минифмкация js
        .pipe(gulp.dest(path.build + 'js/'))
        .pipe(reload({ stream: true }));
});

gulp.task('jsModels', function () {
    return gulp.src(path.src + 'js/models/*.js') // Откуда брать файлы и какие
        .pipe(concat('models.js'))
        .pipe(gulp.dest(path.build + 'js/'))
        .pipe(reload({ stream: true }));
});

gulp.task('scss', function () {
    return gulp.src([path.src + 'scss/*.scss' , '!' + path.src + 'scss/template.scss'])
        .pipe(scss())
        // .pipe(csso()) // Минифмкация css
        .pipe(gulp.dest(path.build + 'css/'))
        .pipe(reload({ stream: true }));
});

gulp.task('clean', function () {
    return gulp.src(['build/*'], {read: false})
        .pipe(clean());
});

gulp.task('vendor', function () {
    return gulp.src(path.src + 'js/libs/*')
        .pipe(gulp.dest(path.build + 'js/libs/'))
        .pipe(reload({ stream: true }));
});

gulp.task('files', function () {
    return gulp.src(path.src + 'files/**/*')
        .pipe(gulp.dest(path.build + 'files/'))
        .pipe(reload({ stream: true }));
});

gulp.task('img', function () {
    return gulp.src(path.src + 'img/**/*')
        .pipe(gulp.dest(path.build + 'img/'))
        .pipe(reload({ stream: true }));
});

gulp.task('fonts', function () {
    return gulp.src(path.src + 'fonts/**/*')
        .pipe(gulp.dest(path.build + 'fonts/'))
        .pipe(reload({ stream: true }));
});

// gulp.task('json', function () {
//     return gulp.src(path.src + '**/*.json')
//         .pipe(gulp.dest(path.build))
//         .pipe(reload({ stream: true }));
// });

gulp.task('html', function () {
    return gulp.src(path.src + "**/*.html")
        .pipe(gulp.dest(path.build))
        .pipe(reload({ stream: true }));
});

gulp.task('copy', ['fonts', 'vendor', 'files', 'img']);
gulp.task('build', ['copy', 'js', 'scss', 'html', 'jsModels']);

gulp.task('default', ['clean'], function () {
    gulp.start(['build']);
});

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: path.build
        }
    })
});

gulp.task('watch', ['browserSync'], function () {

    gulp.watch(path.src + 'scss/*.scss', ['scss']);
    gulp.watch([path.src + "pages/*.html", path.src + "*.html"], ['html']);
    gulp.watch(path.src + 'js/*.js', ['js']);
    gulp.watch(path.src + 'js/models/*.js', ['jsModels']);

});