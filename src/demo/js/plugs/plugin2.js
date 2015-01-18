var appPlugin2 = Subclass.createModule('appPlugin2', {
    plugin: true,
    //pluginOf: "app",
    dataTypes: {
        //percents: { type: "string", pattern: /^[a]+%$/ }
    },
    parameters: {
        mode: "yo!!!!"
    },
    services: {
        bug4: {
            extends: 'bug',
            className: "Bug4"
        },
        bug2: {
            extends: "bug",
            className: "Bug2Changed"
        }
    },
    onReady: function() {
        console.log('****************');
        console.log('initializing plugin2');
        console.log('****************');
    }
});

appPlugin2.onReady(function() {
    console.log('****************');
    //alert('initializing plugin2 else');
    console.log('initializing plugin2 else');
    console.log('****************');
});

appPlugin2.setConfigs({
    parameters: {
        mode: "fuck!!!!"
    },
    onReady: function() {
        console.log('****************');
        //alert('initializing plugin2 else new!!!');
        console.log('initializing plugin2 else new!!!');
        console.log('****************');
    }
});

appPlugin1.getModule().getParameterManager().getParameter('mode');

appPlugin2.registerClass("Bug2Changed", {

    $_extends: "Logger/BugAbstract",

    _name: "bug2changed",

    _message: "Bug 2 changed happens."

});

appPlugin2.registerClass("Bug4", {

    $_extends: "Logger/BugAbstract",

    _name: "bug4",

    _message: "Bug 4 happens."

});
