
describe("Checking inheritance of abstract class", function() {

    it ("Abstract/AppAbstractBase", function() {
        var AppAbstractBase = app.getClass('Abstract/AppAbstractBase');
        var classParents = AppAbstractBase.getClassParents();
        var classChildren = AppAbstractBase.getClassChildren();

        expect(AppAbstractBase.hasParent()).toBe(false);
        expect(AppAbstractBase.isImplements('Interface/AppInterface')).toBe(true);
        expect(AppAbstractBase.isImplements('Interface/AppInterfaceBase')).toBe(true);

        expect(classParents.length).toBe(2);
        expect(classParents).toContain('Interface/AppInterfaceBase');
        expect(classParents).toContain('Interface/AppInterface');

        expect(classChildren.length).toBe(3);
        expect(classChildren).toContain('Abstract/AppAbstract');
        expect(classChildren).toContain('Class/AppClassBase');
        expect(classChildren).toContain('Class/AppClass');
    });

    it ("Abstract/AppAbstract", function() {
        var AppAbstract = app.getClass('Abstract/AppAbstract');
        var classParents = AppAbstract.getClassParents();
        var classChildren = AppAbstract.getClassChildren();

        expect(AppAbstract.hasParent()).toBe(true);
        expect(AppAbstract.isInstanceOf('Abstract/AppAbstractBase')).toBe(true);
        expect(AppAbstract.isInstanceOf('Interface/AppInterface')).toBe(true);
        expect(AppAbstract.isInstanceOf('Interface/AppInterfaceBase')).toBe(true);

        expect(classParents.length).toBe(4);
        expect(classParents).toContain('Abstract/AppAbstractBase');
        expect(classParents).toContain('Interface/AppInterfaceBase');
        expect(classParents).toContain('Interface/AppInterface');
        expect(classParents).toContain('Trait/AppTraitForAbstract');

        expect(classChildren.length).toBe(2);
        expect(classChildren).toContain('Class/AppClassBase');
        expect(classChildren).toContain('Class/AppClass');
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