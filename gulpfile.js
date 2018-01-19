'use strict';

const gulp = require('gulp');
const env = require('gulp-env');
const jshint = require('gulp-jshint');
const jscs = require('gulp-jscs');
const gulpMocha = require('gulp-mocha');
const nodemon = require('gulp-nodemon');

var jsFiles = ['*.js', 'src/**/*.js'];

gulp.task('style', function() {
    return gulp.src(jsFiles)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish', {
            verbose: true
          }))
        .pipe(jscs());
  });

gulp.task('test', function () {
    env({ vars: { ENV: 'Test' }});
    gulp.src('tests/*.js', { read: false })
      .pipe(gulpMocha({ report: 'nyan' }));
  });

gulp.task('serve', ['style'], function() {
    var options = {
        script: 'app.js',
        delayTime: 1,
        env: { 'PORT': process.env.PORT || 3000 },
        watch: jsFiles
      };
    return nodemon(options)
        .on('restart', function(ev) {
            console.log('Restarting....' + ev);
          });
  });
