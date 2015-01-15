
var appPlugin1 = Subclass.createModule('appPlugin1', {
    //plugin: true,
    pluginOf: "app",
    dataTypes: {
        percents: { type: "string", pattern: /^\d+%$/ }
    },
    parameters: {
        mode: "prod"
    },
    services: {
        bug3: {
            extends: 'bug',
            className: "Bug3"
        }
    }
});

appPlugin1.onReady(function() {
    console.log('****************');
    //alert('initializing plugin1');
    console.log('initializing plugin1');
    console.log('****************');
});

appPlugin1.registerClass("Bug3", {

    $_extends: "BugAbstract",

    _name: "bug3",

    _message: "Bug 3 happens."

});

//var bug3 = appPlugin1.getClass('Bug3').createInstance();

// ======================================================================

var appPlugin2 = Subclass.createModule('appPlugin2', {
    //plugin: true,
    pluginOf: "app",
    dataTypes: {
        //percents: { type: "string", pattern: /^[a]+%$/ }
    },
    parameters: {
        mode: "yo!!!!"
    },
    services: {
        bug2: {
            extends: 'bug',
            className: "Bug2Changed"
        }
    },
    onReady: function() {
        console.log('****************');
        console.log('initializing plugin2');
        console.log('****************');
    }
});

appPlugin2.onReady(function() {
    console.log('****************');
    //alert('initializing plugin2 else');
    console.log('initializing plugin2 else');
    console.log('****************');
});

appPlugin2.setConfigs({
    parameters: {
        mode: "fuck!!!!"
    },
    onReady: function() {
        console.log('****************');
        //alert('initializing plugin2 else new!!!');
        console.log('initializing plugin2 else new!!!');
        console.log('****************');
    }
});

appPlugin1.getModule().getParameterManager().getParameter('mode');

appPlugin2.registerClass("Bug2Changed", {

    $_extends: "BugAbstract",

    _name: "bug2changed",

    _message: "Bug 2 changed happens."

});

// ======================================================================

var app = Subclass.createModule('app', /*['appPlugin1', 'appPlugin2'],*/ {
    autoload: true,
    rootPath: "/SubclassJS/build/demo",
    dataTypes: {
        percents: { type: "string", pattern: /^[a-z]+%$/ },
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
        bug: {
            abstract: true,
            tags: ['logger']
        },
        bug1: {
            extends: "bug",
            className: "Bug1"
        },
        bug2: {
            extends: "bug",
            className: "Bug2"
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
            var serviceClass = app.getClass(taggedServices[i].getClassName());

            if (!serviceClass.isImplements('BugInterface')) {
                continue;
            }

            this.addBug(serviceClass.createInstance());
        }
    }
});

app.registerInterface("BugInterface", {

    getName: function() {},

    getMessage: function() {}

});

app.registerAbstractClass("BugAbstract", {

    $_implements: ["BugInterface"],

    getName: function()
    {
        return this._name;
    },

    getMessage: function()
    {
        return this._message;
    }

});

app.registerClass("Bug1", {

    $_extends: "BugAbstract",

    _name: "bug1",

    _message: "bug 1 happens"
});

app.registerClass("Bug2", {

    $_extends: "BugAbstract",

    _name: "bug2",

    _message: "Bug 2 happens."

});


app.onReady(function() {

    console.log('****************');
    //alert('initializing app');
    console.log('initializing app');
    console.log('****************');

    console.log('');
    console.log('----------------------------------- INITIALIZED!!!!!!!!!!!!!! ---------------------------------------');

    var logger = app.getService('logger');
    var loggerElse = app.getService('logger', true);

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
    console.log('============= Config Class ===============');

    configInst.setValues({
        propString: "YO!!!!!!!! SHIT!!!!!!",
        propNumber: 10
    });
    console.log(configInst);
    console.log(configInst.getValues());
    console.log(configInst.getDefaults());
    console.log(configInst.getSchemaDefaults());
    console.log(configInst.getValues().propObjectCollection.item2);


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

    inst.setTypedString("200%"); //"changed string value!!!");
    console.log(inst.getTypedString());
    inst.getProperty("typedString").setValue("400%"); //"another changed string value!!!");
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
    console.log(inst.getTypedMap().getData());



    console.log('');
    console.log('============= objectCollection property ==============');

    var objectCollection = inst.getTypedObjectCollection();
    console.log(objectCollection);

    objectCollection.psix = '1111';
    objectCollection.addItem("psix", 555);
    console.log(objectCollection.getData());

    objectCollection.removeItem("psix");
    console.log(objectCollection.getData());

    objectCollection.addItems({
        psix: 222,
        psix2: 111
    });
    console.log(objectCollection.getData());

    objectCollection.addItem("psix", 777);
    console.log(objectCollection.getData());

    console.log(objectCollection.getItem("psix"));
    console.log(objectCollection.getData());

    objectCollection.removeItems();
    console.log(objectCollection.getData());

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
    console.log(arrayCollection.getData());

    var filteredItems = arrayCollection.filter(function(element, index) {
        if (element.match(/^str/)) {
            return true;
        }
    });
    console.log(filteredItems);

    var removeArrayItem = arrayCollection.indexOf('psix');

    console.log(removeArrayItem);

    arrayCollection.removeItem(removeArrayItem);
    console.log(arrayCollection.getData());

    var removeArrayItemIndex = arrayCollection.indexOf(function(element, index) {
        if (element.match(/^str/)) {
            return true;
        }
    });

    console.log(removeArrayItemIndex);

    arrayCollection.removeItem(removeArrayItemIndex);
    console.log(arrayCollection.getData());

    arrayCollection.addItems(["new1", "new2"]);
    console.log(arrayCollection.getData());

    arrayCollection.addItem("psix222");
    console.log(arrayCollection.getData());

    var psixElemIndex = arrayCollection.indexOf("psix222");
    console.log(arrayCollection.getItem(psixElemIndex));
    console.log(arrayCollection.getData());

    arrayCollection.removeItems();
    console.log(arrayCollection.getData());

    inst.setTypedArrayCollection(null);
    console.log(inst.getTypedArrayCollection());

    inst.setTypedArrayCollection(["psixNew1", "psixNew2"]);
    console.log(inst.getTypedArrayCollection().getData());

    arrayCollection.unshift("unshifted");
    arrayCollection.push("pushed");

    console.log(arrayCollection.getData());

    console.log(arrayCollection.shift());
    console.log(arrayCollection.pop());

    console.log(arrayCollection.getData());
    console.log(arrayCollection.length);



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
