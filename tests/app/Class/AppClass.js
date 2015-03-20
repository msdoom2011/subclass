app.registerClass("Class/AppClass", {

    $_extends: "Class/AppClassBase",

    $_traits: ['Trait/AppTrait'],

    $_constructor: function(name, goal, mode)
    {
        this.callParent('$_constructor', name, goal);
        var appInterface = app.getClass('Interface/AppInterface');

        if ([appInterface.MODE_DEV, appInterface.MODE_PROD].indexOf(mode) < 0) {
            throw new Error();
        }
        this._mode = mode;
    },

    removeAddons: function()
    {
        this._addons = [];
    },

    destruct: function()
    {
        this._destructed = 2;
    },

    playWithStop: function()
    {
        return false;
    }
});
