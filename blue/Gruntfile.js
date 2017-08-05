module.exports = function(grunt){

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
        },
        watch: {
            scripts: {
                files: ['**/*.less'],
                tasks: ['less'],
                options: {
                    interrupt: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['less', "watch"]);
};