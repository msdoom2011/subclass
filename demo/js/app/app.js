
//var app = Subclass.createModule('app', /*['appPlugin1',*/ ['appPlugin2'], {
var app = Subclass.createModule('app', [
    //{
    //    name: 'appPlugin1',
    //    file: "/Subclass/build/demo/js/plugs/plugin1"
    //},
    //'appPlugin1',
    //'appPlugin2',
    //{
    //    name: 'appPlugin2',
    //    file: "/Subclass/build/demo/js/plugs/plugin2"
    //}
], {
    rootPath: "/subclass/Subclass/build/demo/js/app/",
    files: ["appClasses.js"],
    //dataTypes: {
    //    percents: { type: "string", pattern: /^[a-z]+%$/ },
    //    bigNumber: { type: "number", minValue: 1000000 },
    //    //number: { type: "number", maxValue: -10000 }
    //},
    //parameters: {
    //    mode: "dev"
    //},
    //services: {
    //    logger: {
    //        singleton: true,
    //        className: "Logger/Logger",
    //        arguments: ['%mode%'],
    //        calls: {
    //            setPsix: [
    //                '%mode% and yo!!!!',
    //                true
    //            ]
    //        }
    //    },
    //    bug: {
    //        abstract: true,
    //        tags: ['logger']
    //    },
    //    bug1: {
    //        extends: "bug",
    //        className: "Logger/Bug1"
    //    },
    //    bug2: {
    //        extends: "bug",
    //        className: "Logger/Bug2"
    //    }
    //}
});


