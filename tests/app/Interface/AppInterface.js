app.registerInterface("Interface/AppInterface", {

    $_extends: "Interface/AppInterfaceBase",

    $_constants: {

        MODE_DEV: 1,

        MODE_PROD: 2
    },

    DEFAULT_NAME: "App",

    DEFAULT_GOAL: "MyAppGoal",

    getMode: function() {},

    setMode: function(mode) {},

    getGoal: function() {},

    setGoal: function(goal) {},

    execute: function() {}
});