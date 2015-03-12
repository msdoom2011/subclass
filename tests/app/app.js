var app;

describe("Creation of", function() {
    it("Module", function() {
        app = Subclass.createModule("app", {
            rootPath: "tests/app/"
        });
        expect(app).not.toThrow();
    });
});