module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        less: {
            build: {
                files: {
                    "style.css": "styles/**/*.less"
                },
                options: {
                    compress: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.registerTask('default', ['less']);
};