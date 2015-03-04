
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

        //interfaceProperty: {
        //    type: "string",
        //    default: "It's interface property!!!!",
        //    writable: false
        //}
        interfaceProperty: ["string", "It's interface property!!!!", false]
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

        //typedBoolean: { type: "boolean", nullable: true },
        typedBoolean: ["boolean", null],

        //typedNumber: { type: "number", value: 111, nullable: true }
        typedNumber: ["number", 111]
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
//        typedObject: { type: "object", default: { psix: true }, nullable: true },
        typedObject: ["object", { psix: true }],

        typedArray: ["array", null],
        //typedArray: { type: "array", default: [] },

        //typedEnum: { type: "enum", allows: [1, 2, 3], value: 1, nullable: false },
        typedEnum: ["enum", [1, 2, 3], 1],

        //typedClass: { type: "class", className: "AbstractClass" },
        typedClass: ["class", "AbstractClass"],

        //typedFunction: { type: "function", value: function() { alert("!!!!"); }},
        typedFunction: [ "function", function() { alert("!!!!"); }],

        //typedUntyped: { type: "untyped", value: "psix" },
        typedUntyped: ["untyped", "psix" ],

        //typedMap: { type: "map", schema: {
        //    varPsix: { type: "string", default: "yo!!!!" }
        //}}
        typedMap: ["map", {
            varPsix: ["string", "yo!!!!"]
        }]
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
        //typedString: {
        //    //type: "string",
        //    type: "percents",
        //    //value: "my testing string!"
        //    default: "100%"
        //},
        typedString: ["percents", "100%"],

        //typedObjectCollection: { type: "objectCollection", proto: { type: "number" }, nullable: true, default: {
        //    num1: 1,
        //    num2: 1,
        //    num3: 3
        //}},
        typedObjectCollection: ["objectCollection", ["number"], {
            num1: 1,
            num2: 1,
            num3: 3
        }],

        //typedArrayCollection: {
        //    type: "arrayCollection",
        //    proto: { type: "string" },
        //    nullable: true,
        //    value: [
        //        "str1",
        //        "str2",
        //        "str3"
        //    ]
        //},
        typedArrayCollection: ["arrayCollection", ["string"], [
            "str1",
            "str2",
            "str3"
        ]],

        //typedArrayCollectionOfMap: {
        //    type: "arrayCollection",
        //    proto: { type: "map", schema: {
        //        "propString": { type: "string" },
        //        "propNumber": { type: "number" },
        //        "propBoolean": { type: "boolean" }
        //    }},
        //    value: [{
        //        propString: "string",
        //        propNumber: 111,
        //        propBoolean: true
        //    }]
        //},
        typedArrayCollectionOfMap: ["arrayCollection", ["map", {
                "propString": ["string"],
                "propNumber": ["number"],
                "propBoolean": ["boolean"]
            }], [{
                propString: "string",
                propNumber: 111,
                propBoolean: true
            }]
        ],
//        typedMap: { type: "map", schema: {
//            propMapMap: { type: "map", schema: {
//                propMapMapString: { type: "string", default: "" } }
//            },
//            propMapString: { type: "string", default: "string value 1" },
//            propMapNumber: { type: "number", default: 10 },
//            propMapObject: { type: "object", default: { key1: "value1" } }
//        },
////          value: null
//            value: {
//                propMapString: "psix!!!!!!!!",
//                propMapMap: {
//                    propMapMapString: "Yahoo!!!!!!"
//                }
//            }
//        }
        typedMap: ["map", {
            propMapMap: ["map", {
                propMapMapString: ["string", ""]
            }],
            propMapString: ["string", "string value 1"],
            propMapNumber: ["number", 10],
            propMapObject: ["object", { key1: "value1" }]
        }, {
            propMapString: "psix!!!!!!!!",
            propMapMap: {
                propMapMapString: "Yahoo!!!!!!"
            }
        }]
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
        //typedMixed: {
        //    type: "mixed",
        //    allows: [
        //        { type: "number" },
        //        { type: "boolean" },
        //        { type: "string", pattern: /psix/i }
        //    ],
        //    nullable: true,
        //    value: 0
        //}
        typedMixed: ["mixed", [
                ["number"],
                ["boolean"],
                { type: "string", pattern: /psix/i }
            ], 0
        ]
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
    },

    megaBaseAbstractMethod: function()
    {

    },

    check: function(value, result)
    {
        value = this.value('percents', value);

        console.log('!!!!!!!!!! PERFORMING VALUE OF TYPED STRING !!!!!!!!!!');
        console.log(value);

        return this.result({ type: 'number', minValue: 100 }, result);
    }

});

app.registerTrait("extraTrait", {

    extraTraitMethod: function()
    {
        console.log('extra trait method call from ');
        return 'extra trait method call from ';
    }
});

var class3Inst = app.alterClass("AbstractClass")
//            .setClassName("firstBuiltClass")
//            .setClassParent('AbstractClass')
//    .addInterfaces(["InterfaceExtra"])
//    .addTraits(["extraTrait"])
    .addAbstractMethod('newAbstractMethod', function() {})
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

app.registerAbstractClass("MegaBaseAbstract", {

    $_implements: ["InterfaceExtra"],

    $_traits: ['extraTrait'],

    $_abstract: {

        megaBaseAbstractMethod: function() {}

    },

    megaBaseMethod: function()
    {
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        console.log('megaBaseMethod!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    }

});

app.alterClass("AbstractClassBase")
    .setParent('MegaBaseAbstract')
    .save();


// ====================== CONFIGS =======================

app.registerConfig("ConfigBase", {

    //propString: { type: "string", value: "psix" },
    propString: ["string", "psix"],
    //
    //propMap: {
    //    type: "map",
    //    schema: {
    //
    //        propMapString: {
    //            type: "string",
    //            default: "string value 1"
    //        },
    //
    //        propMapNumber: {
    //            type: "number",
    //            default: 10
    //        },
    //
    //        propMapObject: {
    //            type: "object",
    //            default: { key1: "value1" }
    //        }
    //
    //        // ... any property definitions
    //    },
    //    value: null
    //},

    propMap: ["map", {
        propMapString: ["string", "string value 1"],
        propMapNumber: ["number", 10],
        propMapObject: ["object", { key1: "value1" }]
        // ... any property definitions
    }, null],

    //propObjectCollection: {
    //    type: "objectCollection",
    //    proto: {
    //        type: "map",
    //        schema: {
    //            key1: { type: "string" },
    //            key2: { type: "string" },
    //            key3: { type: "string" }
    //        }
    //    },
    //    value: {
    //        itemBase: {
    //            key1: "base key 1",
    //            key2: "base key 2",
    //            key3: "base key 3"
    //        }
    //    }
    //}
    propObjectCollection: ["objectCollection", ["map", {
            key1: { type: "string" },
            key2: { type: "string" },
            key3: { type: "string" }
        }], {
            itemBase: {
                key1: "base key 1",
                key2: "base key 2",
                key3: "base key 3"
            }
        }
    ]
});


app.registerConfig("ConfigInclude", {

    //propNumber: { type: "number", value: 0 },
    propNumber: ["number", null],

    //propIncluded: { type: "boolean" },
    propIncluded: ["boolean"],

    //propMap: {
    //    type: "map",
    //    schema: {
    //        propMapExtra: { type: "string", default: "fjdklfjsldfjlsjdfljsdkfl" }
    //    }
    //},
    propMap: ["map", {
        propMapExtra: ["string", "fjdklfjsldfjlsjdfljsdkfl"]
    }],

    //propObject: {
    //    type: "object",
    //    value: { test: true}
    //}
    propObject: ["object", { test: true }]
});

app.registerConfig("ConfigDecorator", {

    //propFromDecorator: {
    //    type: "string",
    //    value: "property from decorator"
    //},
    propFromDecorator: ["string", "property from decorator"],

    //propDecoratorExtra: {
    //    type: "boolean"
    //}
    propDecoratorExtra: ["boolean"]
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

    //propBoolean: {
    //    type: "boolean",
    //    value: false
    //},
    propBoolean: ["boolean", false],

    //propFromDecorator: {
    //    type: "string",
    //    value: "property from config"
    //},
    propFromDecorator: ["string", "property from config"],

    //propArray: { type: "array", value: [] },
    propArray: ["array", []],

    //propObject: { type: "object", value: { test: "NO!!!!!!" } },
    propObject: ["object", { test: "NO!!!!!!" }],

    //propFunction: { type: "function", value: function() {} },
    propFunction: ["function", function() {}],

    //propEnum: {
    //    type: "enum",
    //    allows: ["value1", "value2", "value3"],  // Allowed types: string|number|boolean
    //    value: "value1"                          // If not specified, it will be the first allowed value.
    //},
    propEnum: ["enum", ["value1", "value2", "value3"], "value1"],  // Allowed types: string|number|boolean

    //propMap: {
    //    propMapString: "Redefined string!",
    //    propMapNumber: 999,
    //    propMapObject: { key1: "value redefined!" }
    //},
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

app.registerService("psix", {
    className: "Logger/Logger",
    arguments: ["%mode%"]
});