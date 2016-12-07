var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');


var nodemon = require('gulp-nodemon')
var htmlreplace = require('gulp-html-replace');
var bundle = require('gulp-bundle-assets');
var clean = require('gulp-clean');
var gulpSequence = require('gulp-sequence');
var copy = require('gulp-copy');
var zip = require('gulp-zip');
var del = require('del');

// A gulpfile is just another node program and you can use any package available on npm
gulp.task('clean', function() {
    // You can use multiple globbing patterns as you would with `gulp.src`
    return gulp.src('./build', { read: false })
        .pipe(clean());
});

gulp.task('serve', function() {
    nodemon({
        script: './bin/www',
        ignore: [
            'node_modules/'
        ],
        ext: 'js json',
        watch: './server'
    })
})

gulp.task('bundle', ['copy'], function() {
	return gulp.src('./bundle.config.js')
        .pipe(bundle())
        .pipe(bundle.results('./tmp'))
        .pipe(gulp.dest('./build/client'));
});

gulp.task('copy', function(){
	return gulp.src([
        './client/lib/**/*',
        './client/app/**/*.html',
        './client/app/audio/**/*',
        './server/**/*', 
        './bin/**/*', 
        './package.json',
        './bower.json',
        './.bowerrc'])
  		.pipe(copy('./build'));
})

gulp.task('archive-again', function() {
	del(['./tmp/bundle.result.json']).then(function(){
		return gulp.src('./build/**/*')
	        .pipe(zip('build.zip'))

	        .pipe(gulp.dest('./build'));


	})
});

gulp.task('archive2', function() {
	del(['./makesurre.that she is not']).then(function(){
		return gulp.src('./build/**/*')
	        .pipe(zip('build.zip'))
	        .pipe(gulp.dest('./build'));	
	        
	})
});

gulp.task('htmlreplace', function() {

	var resultJSON = require('./tmp/bundle.result.json');

    return gulp.src('./client/index.html')
        .pipe(htmlreplace({
            'css' : {
			    src: null,
			    tpl: resultJSON.main.styles
			},
            'js' : {
			    src: null,
			    tpl: resultJSON.main.scripts
			}
        }))
        .pipe(gulp.dest('./build/client'))
    
});

gulp.task('build', gulpSequence('clean', 'bundle', 'htmlreplace', 'archive2'));
