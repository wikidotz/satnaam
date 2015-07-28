module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Load database config from external JSON (optional) 
        db_config: grunt.file.readJSON('config/db.json'),


        db_import: {
            options: {
                // common options should be defined here 
            },

            // "Local" target 
            "local": {
                "options": {
                    "title": "Import Local DB",

                    "database": "<%= db_config.local.db_name %>",
                    "user": "<%= db_config.local.username %>",
                    "pass": "<%= db_config.local.password %>",
                    "host": "<%= db_config.local.host %>",
                    "backup_to": "db/local.sql",
                    "site_url": 'boogerbooger'
                }
            }
        },


        db_dump: {
            options: {},

            // "Local" target 
            "local": {
                "options": {
                    "title": "Dump Local DB",

                    "database": "<%= db_config.local.db_name %>",
                    "user": "<%= db_config.local.username %>",
                    "pass": "<%= db_config.local.password %>",
                    "host": "<%= db_config.local.host %>",
                    "backup_to": "db/local.sql",
                    "site_url": 'boogerbooger'
                }
            },
        },


        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'client/js/*.js',
                dest: 'build/*.min.js'
            }
        }


    });

    grunt.loadNpmTasks('grunt-mysql-dump-import');

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default');

};
