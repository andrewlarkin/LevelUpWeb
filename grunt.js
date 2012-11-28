module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      version: '0.0.2',
      banner: '/*! LevelUpWeb - v<%= meta.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> */'
    },
    requirejs: {
      baseUrl: 'lib'
    },
    compass: {
      dist: {
        options: {
          config: 'config/config.rb'
        }
      }
    },
    lint: {
      files: ['*.js', 'spec/*.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'test'
    },
    jshint: {
      globals: {
        exports: true,
        // Requirejs
        require: true,
        requirejs: true,
        define: true,
        // Jasmine
        it: true,
        describe: true,
        beforeEach: true,
        afterEach: true,
        expect: true
      }
    },
    jasmine_node: {
      specFolderName: "spec",
      projectRoot: ".",
      requirejs: true,
      forceExit: true
    }
  });

  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.loadNpmTasks('grunt-requirejs');
  grunt.loadNpmTasks('grunt-contrib-compass');

  grunt.registerTask('test', 'lint jasmine_node');
  // Default task.
  grunt.registerTask('default', 'test requirejs');
};