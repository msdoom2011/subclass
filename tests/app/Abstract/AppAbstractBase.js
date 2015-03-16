describe("Registering", function() {
    it("Abstract/AppAbstractBase", function() {
        app.registerAbstractClass("Abstract/AppAbstractBase", {

            $_implements: ["Interface/AppInterface"],

            $_abstract: {

                play: function() {},

                pause: function() {},

                stop: function() {}
            },

            _mode: null,

            _name: null,

            _goal: null,

            getMode: function()
            {
                return this._mode;
            },

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
    });
});