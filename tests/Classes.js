
describe("Checking inheritance of class", function() {

    it ("Class/AppClassBase", function() {
        var AppClassBase = app.getClass('Class/AppClassBase');
        var classParents = AppClassBase.getClassParents();
        var classChildren = AppClassBase.getClassChildren();

        expect(AppClassBase.hasParent()).toBe(true);
        expect(AppClassBase.isInstanceOf('Abstract/AppAbstract')).toBe(true);
        expect(AppClassBase.isInstanceOf('Abstract/AppAbstractBase')).toBe(true);
        expect(AppClassBase.isImplements('Interface/AddonableInterface')).toBe(true);
        expect(AppClassBase.isImplements('Interface/AppInterface')).toBe(true);
        expect(AppClassBase.isImplements('Interface/AppInterfaceBase')).toBe(true);

        expect(classParents.length).toBe(7);
        expect(classParents).toContain('Interface/AppInterfaceBase');
        expect(classParents).toContain('Interface/AppInterface');
        expect(classParents).toContain('Interface/AddonableInterface');
        expect(classParents).toContain('Abstract/AppAbstractBase');
        expect(classParents).toContain('Abstract/AppAbstract');
        expect(classParents).toContain('Trait/AppTraitBase');
        expect(classParents).toContain('Trait/AppTraitForAbstract');

        expect(classChildren.length).toBe(1);
        expect(classChildren).toContain('Class/AppClass');
    });

    it ("Class/AppClass", function() {
        var AppClass = app.getClass('Class/AppClass');
        var classParents = AppClass.getClassParents();
        var classChildren = AppClass.getClassChildren();

        expect(AppClass.hasParent()).toBe(true);
        expect(AppClass.isInstanceOf('Class/AppClassBase')).toBe(true);
        expect(AppClass.isInstanceOf('Abstract/AppAbstract')).toBe(true);
        expect(AppClass.isInstanceOf('Abstract/AppAbstractBase')).toBe(true);
        expect(AppClass.isImplements('Interface/AddonableInterface')).toBe(true);
        expect(AppClass.isImplements('Interface/AppInterface')).toBe(true);
        expect(AppClass.isImplements('Interface/AppInterfaceBase')).toBe(true);

        expect(classChildren.length).toBe(0);
        expect(classParents.length).toBe(9);
        expect(classParents).toContain('Interface/AppInterfaceBase');
        expect(classParents).toContain('Interface/AppInterface');
        expect(classParents).toContain('Interface/AddonableInterface');
        expect(classParents).toContain('Abstract/AppAbstractBase');
        expect(classParents).toContain('Abstract/AppAbstract');
        expect(classParents).toContain('Trait/AppTraitBase');
        expect(classParents).toContain('Trait/AppTrait');
        expect(classParents).toContain('Trait/AppTraitForAbstract');
        expect(classParents).toContain('Class/AppClassBase');

        var classParentsGrouped = AppClass.getClassParents(true);
        var classParentsGroupedKeys = Object.keys(classParentsGrouped);

        expect(classParentsGroupedKeys.length).toBe(4);
        expect(classParentsGroupedKeys).toContain('Class');
        expect(classParentsGroupedKeys).toContain('AbstractClass');
        expect(classParentsGroupedKeys).toContain('Trait');
        expect(classParentsGroupedKeys).toContain('Interface');

        expect(classParentsGrouped['Class'].length).toBe(1);
        expect(classParentsGrouped['AbstractClass'].length).toBe(2);
        expect(classParentsGrouped['Interface'].length).toBe(3);
        expect(classParentsGrouped['Trait'].length).toBe(3);
    });
});

describe("Checking definition of class", function() {

    it ("Class/AppClassBase", function() {
        var AppInterfaceBase = app.getClass('Interface/AppInterfaceBase');
        var AppInterface = app.getClass('Interface/AppInterface');
        var AppClassBase = app.getClass('Class/AppClassBase');
        var inst = AppClassBase.createInstance();

        expect(inst.getName()).toBe(AppInterface.DEFAULT_NAME);
        expect(inst.getGoal()).toBe(AppInterface.DEFAULT_GOAL);
        expect(inst.getMode()).toBe(AppInterface.MODE_PROD);

        inst = AppClassBase.createInstance('CustomApp', 'Producing bugs');

        expect(inst.getName()).toBe('CustomApp');
        expect(inst.getGoal()).toBe('Producing bugs');
        expect(inst.getMode()).toBe(AppInterface.MODE_PROD);

        expect(inst.execute()).toBe(true);
        expect(inst._started).toBe(true);
        expect(inst._paused).toBe(true);
        expect(inst._stopped).toBe(true);

        inst.reset();

        expect(inst._started).toBe(false);
        expect(inst._paused).toBe(false);
        expect(inst._stopped).toBe(false);

        expect(inst.playWithDance()).toBe(true);
        expect(inst.playWithStop()).toBe(true);

        inst.destruct();
        expect(inst._destructed).toBe(1);
    });

    it ("class/AppClass", function() {
        var AppClass = app.getClass('Class/AppClass');
        var AppInterface = app.getClass('Interface/AppInterface');
        var classInst = AppClass.createInstance("NewApp", "Creating new app", AppInterface.MODE_DEV);
        var addons = ['addon1', 'addon2'];
        var instances = [classInst, classInst.getCopy()];

        expect(classInst.isInstanceOf('Class/AppClass')).toBe(true);
        expect(classInst.isInstanceOf('Interface/AppInterface')).toBe(true);
        expect(classInst.isInstanceOf(AppClass)).toBe(true);
        expect(classInst.isInstanceOf(AppInterface)).toBe(true);

        for (var j = 0; j < instances.length; j++) {
            var inst = instances[j];
            expect(inst.getName()).toBe('NewApp');
            expect(inst.getGoal()).toBe('Creating new app');
            expect(inst.getMode()).toBe(AppInterface.MODE_DEV);
            expect(inst.configuredMethod()).toBe(true);
            expect(inst.traitMethod()).toBe(1000);

            for (var i = 0; i < addons.length; i++) {
                expect(inst.getAddons()).toContain(addons[i]);
            }
            inst.removeAddons();
            expect(inst.getAddons().length).toBe(0);

            inst.addAddon('addonNew');
            expect(inst.getAddons()).toContain("addonNew");

            expect(inst.playWithDance()).toBe(true);
            expect(inst.playWithStop()).toBe(false);

            inst.destruct();
            expect(inst._destructed).toBe(2);
        }
    });
});

describe("Checking plugins class", function() {
    it ("existence", function() {

        expect(app.issetClass('Plugs/Class')).toBe(true);

    });
});