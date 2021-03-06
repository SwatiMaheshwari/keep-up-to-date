'use strict';

var languages = require('./languages.json');
var moment = require('moment');

module.exports = function(grunt) {
  var lang = grunt.option('lang') || 'en',
      config = grunt.file.readJSON('config.json');

  config.locals.languages = languages;
  config.locals.lang = lang;
  config.contents = './contents/' + lang;

  moment.locale(lang);  
  config.locals.lastupdate = moment().format('LL');

  grunt.file.write('config-' + lang + '.json', JSON.stringify(config));

  function moveIndex() {
    var file = {'src': 'temp/index.html', 'dest': 'build/index.html'}
    if (lang !== 'en') {
       file.dest = 'build/' + lang + '/index.html';
    }
    return file;
  }


  // Project configuration.
  grunt.initConfig({
    'pkg': grunt.file.readJSON('package.json'),

    'wintersmith_compile': {
      'build': {
        'options': {
          'config': './config-' + lang + '.json',
          'output': './temp/'
        }
      }
    },

    'cssmin': {
      'options': {
        'keepSpecialComments': 0
      },

      'css': {
        'src': ['src/css/normalize.css', 'src/css/base.css', 'src/css/how.css'],
        'dest': 'build/src/css/styles.min.css'
      },

      'uri': {
        'src': ['src/css/data-uri.css'],
        'dest': 'build/src/css/data-uri.css'
      }
    },

    'copy': {
      'assets': {
        'files': [
          {'src': ['src/assets/no-image.png'], 'dest': 'build/'},
          {'src': ['src/assets/favicon.ico'], 'dest': 'build/favicon.ico'}
        ]
      },

      'index': {
        'files': [moveIndex()]
      }
    },

    'htmlmin': {
      'dist': {
        'options': {
          'collapseWhitespace': true
        },
        'files': [
          { 'expand': true, 'cwd': 'build/', 'src': ['**/*.html'], 'dest': 'build/' }
        ]
      }
    },

    'clean': ['config-' + lang + '.json', './temp']
  });

  // Load plugins
  grunt.loadNpmTasks('grunt-wintersmith-compile');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');

  // Resgister task(s).
  grunt.registerTask('default', ['build']);
  grunt.registerTask('build', ['wintersmith_compile', 'cssmin', 'htmlmin', 'copy', 'clean']);
};
