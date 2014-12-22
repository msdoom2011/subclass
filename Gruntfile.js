module.exports = function(grunt) {

    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Project configuration
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        config: grunt.file.readJSON('package.config.json'),

        clean: {
            build: {
                src: "<%= config.build_dir %>"
            },
            compile: {
                src: "<%= config.compile_dir %>"
            }
        },

        copy: {
            build_lib: {
                src: "<%= config.lib.dir.src %>/**/*",
                dest: "<%= config.build_dir %>",
                filter: "isFile",
                expand: true
            },
            build_demo: {
                src: "<%= config.demo.dir.src %>/**/* %>",
                dest: "<%= config.build_dir %>",
                filter: "isFile",
                expand: true
            }
        },

        index: {
            build: {
                dir: "<%= config.build_dir %>",
                index: "<%= config.src_dir %>/<%= config.demo.index %>",
                src: []
            },
            compile: {
                dir: "<%= config.compile_dir %>",
                index: "<%= config.src_dir %>/<%= config.demo.index %>",
                src: []
            }
        }
    });

    grunt.registerTask("build", [
        "clean:build", "copy:build_lib", "copy:build_demo", "index:build"
    ]);

    //grunt.registerTask("compile", [
    //    "clean:compile", "copy:compile_lib",
    //]);

    grunt.registerMultiTask("index", "Process index.html template", function() {
        console.log(111111);
    });
};