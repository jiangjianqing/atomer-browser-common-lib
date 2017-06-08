/**
 * Created by jjq on 5/18/17.
 */
var gulp = require('gulp');
var browserify = require('browserify');
var pkg = require('./package.json');

//解决browserify + gulp 的注意点 ： Stream 转换
//vinyl-source-stream + vinyl-buffer
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require("gulp-sourcemaps");

var browserifyOpts = pkg.browserify || {};

var paths = {
    scripts: ['client/js/**/*.coffee', '!client/external/**/*.coffee'],
    images: 'client/img/**/*'
};
//20170601 非常重要：transform的顺序有严格要求,babelify 一定要放在最前面,否则会有问题，详细见package.json[transform]
//20170601 vueify存在问题,require('xxx.vue')时会出现[Vue warn]: Failed to mount component: template or render function not defined
//20170601 暂时性结论,browserify目前不适合对.vue文件进行bundle操作,webpack更合适,react目前无问题
gulp.task("build", function(){
    var b = browserify(browserifyOpts);
    //20170520：还没找到在package.json中放requre的格式
    b.require('./lib/services/browser-storage', {expose: 'browser-storage'});

    //注意：这里使用gulp.dest()输出时会出现问题，使用process.stdout输出则不会，测试后加入source和buffer急性转换即可
    return b.bundle()
        .pipe(source('common-bundle.js')) // gives streaming vinyl file object
        .pipe(buffer()) // <----- convert from streaming to buffered vinyl file object
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write("."))
        //.pipe(uglify()) // now gulp-uglify works
        .pipe(gulp.dest(pkg.output));


    /*
     在上面的代码中，debug: true是告知Browserify在运行同时生成内联sourcemap用于调试。
     引入gulp-sourcemaps并设置loadMaps: true是为了读取上一步得到的内联sourcemap，并将其转写为一个单独的sourcemap文件。
     vinyl-source-stream用于将Browserify的bundle()的输出转换为Gulp可用的[vinyl][]（一种虚拟文件格式）流。vinyl-buffer用于将vinyl流转化为buffered vinyl文件（gulp-sourcemaps及大部分Gulp插件都需要这种格式）。



     */
});

gulp.task('default', ["build"]);