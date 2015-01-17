
var app = Subclass.createModule('app', /*['appPlugin1', 'appPlugin2'],*/ {
    autoload: true,
    rootPath: "/SubclassJS/build/demo/js/app/",
    files: ["appClasses.js"],
    onReadyCall: true,
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


