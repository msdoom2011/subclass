describe("Defining classes using class builder:", function() {
    it ("interfaces", function() {
        app.copyClass("Interface/AppInterfaceBase", "Interface/AppInterfaceBaseBuilt");
        expect(app.issetClass('Interface/AppInterfaceBaseBuilt')).toBe(true);

        app.buildClass("Interface", "Interface/TestInterface")
            .setBody({
                foo: function() {},
                bar: function() {}
            })
            .addToBody("test", function() {})
            .setConstants({
                FOO_CONST: true,
                BAR_CONST: false
            })
            .setConstant("TEST_CONST", 1)
            .setConstructor(function() {})
            .save()
        ;

        var builder = app.alterClass("Interface/AppInterfaceBase");
        builder.setParent("Interface/TestInterface");
        builder.save();
    });
});