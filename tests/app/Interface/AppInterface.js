describe("Registering", function() {
    it("Interface/AppInterface", function() {
        var test = function() {
            app.registerInterface("Interface/AppInterface", {

                $_extends: "Interface/AppInterfaceBase",

                DEFAULT_GOAL: "MyAppGoal",

                getGoal: function() {},

                setGoal: function(goal) {},

                execute: function() {}
            });
        };
        expect(test).not.toThrow();
    });
});