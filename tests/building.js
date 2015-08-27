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
            .save()
        ;
        expect(AppInterfaceBase.getClassParents()).toContain("Interface/TestInterface");

        app.alterClass("Interface/AppInterfaceBase")
            .removeParent()
            .save()
        ;
    });

    it ("abstract classes", function() {
        app.alterClass("Abstract/AppAbstractBase")
            .addAbstractMethod("extraAbstract", function() {})
            .save()
        ;
    });

    it ("classes", function() {
        app.alterClass("Class/AppClassBase")
            .addBody({
                extraAbstract: function() {
                    // do something
                }
            })
            .save()
        ;
        expect(app.getClass("Class/AppClassBase").getDefinition().issetMethod('extraAbstract')).toBe(true);
        app.alterClass("Abstract/AppAbstractBase")
            .removeAbstractMethod("extraAbstract")
            .save()
        ;
    });

    it ("anonymous classes", function() {
        var anonymousClass = app.buildClass('Class')
            .setBody({
                _psix: null,

                setPsix: function(psix)
                {
                    this._psix = psix;
                },

                getPsix: function()
                {
                    return this._psix;
                }
            })
            .create()
        ;
        var inst = anonymousClass.createInstance();
        expect(inst.getPsix()).toBe(null);
        inst.setPsix(100);
        expect(inst.getPsix()).toBe(100);
    });
});