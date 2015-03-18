var app;

describe("Creation of", function() {
    it("module 'app'", function() {
        app = Subclass.createModule("app", {
            rootPath: "tests/app/",
            files: ["Interface/AppInterfaceBase.js"]
        });
        expect(Subclass.issetModule('app')).toBe(true);
    });
});