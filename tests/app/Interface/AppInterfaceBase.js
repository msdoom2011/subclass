describe("Registering", function() {

    it("interface Interface/AppInterfaceBase", function() {
        app.registerInterface("Interface/AppInterfaceBase", {

            DEFAULT_NAME: "MyApp",

            getName: function() {},

            setName: function(name) {}

        });
        console.log('jsfdlkfjklsjdfl');
        expect(app.issetClass("Interface/AppInterfaceBase")).toBe(true);
    });
});