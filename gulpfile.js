var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var rename = require('gulp-rename');
var cssmin = require('gulp-cssmin');
var sass = require('gulp-ruby-sass');
var uglify = require('gulp-uglify');

gulp.task('sass', function () {
	return sass('sass/styles.scss', {
			require: 'sass-json-vars'
		})
		.on('error', function (err) {
			console.error('Sass error!', err.message);
		})
		.pipe(rename('bubble-arc.css'))
		.pipe(gulp.dest('dist/'))
		.pipe(cssmin())
		.pipe(rename('bubble-arc.min.css'))
		.pipe(gulp.dest('dist/'));
});

gulp.task('coffee', function () {
	var b = browserify();
	b.add('coffee/bubble-arc.coffee');
	b.transform(['coffeeify']);
	b.exclude('jquery');
	b.bundle()
		.pipe(source('bubble-arc.js'))
		.pipe(gulp.dest('dist/'))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(rename('bubble-arc.min.js'))
		.pipe(gulp.dest('dist/'));
});

gulp.task('dist', ['sass', 'coffee']);