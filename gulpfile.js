var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    autoprefixer = require('gulp-autoprefixer'),
    clean = require('gulp-clean'),
    changed = require('gulp-changed'), // Проверка наличия изменений в файлах
    csso = require('gulp-csso'),
    scss = require('gulp-scss'),
    rigger = require('gulp-rigger'),
    concat = require('gulp-concat');
    // browserSync = require('browser-sync'),
    // reload = browserSync.reload;

var path = {
    src: 'src/',
    documentation: 'documentation/',
    build: 'build/'

};

gulp.task('js', function () {
    return gulp.src([path.src + 'js/*.js']) // Откуда брать файлы и какие
    // .pipe(uglify())  // Минифмкация js
        .pipe(gulp.dest(path.build + 'js/'))
});

gulp.task('jsContent', function () {
    return gulp.src([path.src + 'js/content/*.js']) // Откуда брать файлы и какие
        .pipe(concat('content.js'))
    // .pipe(uglify())  // Минифмкация js
        .pipe(gulp.dest(path.build + 'js/'))
});

gulp.task('jsModuls', function () {
    return gulp.src(path.src + 'js/moduls/*.js') // Откуда брать файлы и какие
        .pipe(concat('moduls.js'))
        .pipe(gulp.dest(path.build + 'js/'))
});

gulp.task('jsModels', function () {
    return gulp.src(path.src + 'js/models/*.js') // Откуда брать файлы и какие
        .pipe(concat('models.js'))
        .pipe(gulp.dest(path.build + 'js/'))
});

gulp.task('scss', function () {
    return gulp.src([path.src + 'scss/*.scss'])
        .pipe(scss())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        // .pipe(csso()) // Минифмкация css
        .pipe(gulp.dest(path.build + 'css/'))
});

// gulp.task('clean', function () {
//     return gulp.src([path.build + '*', '!' + path.build + 'files'], {read: false})
//         .pipe(clean());
// });

gulp.task('clean', function () {
    return gulp.src([path.build + '*'], {read: false})
        .pipe(clean());
});

gulp.task('vendor', function () {
    return gulp.src(path.src + 'js/libs/*')
        .pipe(gulp.dest(path.build + 'js/libs/'))
});

gulp.task('files', function () {
    return gulp.src(path.src + 'files/**/*')
        .pipe(gulp.dest(path.build + 'files/'))
});

gulp.task('img', function () {
    return gulp.src(path.src + 'img/**/*')
        .pipe(gulp.dest(path.build + 'img/'))
});

gulp.task('fonts', function () {
    return gulp.src(path.src + 'fonts/**/*')
        .pipe(gulp.dest(path.build + 'fonts/'))
});

// gulp.task('json', function () {
//     return gulp.src(path.src + '**/*.json')
//         .pipe(gulp.dest(path.build))
//         .pipe(reload({ stream: true }));
// });

gulp.task('differentCopy', function () {
    return gulp.src(path.src + "*.ico")
        .pipe(gulp.dest(path.build))
});

gulp.task('html', function () {
    return gulp.src(path.src + "**/*.html")
        .pipe(gulp.dest(path.build))
});

gulp.task('flash', function () {
    return gulp.src(path.src + "flashPlayer/*.swf")
        .pipe(gulp.dest(path.build + 'flashPlayer/'))
});

gulp.task('php', function () {
    return gulp.src(path.src + "php/*.php")
        .pipe(gulp.dest(path.build + 'php/'))
});

gulp.task('copy', ['fonts', 'vendor', 'files', 'img', 'differentCopy', 'flash', 'php']);
gulp.task('build', ['copy', 'js', 'scss', 'html', 'jsModels', 'jsModuls', 'jsContent']);

gulp.task('default', ['clean'], function () {
    gulp.start(['build']);
});

gulp.task('watch', function () {
    gulp.watch(path.src + 'scss/**/*.scss', ['scss']);
    gulp.watch([path.src + "**/*.html", path.src + "*.html"], ['html']);
    gulp.watch(path.src + 'js/*.js', ['js']);
    gulp.watch(path.src + 'js/models/*.js', ['jsModels']);
    gulp.watch(path.src + 'js/moduls/*.js', ['jsModuls']);
    gulp.watch(path.src + 'js/content/*.js', ['jsContent']);
});