//describe("Registering", function() {
//    it("Class/AppClass", function() {
//        app.registerClass("Class/AppClass", {
//
//            $_extends: "Class/AppClassBase",
//
//            $_constructor: function(name, goal, mode)
//            {
//                this.getParent().$_constructor.call(name, goal);
//
//                if ([this.MODE_DEV, this.MODE_PROD].indexOf(mode) < 0) {
//                    throw new Error();
//                }
//                this._mode = mode;
//            }
//        });
//    });
//});