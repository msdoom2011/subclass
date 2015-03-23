describe("Altering interface", function() {
    it ("Interface/AppInterfaceBase", function() {
        var test = function() {
            var builder = app.alterClass("Interface/AppInterfaceBase");
        };
        expect(test).toThrow();
    });
    it ("Interface/BuiltInterfaceBase", function() {

    });
});