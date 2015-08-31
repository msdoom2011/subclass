describe("Checking subclass eventable interface and eventable trait", function() {
    it ("", function() {
        var eventableInst = app.getClass("App/EventableClass").createInstance();
        //var eventableInst = app.create("App/EventableClass")();
        var fooResult = [];
        var barResult = [];

        eventableInst.addEventListener('foo', 10, function() {
            fooResult.push(1);
        });

        eventableInst.addEventListener('foo', function() {
            fooResult.push(2);
        });

        eventableInst.addEventListener('bar', function() {
            barResult.push(2);
        });

        eventableInst.addEventListener('bar', function() {
            barResult.push(1);
        });

        eventableInst.triggerEvent('foo');
        eventableInst.triggerEvent('bar');

        expect(fooResult.length).toBe(2);
        expect(barResult.length).toBe(2);

        expect(fooResult[0]).toBe(1);
        expect(fooResult[1]).toBe(2);

        expect(barResult[0]).toBe(1);
        expect(barResult[1]).toBe(2);
    });
});