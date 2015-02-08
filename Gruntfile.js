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
                ' * <%= pkg.homepage %>\n' +
                ' *\n' +
                ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> | <%= pkg.author.email %>\n' +
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
            },
            doc: {
                src: "<%= config.doc_dir %>"
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
                banner: '<%= meta.banner %>',
                mangle: {
                    except: [
                        "AbstractClass",
                        "Class",
                        "ClassType",
                        "Config",
                        "Interface",
                        "Trait"
                    ]
                }
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
                    //'<%= config.lib.dir.src %>/Module/**/*.js',
                    //'<%= config.lib.dir.src %>/Event/**/*.js',
                    //'<%= config.lib.dir.src %>/Parameter/**/*.js',
                    //'<%= config.lib.dir.src %>/Service/**/*.js',
                    //'<%= config.lib.dir.src %>/Tools/**/*.js',
                    '<%= config.lib.dir.src %>/Error/Error.js',
                    '<%= config.lib.dir.src %>/Error/InvalidArgumentError.js'
                ],
                dest: '<%= config.doc_dir %>/'
            }
        },

        minimize: {
            release: '<%= uglify.release.files %>'
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
        "copy:release_demo",
        "copy:release_readme",
        "concat:release",
        "uglify:release",
        'minimize:release',
        "index:release"
    ]);

    grunt.registerTask("doc", [
        "clean:doc",
        "jsdoc:doc"
    ]);

    grunt.registerTask("default", [
        "build", "release", "doc"
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

    grunt.registerMultiTask("minimize", "Minimizing uglified js file", function() {
        var files = this.data;
        var fileName = grunt.template.process(Object.keys(files)[0]);
        var fileContent = grunt.file.read(fileName);

        fileContent = fileContent.replace(/window\.Subclass/i, "var ___;___");
        fileContent = fileContent.replace(/Subclass\./ig, '___.');
        fileContent = fileContent.replace(/([\\'\\"][a-z\/ ]*)___([a-z\/ ]*[^\\'\\"])/ig, '$1Subclass$2');
        fileContent = fileContent.replace(/___/g, '$$');
        fileContent = fileContent.replace(fileContent.slice(-4), ";window.Subclass=$" + fileContent.slice(-4));

        grunt.file.write(fileName, fileContent, {
            encoding: 'UTF-8'
        })

    });
};