describe("Registering", function() {
    it("Abstract/AppAbstract", function() {
        var test = function() {
            app.registerAbstractClass("AppAbstract", {

                $_abstract: {

                    reset: function() {}

                },

                execute: function()
                {
                    console.log("=======================");
                    console.log("======== START ========");
                    console.log("=======================");

                    this.getParent().execute.call(this);
                    this.reset();

                    console.log("=======================");
                    console.log("========= END =========");
                    console.log("=======================");
                }
            });
        };
        expect(test).not.toThrow();
    });
});
