var app = Subclass.create({
    autoload: true,
    rootPath: "/SubclassJS/build/demo",
    propertyTypes: {
        percents: { type: "string", pattern: /^\d+%$/ },
        bigNumber: { type: "number", minValue: 1000000 }
    },
    parameters: {
        mode: "dev"
    },
    services: {
        logger: {
            singleton: true,
            className: "Logger",
            arguments: ['%mode%'],
            calls: {
                setPsix: [
                    '%mode% and yo!!!!',
                    true
                ]
            }
        },
        bug1: {
            className: "Bug1",
            tags: ['logger']
        },
        bug2: {
            className: "Bug2",
            tags: ['logger']
        }
    }
});

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
            value: "It's interface property!!!!",
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

        typedBoolean: { type: "boolean", value: false },

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
        typedObject: { type: "object", value: {} },

        typedArray: { type: "array", value: [] },

        typedEnum: { type: "enum", allows: [1, 2, 3], value: 1 },

        typedClass: { type: "class", className: "AbstractClass" },

        typedFunction: { type: "function", value: function() {
            alert("!!!!");
        }},

        typedUntyped: { type: "untyped", value: "psix" },

        typedMap: { type: "map", schema: {
            varPsix: { type: "string", value: "yo!!!!" }
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
            type: "string",
//                    type: "percents",
            value: "my testing string!"
        },

        typedObjectCollection: { type: "objectCollection", proto: { type: "number" }, value: {
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
        typedMap: { type: "map", schema:
            {
                propMapMap: { type: "map", schema: {
                    propMapMapString: { type: "string", value: "" } }
                },
                propMapString: { type: "string", value: "string value 1" },
                propMapNumber: { type: "number", value: 10 },
                propMapObject: { type: "object", value: { key1: "value1" } }
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

    _test: 0,

    _psix: 0,

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


// ====================== CONFIGS =======================

app.registerConfig("ConfigBase", {

    propString: {
        type: "string",
        value: "psix"
    }

});

var class3Inst = app.alterClass("Class2")
//            .setClassName("firstBuiltClass")
//            .setClassParent('AbstractClass')
        .addInterfaces(["InterfaceExtra"])
        .addAbstractMethods({
            newAbstractMethod: function() {}
        })
        .addClassBody({

            psix: function()
            {
                alert('PSIX!!!!!!');
            },

            extraAbstract: function()
            {

            }

        })
        .saveClass()
//                .registerClass()
    ;

console.log(class3Inst);


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
            propMapExtra: {
                type: "string",
                value: "fjdklfjsldfjlsjdfljsdkfl"
            }
        }
    }

});

app.registerConfig("Config", {

    $_extends: "ConfigBase",

    $_includes: [
        "ConfigInclude"
    ],

    propString: "TEST!!!!!",

    propNumber: 1000000000,

    propBoolean: {
        type: "boolean",
        value: false
    },

    propArray: {
        type: "array",
        value: []
    },

    propObject: {
        type: "object",
        value: {}
    },

    propFunction: {
        type: "function",
        value: function() {}
    },

    propEnum: {
        type: "enum",
        allows: ["value1", "value2", "value3"],  // Allowed types: string|number|boolean
        value: "value1"                          // If not specified, it will be the first allowed value.
    },

    propMap: {
        type: "map",
        schema: {

            propMapString: {
                type: "string",
                value: "string value 1"
            },

            propMapNumber: {
                type: "number",
                value: 10
            },

            propMapObject: {
                type: "object",
                value: { key1: "value1" }
            }

            // ... any property definitions
        }
    }

});

app.registerClass('Logger', {

    $_implements: ['Subclass/Service/TaggableInterface'],

    $_constructor: function(mode)
    {
        console.log('constructor call:', mode);
    },

    _bugs: [],

    setPsix: function(mode, psix)
    {
        console.log('method call:');
        console.log('-', mode);
        console.log('-', psix);
    },

    addBug: function(bug)
    {
        this._bugs.push(bug);
    },

    getBugs: function()
    {
        return this._bugs;
    },

    processTaggedServices: function(taggedServices)
    {
        for (var i = 0; i < taggedServices.length; i++) {
            if (!taggedServices[i].isImplements('BugInterface')) {
                continue;
            }
            this.addBug(taggedServices[i]);
        }
    }
});

app.registerInterface("BugInterface", {

    getName: function() {},

    getMessage: function() {}

});

app.registerClass("Bug1", {

    $_implements: ["BugInterface"],

    getName: function()
    {
        return "bug1";
    },

    getMessage: function()
    {
        return "Bug 1 happens.";
    }
});

app.registerClass("Bug2", {

    $_implements: ["BugInterface"],

    getName: function()
    {
        return "bug2";
    },

    getMessage: function()
    {
        return "Bug 2 happens.";
    }

});


app.initialize(function() {
    console.log('');
    console.log('----------------------------------- INITIALIZED!!!!!!!!!!!!!! ---------------------------------------');

    var logger = app.getServiceManager().getService('logger');
    var loggerElse = app.getServiceManager().getService('logger');

    console.log(loggerElse == logger);
    console.log(logger.getBugs());

    var bugs = logger.getBugs();

    for (var i = 0; i < bugs.length; i++) {
        console.log(bugs[i].getName());
        console.log(bugs[i].getMessage());
        console.log('-----------');
    }

    //app.getClass('Psix').createInstance().psix();

    var abstractClass = app.getClass("AbstractClass");
    var class2 = app.getClass("Class2");
    var class3 = app.getClass("Class3");
    var config = app.getClass("Config");

    console.log('???????????????????????????');

    //        abstractClass.createInstance().go();
    //        class2.createInstance().go();
    //        class2.createInstance().stop();

    var inst = class3.createInstance(100, 777);
    var inst2 = class3.createInstance(2, 7);
    var configInst = config.createInstance();

    console.log(inst);
    console.log(inst2);
    console.log(configInst);
    //        inst.stop();
    //        inst.go();
    //        inst2.go();
    //        inst.eat();
    //        inst.sleep();
    //        inst.drink();
    //        inst.yo();
    //        inst.psix();
    //        inst.interfaceYo();
    //        inst.interfacePsix();
    //        inst.callTraitProperty();

    console.log(inst.isInstanceOf('InterfaceBase'));
    console.log(inst.isInstanceOf('Interface'));
    console.log(inst.isInstanceOf('AbstractClassBase'));
    console.log(inst.isInstanceOf('AbstractClass'));
    console.log(inst.isInstanceOf('TraitBase'));
    console.log(inst.isInstanceOf('Trait'));
    console.log(inst.isInstanceOf('Class2'));
    console.log(inst.isInstanceOf('Class3'));
    console.log(inst.isInstanceOf('Class43'));



    console.log('');
    console.log('============== String property ==============');

    console.log(inst.getTypedString());

    inst.getProperty("typedString").addWatcher(function(newValue, oldValue) {

        console.log("~~~~~~", newValue, oldValue, "~~~~~~");

        return newValue;
    });
    inst.getProperty("typedString").addWatcher(function(newValue, oldValue) {

        console.log("======", newValue, oldValue, "======");

        return newValue;
    });
    inst.getProperty("typedString").removeWatchers();

    console.log('-------');
    console.log(inst.getProperty('typedString').isModified());
    console.log('-------');

    inst.setTypedString(null);

    console.log('-------');
    console.log(inst.getProperty('typedString').isModified());
    console.log('-------');

    inst.setTypedString("changed string value!!!");
    console.log(inst.getTypedString());
    inst.getProperty("typedString").setValue("another changed string value!!!");
    console.log(inst.getProperty('typedString').getValue());



    console.log('');
    console.log('============= Boolean property ==============');

    console.log(inst.getTypedBoolean());
    //        inst.setTypedBoolean(null);
    inst.setTypedBoolean(true);
    console.log(inst.getTypedBoolean());



    console.log('');
    console.log('============= Number property ==============');

    console.log(inst.getTypedNumber());
    inst.setTypedNumber(null);
    inst.setTypedNumber(777);
    console.log(inst.getTypedNumber());



    console.log('');
    console.log('============= Object property ==============');

    console.log(inst.getTypedObject());
    inst.setTypedObject(null);
    inst.setTypedObject({a: 777, b: 888, c: 999});
    console.log(inst.getTypedObject());



    console.log('');
    console.log('============= Array property ==============');

    console.log(inst.getTypedArray());
    inst.setTypedArray(null);
    inst.setTypedArray(['psix']);
    console.log(inst.getTypedArray());



    console.log('');
    console.log('============= Enum property ==============');

    console.log(inst.getTypedEnum());
    //        inst.setTypedEnum(null);
    inst.setTypedEnum(3);
    console.log(inst.getTypedEnum());



    console.log('');
    console.log('============= Class property ==============');

    console.log(inst.getTypedClass());
    inst.setTypedClass(null);
    inst.setTypedClass(inst2);
    console.log(inst.getTypedClass());



    console.log('');
    console.log('============= Function property ==============');

    console.log(inst.getTypedFunction());
    inst.setTypedFunction(null);
    inst.setTypedFunction(function() { alert(2); });
    console.log(inst.getTypedFunction());



    console.log('');
    console.log('============= Untyped property ==============');

    console.log(inst.getTypedUntyped());
    inst.setTypedUntyped(null);
    inst.setTypedUntyped(1111);
    console.log(inst.getTypedUntyped());



    console.log('');
    console.log('============= Mixed property ==============');

    console.log(inst.getTypedMixed());
    inst.setTypedMixed(null);
    console.log(inst.getTypedMixed());
    inst.setTypedMixed("string with psix");
    console.log(inst.getTypedMixed());
    inst.setTypedMixed(111);
    console.log(inst.getTypedMixed());
    inst.setTypedMixed(true);
    console.log(inst.getTypedMixed());



    console.log('');
    console.log('============= Map property ==============');

    console.log('-------------------------');
    console.log(inst.getProperty('typedMap').isModified());
    console.log('-------------------------');

    console.log(inst.getTypedMap());
    console.log(inst.getTypedMap().propMapString);
    console.log(inst.getTypedMap().propMapMap.propMapMapString);
    //        inst.getTypedMap().propMapMap.propMapMapString = 111;
    inst.getTypedMap().propMapMap.propMapMapString += " changed!!!!";
    console.log(inst.getTypedMap().propMapMap.propMapMapString);
    inst.setTypedMap(null);
    console.log(inst.getTypedMap());

    console.log('-------------------------');
    inst.getProperty('typedMap').setModified();
    console.log(inst.getProperty('typedMap').isModified());
    console.log('-------------------------');

    inst.setTypedMap({
        propMapString: 'psix!!!!!!!!!!!!!!!!!!!!!!'
    });
    console.log(inst.getTypedMap());
    inst.getTypedMap().propMapMap.propMapMapString = "psix!!!!";
    console.log(inst.getTypedMap());


    inst.setTypedMap({
        propMapMap: {
            propMapMapString: "another new value!!!!"
        },
        propMapString: "changed",
        propMapNumber: 1111,
        propMapObject: { a: "yes!!!" }
    });

    console.log(inst.getTypedMap());



    console.log('');
    console.log('============= objectCollection property ==============');

    var objectCollection = inst.getTypedObjectCollection();
    console.log(objectCollection);

    objectCollection.psix = '1111';
    objectCollection.addItem("psix", 555);
    console.log(objectCollection.getItems());

    objectCollection.removeItem("psix");
    console.log(objectCollection.getItems());

    objectCollection.addItems({
        psix: 222,
        psix2: 111
    });
    console.log(objectCollection.getItems());

    objectCollection.addItem("psix", 777);
    console.log(objectCollection.getItems());

    console.log(objectCollection.getItem("psix"));
    console.log(objectCollection.getItems());

    objectCollection.removeItems();
    console.log(objectCollection.getItems());

    inst.setTypedObjectCollection(null);
    console.log(inst.getTypedObjectCollection());

    inst.setTypedObjectCollection({
        psix: 222,
        psix2: 111
    });
    console.log(inst.getTypedObjectCollection());



    console.log('');
    console.log('============= arrayCollection property ==============');

    var arrayCollection = inst.getTypedArrayCollection();
    console.log(arrayCollection);

    arrayCollection.psix = '1111';
    arrayCollection.addItem("psix");
    console.log(arrayCollection.getItems());

    var filteredItems = arrayCollection.filter(function(element, index) {
        if (element.match(/^str/)) {
            return true;
        }
    });
    console.log(filteredItems);

    var removeArrayItem = arrayCollection.indexOf('psix');
    arrayCollection.removeItem(removeArrayItem);
    console.log(arrayCollection.getItems());

    removeArrayItem = arrayCollection.indexOf(function(element, index) {
        if (element.match(/^str/)) {
            return true;
        }
    });
    arrayCollection.removeItem(removeArrayItem);
    console.log(arrayCollection.getItems());

    arrayCollection.addItems(["new1", "new2"]);
    console.log(arrayCollection.getItems());

    arrayCollection.addItem("psix222");
    console.log(arrayCollection.getItems());

    var psixElemIndex = arrayCollection.indexOf("psix222");
    console.log(arrayCollection.getItem(psixElemIndex));
    console.log(arrayCollection.getItems());

    arrayCollection.removeItems();
    console.log(arrayCollection.getItems());

    inst.setTypedArrayCollection(null);
    console.log(inst.getTypedArrayCollection());

    inst.setTypedArrayCollection(["psixNew1", "psixNew2"]);
    console.log(inst.getTypedArrayCollection());



    console.log('');
    console.log('============= arrayCollectionOfMap property ==============');

    var arrayCollectionOfMap = inst.getTypedArrayCollectionOfMap();
    console.log(arrayCollectionOfMap);



    console.log("");
    console.log("=========== Checked typed properties =============");

    console.log(inst.issetProperty('typedMap'));



    console.log("");
    console.log("=========== Getting default values =============");

    console.log(inst.getProperty('typedString').getDefaultValue());



    console.log("");
    console.log("=========== Getting static values =============");

    console.log(inst2.getParent().getStatic().staticProp);
    inst.getParent().getStatic().staticProp = "psix instead test";
    console.log(inst2.getParent().getStatic().staticProp);
    console.log(app.getClass('Class2').getStatic().staticProp);


    console.log(inst.getInterfaceProperty());
    //        inst.setInterfaceProperty("psix");
    console.log(inst.getInterfaceProperty());



    console.log("");
    console.log("=========== Getting class inst copy =============");

    var instCopy = inst.getCopy();
    console.log(instCopy.getInterfaceProperty());
    //        inst.setInterfaceProperty("psix");
    console.log(instCopy.getInterfaceProperty());
});
