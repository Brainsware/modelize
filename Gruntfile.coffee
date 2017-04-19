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
    concat:
      dist:
        src: 'dist/modelize/**/*.js'
        dest: 'dist/modelize.js'
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
      src: [ 'dist/modelize.js' ]
      options:
        specs: [ 'spec/*.js' ]
        vendor: [
          'node_modules/jasmine-ajax/lib/mock-ajax.js',
          'vendor/jquery/dist/jquery.min.js',
          'vendor/jquery.rest/dist/1/jquery.rest.min.js',
          'vendor/knockout/dist/knockout.js',
          'vendor/sjcl/sjcl.js'
          ]

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-jasmine'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-browserify'

  grunt.registerTask 'default', ['coffee', 'uglify', 'concat', 'jasmine']
  grunt.registerTask 'test', ['coffee:spec', 'jasmine']
