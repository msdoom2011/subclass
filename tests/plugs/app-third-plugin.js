var appThirdPlugin = Subclass.createModule('appThirdPlugin', {
    plugin: true,
    onConfig: function(evt)
    {
        configuredModules.push('appThirdPlugin');
    }
});

!function() {

    var plug = appThirdPlugin;

    plug.registerTrait("Plugs/TraitBase", {

        stop: function() {
            return true;
        }
    });

    plug.registerTrait("Plugs/Trait", {

        $_extends: "Plugs/TraitBase",

        go: function() {
            return true;
        }
    });

}();