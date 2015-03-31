describe("Defining classes using class builder:", function() {
    it ("interfaces", function() {
        app.copyClass("Interface/AppInterfaceBase", "Interface/AppInterfaceBaseBuilt");
        expect(app.issetClass('Interface/AppInterfaceBaseBuilt')).toBe(true);

        app.buildClass("Interface", "Interface/TestInterface")
            .setBody({
                foo: function() {},
                bar: function() {}
            })
            .addBody({
                test: function() {}
            })
            .setConstants({
                FOO_CONST: true,
                BAR_CONST: false
            })
            .setConstant("TEST_CONST", 1)
            .save()
        ;

        var AppInterfaceBase = app.alterClass("Interface/AppInterfaceBase")
            .setParent("Interface/TestInterface")
            .save();

        expect(AppInterfaceBase.getClassParents()).toContain("Interface/TestInterface");

        app.alterClass("Interface/AppInterfaceBase")
            .removeParent()
            .save();
    });
});