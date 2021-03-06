// Karma configuration
// Generated on Sun May 21 2017 07:19:27 GMT+0800 (CST)

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        //让karma+mocha+browserify成功配置的关键，请查阅https://github.com/nikku/karma-browserify
        //20170521 重要: include browserify first in used frameworks
        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['browserify', 'mocha'],


        // list of files / patterns to load in the browser
        files: [
            'test/**/*Spec.js'
        ],


        // list of files to exclude
        exclude: [
            '**/*.swp'
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'test/**/*.js': ['browserify']
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['mocha'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Firefox', 'Chrome'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,

        // add additional browserify configuration properties here
        // such as transform and/or debug=true to generate source maps
        browserify: {
            debug: true,
            transform: ['brfs', "browserify-shim"]
        },

        watchify: {
            poll: true
        }
    });
};
