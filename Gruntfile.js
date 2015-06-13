'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: 'public/stylesheets',
          src: ['**/*.sass'],
          dest: 'public/stylesheets',
          ext: '.css'
        }]
      }
    },

    watch: {
      css: {
        files: 'public/stylesheets/*.sass',
        tasks: ['sass'],
        interrupt: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['sass']);
}
