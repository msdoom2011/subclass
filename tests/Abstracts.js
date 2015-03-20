
describe("Checking inheritance of abstract class", function() {

    it ("Abstract/AppAbstractBase", function() {
        var AppAbstractBase = app.getClass('Abstract/AppAbstractBase');
        expect(AppAbstractBase.hasParent()).toBe(false);
        expect(AppAbstractBase.isImplements('Interface/AppInterface')).toBe(true);
        expect(AppAbstractBase.isImplements('Interface/AppInterfaceBase')).toBe(true);
    });

    it ("Abstract/AppAbstract", function() {
        var AppAbstract = app.getClass('Abstract/AppAbstract');
        expect(AppAbstract.hasParent()).toBe(true);
        expect(AppAbstract.isInstanceOf('Abstract/AppAbstractBase')).toBe(true);
        expect(AppAbstract.isImplements('Interface/AppInterface')).toBe(true);
        expect(AppAbstract.isImplements('Interface/AppInterfaceBase')).toBe(true);
    });
});

describe("Checking definition of abstract class", function() {

    function checkAbstractMethods(classInst, expectedMethods)
    {
        var methodsCount = expectedMethods.length;
        var methods = Object.keys(classInst.getAbstractMethods());

        for (var i = 0; i < methods.length; i++) {
            var methodIndex;

            if ((methodIndex = expectedMethods.indexOf(methods[i])) >= 0) {
                expectedMethods.splice(methodIndex, 1);
            }
        }
        expect(methods.length).toBe(methodsCount);
        expect(expectedMethods.length).toBe(0);
    }

    it ("Abstract/AppAbstractBase", function() {
        var AppAbstractBase = app.getClass('Abstract/AppAbstractBase');

        checkAbstractMethods(AppAbstractBase, [
            'getName',
            'setName',
            'getMode',
            'setMode',
            'getGoal',
            'setGoal',
            'execute',
            'play',
            'pause',
            'stop'
        ]);
    });

    it ("Abstract/AppAbstract", function() {
        var classInst = app.getClass('Abstract/AppAbstract');

        expect(classInst.getDefinition().getData()._destructed).toBe(false);

        checkAbstractMethods(classInst, [
            'getName',
            'setName',
            'getMode',
            'setMode',
            'getGoal',
            'setGoal',
            'execute',
            'play',
            'pause',
            'stop',
            'reset',
            'destruct'
        ]);
   });
});