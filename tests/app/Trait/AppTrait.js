app.registerTrait("Trait/AppTrait", {

    $_extends: "Trait/AppTraitBase",

    $_constants: {

        THE_FIRST_TRAIT_CONSTANT: true

    },

    extraAction: function()
    {
        return true;
    }
});