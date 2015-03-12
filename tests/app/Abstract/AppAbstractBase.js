describe("Registering", function() {
    it("Abstract/AppAbstractBase", function() {
        var test = function() {
            app.registerAbstractClass("Abstract/AppAbstractBase", {

                $_implements: ["AppInterface"],

                $_abstract: {

                    play: function() {},

                    pause: function() {},

                    stop: function() {}
                },

                _name: null,

                _goal: null,

                setName: function (name)
                {
                    this._name = name;
                },

                getName: function ()
                {
                    return this._name;
                },

                setGoal: function (goal)
                {
                    this._goal = goal;
                },

                getGoal: function ()
                {
                    return this._goal;
                },

                execute: function ()
                {
                    this.play();
                    this.pause();
                    this.play();
                    this.stop();
                }
            });
        };
        expect(test).not.toThrow();
    });
});