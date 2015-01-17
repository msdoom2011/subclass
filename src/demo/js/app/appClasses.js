
app.registerAbstractClass("AbstractClassBase", {

    $_abstract: {
        yo: function() {}
    }
});

app.registerAbstractClass("AbstractClass", {

    $_extends: "AbstractClassBase",

    $_implements: ['Interface'],

    $_traits: ["Trait"],

    $_abstract: {

        eat: function() {},

        drink: function() {},

        sleep: function() {},

        psix: function() {}

    },

    _test: 1,

    go: function() {
        alert('go message ' + this._test);
    },

    callTraitProperty: function()
    {
        alert('redefined trait property!!!');
    },

    getTypedArray: function()
    {
        console.log('fjdkfjlksfjsldkflsjfjslfsjflsfkjslkfjsljfdjsklfsdklfjlskfjslkfjlksjfklsjfkljskldflksjdfjsfkjsdl');
        return this.getTypedArrayDefault();
    }
});

app.registerInterface("InterfaceBase", {

    $_properties: {

        interfaceProperty: {
            type: "string",
            default: "It's interface property!!!!",
            writable: false
        }
    },

    interfacePsix: function() {}

});

app.registerInterface("Interface", {

    $_extends: "InterfaceBase",

    interfaceYo: function() {}

});

app.registerInterface("InterfaceExtra", {

    extraAbstract: function() {}

});

app.registerTrait("TraitBase", {
    $_properties: {

        typedBoolean: { type: "boolean" },

        typedNumber: { type: "number", value: 111 }
    },
    eat: function() {
        alert("eating!!!!!");
    }
});

app.registerTrait("Trait", {

    $_extends: "TraitBase",

    $_properties: {
//                typedString: {
//                    type: "string",
//                    value: "my testing string changed!",
//                    pattern: null
//                },
        typedObject: { type: "object", default: { psix: true } },

        typedArray: { type: "array", default: [] },

        typedEnum: { type: "enum", allows: [1, 2, 3], value: 1 },

        typedClass: { type: "class", className: "AbstractClass" },

        typedFunction: { type: "function", value: function() {
            alert("!!!!");
        }},

        typedUntyped: { type: "untyped", value: "psix" },

        typedMap: { type: "map", schema: {
            varPsix: { type: "string", default: "yo!!!!" }
        }}
    },

    sleep: function()
    {
        alert("sleeping!!!!!");
    },

    callTraitProperty: function()
    {
        alert('trait property!!!');
    }
});

app.registerAbstractClass("Class2", {

    $_extends: "AbstractClass",

    $_abstract: {

        amazon: function() {}

    },

    $_static: {

        staticProp: "test",

        staticIncrement: 0,

        staticMethod: function() {
            alert("test + " + this.staticIncrement++);
        }
    },

    $_properties: {
        typedString: {
            //type: "string",
            type: "percents",
            //value: "my testing string!"
            default: "100%"
        },

        typedObjectCollection: { type: "objectCollection", proto: { type: "number" }, default: {
            num1: 1,
            num2: 1,
            num3: 3
        }},

        typedArrayCollection: {
            type: "arrayCollection",
            proto: { type: "string" },
            value: [
                "str1",
                "str2",
                "str3"
            ]
        },

        typedArrayCollectionOfMap: {
            type: "arrayCollection",
            proto: { type: "map", schema: {
                "propString": { type: "string" },
                "propNumber": { type: "number" },
                "propBoolean": { type: "boolean" }
            }},
            value: [{
                propString: "string",
                propNumber: 111,
                propBoolean: true
            }]
        },
        typedMap: { type: "map", schema: {
            propMapMap: { type: "map", schema: {
                propMapMapString: { type: "string", default: "" } }
            },
            propMapString: { type: "string", default: "string value 1" },
            propMapNumber: { type: "number", default: 10 },
            propMapObject: { type: "object", default: { key1: "value1" } }
        },
//          value: null
            value: {
                propMapString: "psix!!!!!!!!",
                propMapMap: {
                    propMapMapString: "Yahoo!!!!!!"
                }
            }
        }
    },

    _test: 0,

    _psix: 0,

    stop: function() {
        alert('stop message');
    },

    drink: function() {
        alert('Bul-bul-bul...');
    }
});

app.registerClass("Class3", {

    $_extends: "Class2",

    $_constructor: function(test, psix) {
        this._test = test;
        this._psix = psix;
    },

    $_properties: {
        typedMixed: {
            type: "mixed",
            allows: [
                { type: "number" },
                { type: "boolean" },
                {
                    type: "string",
                    pattern: /psix/i
                }
            ],
            value: 0
        }
    },

    stop: function() {
        alert('stop message!!!!!!!!!!!');
    },

    go: function() {
        this.getParent().go.call(this);
        alert('go message!!!!!!!!! ' + this._psix);
    },

    psix: function() {
        alert('psix!!!');
    },

    yo: function() {
        alert('yo!!!!');
    },

    interfaceYo: function() {
        alert('interface Yo!');
    },

    interfacePsix: function() {
        alert('interface Psix!');
    },

    amazon: function()
    {

    },

    newAbstractMethod: function()
    {

    },

    getTypedString: function() {
//                var value = this.getTypedStringDefault();
        return this.getParent().getTypedString.call(this);
    },

    setTypedString: function(value) {
//                this.setTypedStringDefault(value);
        this.getParent().setTypedString.call(this, value);
    },

    getTypedMap: function()
    {
        return this.getParent().getTypedMap.call(this);
    }
});

var class3Inst = app.alterClass("Class2")
//            .setClassName("firstBuiltClass")
//            .setClassParent('AbstractClass')
        .addInterfaces(["InterfaceExtra"])
        .addAbstractMethods({
            newAbstractMethod: function() {}
        })
        .addToBody({

            psix: function()
            {
                alert('PSIX!!!!!!');
            },

            extraAbstract: function()
            {

            }

        })
        .save()
    ;

console.log(class3Inst);


// ====================== CONFIGS =======================

app.registerConfig("ConfigBase", {

    propString: {
        type: "string",
        value: "psix"
    },

    propMap: {
        type: "map",
        schema: {

            propMapString: {
                type: "string",
                default: "string value 1"
            },

            propMapNumber: {
                type: "number",
                default: 10
            },

            propMapObject: {
                type: "object",
                default: { key1: "value1" }
            }

            // ... any property definitions
        },
        value: null
    },

    propObjectCollection: {
        type: "objectCollection",
        proto: {
            type: "map",
            schema: {
                key1: { type: "string" },
                key2: { type: "string" },
                key3: { type: "string" }
            }
        },
        value: {
            itemBase: {
                key1: "base key 1",
                key2: "base key 2",
                key3: "base key 3"
            }
        }
    }
});


app.registerConfig("ConfigInclude", {

    propNumber: {
        type: "number",
        value: 0
    },

    propIncluded: {
        type: "boolean"
    },

    propMap: {
        type: "map",
        schema: {
            propMapExtra: { type: "string", default: "fjdklfjsldfjlsjdfljsdkfl" }
        }
    },

    propObject: {
        type: "object",
        value: { test: true}
    }
});

app.registerConfig("ConfigDecorator", {

    propFromDecorator: {
        type: "string",
        value: "property from decorator"
    },

    propDecoratorExtra: {
        type: "boolean"
    }
});

app.registerConfig("Config", {

    $_extends: "ConfigBase",

    //$_includes: [
    //    "ConfigInclude"
    //],
    //
    //$_decorators: [
    //    "ConfigDecorator"
    //],

    propString: "TEST!!!!!",

    propNumber: 1000000000,

    propBoolean: {
        type: "boolean",
        value: false
    },

    propFromDecorator: {
        type: "string",
        value: "property from config"
    },

    propArray: { type: "array", value: [] },

    propObject: { type: "object", value: { test: "NO!!!!!!" } },

    propFunction: { type: "function", value: function() {} },

    propEnum: {
        type: "enum",
        allows: ["value1", "value2", "value3"],  // Allowed types: string|number|boolean
        value: "value1"                          // If not specified, it will be the first allowed value.
    },

    propMap: {
        propMapString: "Redefined string!",
        propMapNumber: 999,
        propMapObject: { key1: "value redefined!" }
    },

    propObjectCollection: {
        item1: {
            extends: "itemBase",
            key2: "key 2 value",
            key3: "key 3 value"
        },
        item2: {
            extends: "item1",
            key3: "item 2 value!!!!"
        }
    }
});

app.alterClass("Config")
    .addInclude("ConfigInclude")
    .addDecorator("ConfigDecorator")
    .save();
