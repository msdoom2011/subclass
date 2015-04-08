
// It is required by normal call on onReady callbacks

describe("Launching tests", function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 200;

    it("and setting launch timeout", function(done) {
        setTimeout(function() {
            done();

            expect(configuredModules.indexOf('app')).toBe(0);
            expect(configuredModules.indexOf('appFirstPlugin')).toBe(1);
            expect(configuredModules.indexOf('appSecondPlugin')).toBe(2);
            expect(configuredModules.indexOf('appThirdPlugin')).toBe(3);
            expect(configuredModules.indexOf('appForthPlugin')).toBe(4);

        }, 100);
    });
});