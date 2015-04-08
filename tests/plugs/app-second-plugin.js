var appSecondPlugin = Subclass.createModule('appSecondPlugin', ['appThirdPlugin'], {
    pluginOf: "app",
    onConfig: function(evt)
    {
        configuredModules.push('appSecondPlugin');
    }
});

!function()
{
    var plug = appSecondPlugin;

    plug.registerInterface('Plugs/InterfaceBase', {

        FOO_CONST: 10,

        BAR_CONST: 20,

        stop: function() {}

    });

    plug.registerInterface('Plugs/Interface', {

        $_extends: "Plugs/InterfaceBase",

        play: function() {}

    });
}();