describe("Altering class", function() {

    it ("Class/FailClass", function() {
        var test = function() {
            var builder = app.alterClass("Class/FailClass");
        };
        expect(test).toThrow();
    });
});