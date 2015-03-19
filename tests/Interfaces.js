describe("Checking definition of interface", function() {

    function checkMethods(classInst, expectedMethods)
    {
        var classInstDef = classInst.getDefinition();
        var methodsCount = expectedMethods.length;
        var methods = Object.keys(classInstDef.getMethods(true));

        for (var i = 0; i < methods.length; i++) {
            var methodIndex;

            if ((methodIndex = expectedMethods.indexOf(methods[i])) >= 0) {
                expectedMethods.splice(methodIndex, 1);
            }
        }
        expect(methods.length).toBe(methodsCount);
        expect(expectedMethods.length).toBe(0);
    }

    function checkConstants(classInst, constants)
    {
        for (var constantName in constants) {
            if (constants.hasOwnProperty(constantName)) {
                expect(classInst[constantName]).toBe(constants[constantName]);
            }
        }
    }

    describe("Interface/AppInterfaceBase", function() {
        var classInst = app.getClass("Interface/AppInterfaceBase");

        it("and correctness of abstract methods", function() {
            checkMethods(classInst, [
                'getName',
                'setName'
            ]);
        });

        it("and correctness of constants", function() {
            checkConstants(classInst, {
                DEFAULT_NAME: 'MyApp'
            })
        });
    });

    describe("Interface/AppInterface", function() {
        var classInst = app.getClass('Interface/AppInterface');

        it("and correctness of abstract methods", function() {
            checkMethods(classInst, [
                'getName',
                'setName',
                'getMode',
                'setMode',
                'getGoal',
                'setGoal',
                'execute'
            ]);
        });

        it ("and correctness of constants", function() {
            checkConstants(classInst, {
                DEFAULT_NAME: "App",
                DEFAULT_GOAL: "MyAppGoal",
                MODE_DEV: 1,
                MODE_PROD: 2
            })
        });
    });
});