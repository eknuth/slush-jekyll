'use strict';
var gulp = require('gulp'),
    install = require('gulp-install'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    rename = require('gulp-rename'),
    moment = require('moment'),
    S = require('string'),
    inquirer = require('inquirer');

gulp.task('post', function (done) {
  var now = moment();
  var dirname, basename, prefix, extname = ".md";
  inquirer.prompt([
    {type: 'list', name: 'type', message: 'Type of post', choices: ['Post', 'Draft']},
    {type: 'input', name: 'title', message: 'Title of post'},
    {type: 'input', name: 'description', message: 'Description of post'},
    {type: 'confirm', name: 'moveon', message: 'Continue?'}
  ],
  function (answers) {
    if (!answers.moveon) {
      return done();
    }

    // Check type of post, if it's to be published publish it to _posts, otherwise, save it as draft
    if (answers.type === 'Post'){
      dirname = '_posts/' + now.year();
      basename = S(answers.title).slugify();
      prefix = now.format('YYYY-MM-DD-');
    } else {
      dirname = '_drafts/' + now.year();
      basename = S(answers.title).slugify();
      prefix = '';
      extname = '.md';
    }
    gulp.src(__dirname + '/templates/post.html')
      .pipe(template(answers))
      .pipe(rename({
        dirname: dirname,
        basename: basename,
        prefix: prefix,
        extname: extname
      }))
      .pipe(conflict('./'))
      .pipe(gulp.dest('./'))                   // Without __dirname here = relative to cwd
      .on('end', function () {
        done();                                // Finished!
      })
      .resume();
  });
});

gulp.task('default', ['post'], function () {
});
