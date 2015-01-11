module.exports = function(grunt) {

    // Load plugins

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-jsdoc');

    // Project configuration

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        meta: {
            banner:
                '/**\n' +
                ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                //' * <%= pkg.homepage %>\n' +
                ' *\n' +
                ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
                ' */\n',

            prefix:
                '(function() {\n' +
                '"use strict";\n\n',

            suffix: '\n})();'
        },

        config: grunt.file.readJSON('package.config.json'),

        clean: {
            build: {
                src: "<%= config.build_dir %>"
            },
            release: {
                src: "<%= config.release_dir %>"
            }
        },

        copy: {
            build_lib: {
                src: "**/*",
                dest: "<%= config.lib.dir.build %>",
                cwd: "<%= config.lib.dir.src %>/",
                expand: true
            },
            build_demo: {
                src: "**/*",
                dest: "<%= config.demo.dir.build %>",
                cwd: "<%= config.demo.dir.src %>/",
                filter: "isFile",
                expand: true
            },
            release_lib: {
                src: "**/*",
                dest: "<%= config.release_dir %>/src/",
                cwd: "<%= config.lib.dir.src %>/",
                expand: true
            },
            release_demo: {
                src: "**/*",
                dest: "<%= config.demo.dir.release %>",
                cwd: "<%= config.demo.dir.src %>/",
                filter: "isFile",
                expand: true
            },
            release_readme: {
                src: "README.md",
                dest: "<%= config.release_dir %>/",
                expand: true
            }
        },

        concat: {
            release: {
                options: {
                    banner: "<%= meta.banner %><%= meta.prefix %>",
                    footer: "<%= meta.suffix %>"
                },
                src: "<%= config.lib.files %>",
                dest: "<%= config.lib.files_release.normal %>"
            }
        },

        uglify: {
            options: {
                banner: '<%= meta.banner %>'
            },
            release: {
                files: {
                    '<%= config.lib.files_release.minimized %>': '<%= concat.release.dest %>'
                }
            }
        },

        jsdoc: {
            doc: {
                src: [
                    '<%= config.lib.dir.src %>/Subclass.js',
                    '<%= config.lib.dir.src %>/Module/**/*.js',
                    '<%= config.lib.dir.src %>/Event/EventManager.js',
                    '<%= config.lib.dir.src %>/Event/EventListener.js',
                    '<%= config.lib.dir.src %>/Event/Event.js'
                ],
                dest: '<%= config.doc_dir %>/'
            }
        },

        index: {
            build: {
                indexTarget: "<%= config.demo.dir.build %>/<%= config.demo.index %>",
                indexSrc: "<%= config.demo.dir.src %>/<%= config.demo.index %>",
                src: "<%= config.lib.files %>"
            },
            release: {
                indexTarget: "<%= config.demo.dir.release %>/<%= config.demo.index %>",
                indexSrc: "<%= config.demo.dir.src %>/<%= config.demo.index %>",
                src: "<%= config.lib.files_release.minimized %>"
            }
        }
    });

    grunt.registerTask("build", [
        "clean:build",
        "copy:build_lib",
        "copy:build_demo",
        "index:build"
    ]);

    grunt.registerTask("release", [
        "clean:release",
        //"copy:release_lib",
        "copy:release_demo",
        "copy:release_readme",
        "concat:release",
        "uglify:release",
        "index:release"
    ]);

    grunt.registerMultiTask("index", "Process index.html template", function() {
        var scripts = [];

        if (this.target == 'build') {
            var scriptsCwd = grunt.template.process("<%= config.lib.dir.src %>/");
            scripts = grunt.file.expand({cwd: scriptsCwd}, this.data.src);

            for (var i = 0; i < scripts.length; i++) {
                scripts[i] = "./../lib/" + scripts[i];
            }

        } else if (this.target == 'release') {
            scripts.push(this.data.src.replace(/^release/i, './..'));
        }

        var indexSrc = this.data.indexSrc;
        var indexTarget = this.data.indexTarget;

        grunt.file.copy(indexSrc, indexTarget, {
            process: function(fileContent, filePath) {
                return grunt.template.process(fileContent, {
                    data: {
                        scripts: scripts
                    }
                })
            }
        });
    });

    grunt.registerMultiTask("concat", "Altering file paths", function() {
        var filesCwd = grunt.template.process("<%= config.lib.dir.src %>/");
        var files = grunt.file.expand({ cwd: filesCwd}, this.data.src);
        var content = this.data.options.banner;

        for (var i = 0; i < files.length; i++) {
            files[i] = filesCwd + files[i];
            content += grunt.file.read(files[i]);

            if (i != files.length - 1) {
                while ([";", " ", "\n"].indexOf(content[content.length - 1]) >= 0) {
                    content = content.slice(0, -1);
                }
                content += ';\n\n// Source file: ' + files[i + 1] + '\n\n';
            }
        }
        content += this.data.options.footer;
        grunt.file.write(this.data.dest, content);
    });
};