app.registerTrait("Trait/AppTraitForAbstract", {

    _destructed: false,

    destruct: function()
    {
        this._destructed = 1;
    }
});