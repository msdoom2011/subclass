app.registerClass("Class/AppClassBase", {

    $_extends: "Abstract/AppAbstract",

    $_implements: ['Interface/AddonnableInterface'],

    $_traits: ['Trait/AppTraitBase'],

    _addons: ['addon1', 'addon2'],

    _started: false,

    _paused: false,

    _stopped: false,

    $_constructor: function(name, goal)
    {
        var AppInterface = app.getClass('Interface/AppInterface');

        this.setName(name || AppInterface.DEFAULT_NAME);
        this.setGoal(goal || AppInterface.DEFAULT_GOAL);
        this.setMode(AppInterface.MODE_PROD);
    },

    play: function()
    {
        this._started = true;
    },

    pause: function()
    {
        this._paused = true;
    },

    stop: function()
    {
        this._stopped = true;
    },

    reset: function()
    {
        this._started = false;
        this._paused = false;
        this._stopped = false;
    },

    hasAddons: function(addon)
    {
        return !!this._addons.length;
    },

    addAddon: function(addon)
    {
        this._addons.push(addon);
    },

    getAddons: function()
    {
        return this._addons;
    }
});
