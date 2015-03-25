
describe("Checking inheritance of interface", function() {

    it ("Interface/AppInterfaceBase", function() {
        var AppInterfaceBase = app.getClass('Interface/AppInterfaceBase');
        var classParents = AppInterfaceBase.getClassParents();
        var classChildren = AppInterfaceBase.getClassChildren();

        expect(AppInterfaceBase.hasParent()).toBe(false);
        expect(AppInterfaceBase.isInstanceOf('Interface/FalseInterface')).toBe(false);

        expect(classChildren).toContain("Interface/AppInterface");
        expect(classChildren).toContain("Abstract/AppAbstractBase");
        expect(classChildren).toContain("Abstract/AppAbstract");
        expect(classChildren).toContain("Class/AppClassBase");
        expect(classChildren).toContain("Class/AppClass");

        expect(classChildren.length).toBe(5);
        expect(classParents.length).toBe(0);
    });

    it ("Interface/AppInterface", function() {
        var AppInterface = app.getClass('Interface/AppInterface');
        var classParents = AppInterface.getClassParents();
        var classChildren = AppInterface.getClassChildren();

        expect(AppInterface.hasParent()).toBe(true);
        expect(AppInterface.isInstanceOf('Interface/AppInterfaceBase')).toBe(true);

        expect(classChildren.length).toBe(4);
        expect(classChildren).toContain("Abstract/AppAbstractBase");
        expect(classChildren).toContain("Abstract/AppAbstract");
        expect(classChildren).toContain("Class/AppClassBase");
        expect(classChildren).toContain("Class/AppClass");

        expect(classParents).toContain("Interface/AppInterfaceBase");
        expect(classParents.length).toBe(1);
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