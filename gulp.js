var gulp = require('gulp');
var ts = require('gulp-typescript');

gulp.task('zip', function () {
    return gulp.src('dist/**')
        .pipe(zip('test.zip'))
        .pipe(gulp.dest('./distribution'));
});

// gulp.task('ftp', funnction() {
   
// });