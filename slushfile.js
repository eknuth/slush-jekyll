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

  inquirer.prompt([
    {type: 'input', name: 'title', message: 'Title of post', default: gulp.args.join(' ')},
    {type: 'input', name: 'description', message: 'Description of post'},
    {type: 'confirm', name: 'moveon', message: 'Continue?'}
  ],
  function (answers) {
    if (!answers.moveon) {
      return done();
    }
    gulp.src(__dirname + '/templates/post.html')
      .pipe(template(answers))
      .pipe(rename({
        dirname: "_posts/" + now.year(),
        basename: S(answers.title).slugify(),
        prefix: now.format('YYYY-MM-DD-'),
        extname: ".md"
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
