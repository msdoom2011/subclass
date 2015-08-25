var appFirstPlugin = Subclass.createModule('appFirstPlugin', {
    plugin: true
});

!function() {

    var plug = appFirstPlugin;

    plug.onSetup(function(evt) {
        configuredModules.push('appFirstPlugin');
    });

    plug.registerAbstractClass("Plugs/AbstractClassBase", {

        $_abstract: {
            run: function() {}
        }
    });

    plug.registerAbstractClass("Plugs/AbstractClass", {

        $_extends: "Plugs/AbstractClassBase",

        $_abstract: {
            walk: function() {}
        }
    });
}();