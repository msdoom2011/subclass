describe("Checking definition of interface", function() {
    describe("Interface/AppInterfaceBase", function() {
        var classInst = app.getClass("Interface/AppInterfaceBase");

        it("and checking count of abstract methods", function() {
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

        it("and checking correctness of constants definition", function() {
            expect(classInst.DEFAULT_NAME).toBe('MyApp');
            console.log('jfksjfklsjdkf');
        });
    });
});