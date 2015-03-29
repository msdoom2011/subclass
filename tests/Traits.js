
describe("Checking inheritance of trait", function() {

    it ("Trait/AppTraitForAbstract", function() {
        var AppTraitForAbstract = app.getClass('Trait/AppTraitForAbstract');
        var classParents = AppTraitForAbstract.getClassParents();
        var classChildren = AppTraitForAbstract.getClassChildren();

        expect(AppTraitForAbstract.hasParent()).toBe(false);
        expect(classParents.length).toBe(0);
        expect(classChildren.length).toBe(3);
        expect(classChildren).toContain('Abstract/AppAbstract');
        expect(classChildren).toContain('Class/AppClassBase');
        expect(classChildren).toContain('Class/AppClass');
    });

    it ("Trait/AppTraitBase", function() {
        var AppTraitBase = app.getClass('Trait/AppTraitBase');
        var classParents = AppTraitBase.getClassParents();
        var classChildren = AppTraitBase.getClassChildren();

        expect(AppTraitBase.hasParent()).toBe(false);
        expect(classParents.length).toBe(0);
        expect(classChildren.length).toBe(3);
        expect(classChildren).toContain('Trait/AppTrait');
        expect(classChildren).toContain('Class/AppClassBase');
        expect(classChildren).toContain('Class/AppClass');
    });

    it ("Trait/AppTrait", function() {
        var AppTrait = app.getClass('Trait/AppTrait');
        var classParents = AppTrait.getClassParents();
        var classChildren = AppTrait.getClassChildren();

        expect(AppTrait.hasParent()).toBe(true);
        expect(AppTrait.isInstanceOf('Trait/AppTraitBase')).toBe(true);
        expect(classParents.length).toBe(1);
        expect(classParents).toContain('Trait/AppTraitBase');
        expect(classChildren.length).toBe(1);
        expect(classChildren).toContain('Class/AppClass');
    });
});

describe("Checking definition of trait", function() {

    function checkMethods(classInst, expectedMethods)
    {
        var methodsCount = expectedMethods.length;
        var methods = Object.keys(classInst.getDefinition().getMethods(true));

        for (var i = 0; i < methods.length; i++) {
            var methodIndex;

            if ((methodIndex = expectedMethods.indexOf(methods[i])) >= 0) {
                expectedMethods.splice(methodIndex, 1);
            }
        }
        expect(methods.length).toBe(methodsCount);
        expect(expectedMethods.length).toBe(0);
    }

    it ("Trait/AppTraitForAbstract", function() {
        var AppTraitForAbstract = app.getClass("Trait/AppTraitForAbstract");
        var definition = AppTraitForAbstract.getDefinition().getData();

        expect(definition._destructed).toBeDefined();
        checkMethods(AppTraitForAbstract, ['destruct']);
    });

    it ("Trait/AppTraitBase", function() {
        var AppTraitBase = app.getClass("Trait/AppTraitBase");

        checkMethods(AppTraitBase, [
            'playWithDance',
            'playWithStop'
        ]);
    });

    it ("Trait/AppTrait", function() {
        var AppTrait = app.getClass("Trait/AppTrait");

        checkMethods(AppTrait, [
            'playWithDance',
            'playWithStop',
            'extraAction'
        ]);
    });
});