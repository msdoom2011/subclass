// Karma configuration
// Generated on Wed Mar 11 2015 16:47:31 GMT+0200 (EET)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [

      // Src Files
      "src/Subclass.js",
      "src/Module.js",
      "src/ModuleAPI.js",
      "src/Tools/Tools.js",
      "src/Tools/**/*.js",
      "src/Error/ErrorManager.js",
      "src/Error/**/*.js",
      "src/Class/ClassManager.js",
      "src/Class/ClassType.js",
      "src/Class/ClassDefinition.js",
      "src/Class/ClassLoader.js",
      "src/Class/*.js",
      "src/Class/Type/Class/Class.js",
      "src/Class/Type/Class/**/*.js",
      "src/Class/Type/AbstractClass/AbstractClass.js",
      "src/Class/Type/AbstractClass/**/*.js",
      "src/Class/Type/Interface/Interface.js",
      "src/Class/Type/Interface/**/*.js",
      "src/Class/Type/Trait/Trait.js",
      "src/Class/Type/Trait/**/*.js",
      "src/Class/Type/Config/Config.js",
      "src/Class/Type/Config/**/*.js",
      "src/Class/Type/**/*.js",
      "src/Class/**/*.js",
      "src/Event/Event.js",
      "src/Event/**/*.js",
      "src/*.js",

      // Tests
      "tests/app/app.js",
      //"tests/app/**/*.js",
      "tests/*.js"
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    //browsers: ['Chrome', 'Firefox', 'Safari'],
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
