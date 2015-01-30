
//var app = Subclass.createModule('app', /*['appPlugin1',*/ ['appPlugin2'], {
var app = Subclass.createModule('app', [{
        name: 'appPlugin1',
        file: "/SubclassJS/build/demo/js/plugs/plugin1"
    },
    //,'appPlugin2'
    //{
    //    name: 'appPlugin2',
    //    file: "/SubclassJS/build/demo/js/plugs/plugin2"
    //}
], {
    rootPath: "/SubclassJS/build/demo/js/app/",
    files: ["appClasses.js"],
    dataTypes: {
        percents: { type: "string", pattern: /^[a-z]+%$/ },
        bigNumber: { type: "number", minValue: 1000000 }
    },
    parameters: {
        mode: "dev"
    },
    services: {
        logger: {
            singleton: true,
            className: "Logger/Logger",
            arguments: ['%mode%'],
            calls: {
                setPsix: [
                    '%mode% and yo!!!!',
                    true
                ]
            }
        },
        bug: {
            abstract: true,
            tags: ['logger']
        },
        bug1: {
            extends: "bug",
            className: "Logger/Bug1"
        },
        bug2: {
            extends: "bug",
            className: "Logger/Bug2"
        }
    }
});


