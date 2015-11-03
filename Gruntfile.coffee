module.exports = (grunt) ->
  grunt.initConfig
    uglify:
      options:
        mangle: true
        compress: {}
        sourceMap: true
        sourceMapIncludeSources: true
      build:
        src: 'dist/modelize/**/*.js'
        dest: 'dist/modelize.min.js'
    coffee:
      main:
        options:
          bare: true
          sourceMap: true
        expand: true
        cwd: 'src'
        src: ['**/*.coffee']
        dest: 'dist/modelize/'
        ext: '.js'
      spec:
        options:
          bare: true
        expand: true
        cwd: 'spec_src'
        src: ['**/*.coffee']
        dest: 'spec/'
        ext: '.js'
    jasmine:
      src: [ 'dist/modelize.min.js' ]
      options:
        specs: [ 'spec/*.js' ]
        vendor: [
          'vendor/jasmine-ajax/lib/mock-ajax.js',
          'vendor/jquery/dist/jquery.min.js',
          'vendor/jquery.rest/dist/1/jquery.rest.min.js',
          'vendor/knockout/dist/knockout.js',
          'vendor/sjcl/sjcl.js'
          ]
    watch:
      files: ['<%= coffee.main.src %>', '<%= coffee.spec.src %>']
      tasks: ['coffee', 'uglify', 'jasmine']

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-jasmine'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-browserify'

  grunt.registerTask 'default', ['coffee', 'uglify', 'jasmine']
  grunt.registerTask 'test', ['jasmine']
