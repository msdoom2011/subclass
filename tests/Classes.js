
describe("Checking inheritance of class", function() {

    it ("Class/AppClassBase", function() {
        var AppClassBase = app.getClass('Class/AppClassBase');

        expect(AppClassBase.hasParent()).toBe(true);
        expect(AppClassBase.isInstanceOf('Abstract/AppAbstract')).toBe(true);
        expect(AppClassBase.isInstanceOf('Abstract/AppAbstractBase')).toBe(true);
        expect(AppClassBase.isImplements('Interface/AddonnableInterface')).toBe(true);
        expect(AppClassBase.isImplements('Interface/AppInterface')).toBe(true);
        expect(AppClassBase.isImplements('Interface/AppInterfaceBase')).toBe(true);
    });

    it ("Class/AppClass", function() {
        var AppClass = app.getClass('Class/AppClass');

        expect(AppClass.hasParent()).toBe(true);
        expect(AppClass.isInstanceOf('Class/AppClassBase')).toBe(true);
        expect(AppClass.isInstanceOf('Abstract/AppAbstract')).toBe(true);
        expect(AppClass.isInstanceOf('Abstract/AppAbstractBase')).toBe(true);
        expect(AppClass.isImplements('Interface/AddonnableInterface')).toBe(true);
        expect(AppClass.isImplements('Interface/AppInterface')).toBe(true);
        expect(AppClass.isImplements('Interface/AppInterfaceBase')).toBe(true);
    });
});

describe("Checking definition of class", function() {

    it ("Class/FailClass", function() {
        var test = function() {
            var classInst = app.getClass('Class/FailClass');
        };
        expect(test).toThrow();
    });

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
        var inst = AppClass.createInstance("NewApp", "Creating new app", AppInterface.MODE_DEV);
        var addons = ['addon1', 'addon2'];

        expect(inst.getName()).toBe('NewApp');
        expect(inst.getGoal()).toBe('Creating new app');
        expect(inst.getMode()).toBe(AppInterface.MODE_DEV);

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
    });
});