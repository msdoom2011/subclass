

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

describe("Checking inheritance of interface", function() {

    it ("Interface/AppInterfaceBase", function(done) {
        setTimeout(function() {
            var AppInterfaceBase = app.getClass('Interface/AppInterfaceBase');
            expect(AppInterfaceBase.hasParent()).toBe(false);
            expect(AppInterfaceBase.isInstanceOf('Interface/FalseInterface')).toBe(false);
            expect(AppInterfaceBase.getChildClasses()).toContain("Interface/AppInterface");
            expect(AppInterfaceBase.getChildClasses().length).toBe(1);
            expect(AppInterfaceBase.getParentClasses().length).toBe(0);

            console.log(AppInterfaceBase.getChildClasses());
            app.getClass('Class/AppClass');
            console.log(AppInterfaceBase.getChildClasses());
            console.log('--------');
            done();
        }, 500);
    });

    it ("Interface/AppInterface", function() {
        var AppInterface = app.getClass('Interface/AppInterface');
        expect(AppInterface.hasParent()).toBe(true);
        expect(AppInterface.isInstanceOf('Interface/AppInterfaceBase')).toBe(true);
        expect(AppInterface.getChildClasses().length).toBe(0);
        expect(AppInterface.getParentClasses()).toContain("Interface/AppInterfaceBase");
        expect(AppInterface.getParentClasses().length).toBe(1);
    });

});

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
        var AppInterfaceBase = app.getClass("Interface/AppInterfaceBase");

        it("and correctness of abstract methods", function() {
            checkMethods(AppInterfaceBase, [
                'getName',
                'setName'
            ]);
        });
    });

    describe("Interface/AppInterface", function() {
        var AppInterface = app.getClass('Interface/AppInterface');

        it("and correctness of abstract methods", function() {
            checkMethods(AppInterface, [
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
            checkConstants(AppInterface, {
                DEFAULT_NAME: "MyApp",
                DEFAULT_GOAL: "MyAppGoal",
                MODE_DEV: 1,
                MODE_PROD: 2
            })
        });
    });

    describe("Interface/AddonnableInterface", function() {
        var AddonnableInterface = app.getClass('Interface/AddonnableInterface');

        it("and correctness of abstract methods", function() {
            checkMethods(AddonnableInterface, [
                'hasAddons',
                'getAddons',
                'addAddon'
            ]);
        });
    });
});