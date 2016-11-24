

module.exports = function(grunt) {

    var os = require('os');
    var browser = os.platform() === 'linux' ? 'google-chrome' : (os.platform() === 'darwin' ? 'google chrome' : (os.platform() === 'win32' ? 'chrome' : 'firefox'));

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Load database config from external JSON (optional) 
        db_config: grunt.file.readJSON('config/db.json'),

        nodemon: {
            dev: {
                script: '../bin/www',
                options: {
                    args: ['dev'],
                    env: {
                        PORT: '3001'
                    },
                    cwd: 'server',
                    ignore: ['node_modules/**'],
                    ext: 'js'
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-nodemon');

    // Load the plugin that provides the "uglify" task.
    //grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default');

    grunt.registerTask('serve', ['nodemon'])

};
