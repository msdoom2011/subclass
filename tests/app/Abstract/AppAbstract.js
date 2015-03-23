app.registerAbstractClass("Abstract/AppAbstract", {

    $_extends: "Abstract/AppAbstractBase",

    $_traits: ["Trait/AppTraitForAbstract"],

    $_abstract: {

        reset: function() {},

        destruct: function() {}
    },

    execute: function()
    {
        this.callParent('execute');

        return true;
    }
});