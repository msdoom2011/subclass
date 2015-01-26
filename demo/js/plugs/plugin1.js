var appPlugin1 = Subclass.createModule('appPlugin1', {
    //plugin: true,
    //autoload: false,
    pluginOf: "app",
    rootPath: "/SubclassJS/build/demo/js/plugs/",
    dataTypes: {
        percents: { type: "string", pattern: /^\d+%$/ }
    },
    parameters: {
        mode: "prod"
    },
    services: {
        bug3: {
            extends: 'bug',
            className: "Bug3"
        }
    }
});

appPlugin1.onReady(function() {
    console.log('****************');
    //alert('initializing plugin1');
    console.log('initializing plugin1');
    console.log('****************');
});

appPlugin1.registerClass("Bug3", {

    $_extends: "Logger/BugAbstract",

    _name: "bug3",

    _message: "Bug 3 happens."

});


//var bug3 = appPlugin1.getClass('Bug3').createInstance();
