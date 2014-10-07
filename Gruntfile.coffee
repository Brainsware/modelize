module.exports = (grunt) ->
  grunt.initConfig
    uglify:
      options:
        mangle: true
        compress: true
        sourceMap: true
        sourceMapIncludeSources: true
      build:
        src: 'dist/modelize/**/*.js'
        dest: 'dist/modelize.min.js'
    coffee:
      options:
        bare: true
        sourceMap: true
      files:
        expand: true
        cwd: 'src'
        src: ['**/*.coffee']
        dest: 'dist/modelize/'
        ext: '.js'
    watch:
      files: ['<%= coffee.files.src %>']
      tasks: ['coffee', 'uglify']

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  grunt.registerTask 'default', ['coffee', 'uglify']