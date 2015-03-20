
describe("Checking inheritance of trait", function() {

    it ("Trait/AppTraitForAbstract", function() {
        var AppTraitForAbstract = app.getClass('Trait/AppTraitForAbstract');
        expect(AppTraitForAbstract.hasParent()).toBe(false);
    });

    it ("Trait/AppTraitBase", function() {
        var AppTraitBase = app.getClass('Trait/AppTraitBase');
        expect(AppTraitBase.hasParent()).toBe(false);
    });

    it ("Trait/AppTrait", function() {
        var AppTrait = app.getClass('Trait/AppTrait');
        expect(AppTrait.hasParent()).toBe(true);
        expect(AppTrait.isInstanceOf('Trait/AppTraitBase')).toBe(true);
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