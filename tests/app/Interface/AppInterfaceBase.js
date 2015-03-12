describe("Registering", function() {
    it("Interface/AppInterfaceBase", function() {
        app.registerInterface("Interface/AppInterfaceBase", {

            DEFAULT_NAME: "MyApp",

            getName: function() {},

            setName: function(name) {}

        });

        expect(app.issetClass("Interface/AppInterfaceBase")).toBe(true);

        var classInst = app.getClass("Interface/AppInterfaceBase");
        var classInstDef = classInst.getDefinition();
        var expectedMethods = ['getName', 'setName'];
        var methods = classInstDef.getMethods();

        for (var i = 0; i < methods.length; i++) {
            var methodIndex;

            if ((methodIndex = expectedMethods.indexOf(methods[i])) >= 0) {
                expectedMethods.splice(methodIndex, 1);
            }
        }
        expect(methods.length).toBe(2);
        expect(expectedMethods.length).toBe(0);
    });
});