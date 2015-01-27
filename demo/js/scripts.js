
app.onReady(function() {

    //app.addPlugin('appPlugin2');

    console.log('****************');
    //alert('initializing app');
    console.log('initializing app');
    console.log('****************');

    console.log('');
    console.log('----------------------------------- INITIALIZED!!!!!!!!!!!!!! ---------------------------------------');


    // If plugin2 was not loaded to the page document

    //app.addPlugin('appPlugin2', '/SubclassJS/build/demo/js/plugs/plugin2.js', function() {
    //    var logger = app.getService('logger');
    //    var loggerElse = app.getService('logger');
    //    var loggerPsix = app.getService('psix');
    //
    //    console.log('not logger service "psix" with class from logger', loggerPsix);
    //    console.log(loggerElse == logger);
    //    console.log(logger.getBugs());
    //
    //    var bugs = logger.getBugs();
    //
    //    for (var i = 0; i < bugs.length; i++) {
    //        console.log(bugs[i].getName());
    //        console.log(bugs[i].getMessage());
    //        console.log('-----------');
    //    }
    //});

    // If plugin2 was preloaded to the page document

    //app.addPlugin('appPlugin2');

    var logger = app.getService('logger');
    var loggerElse = app.getService('logger');
    var loggerPsix = app.getService('psix');

    console.log('not logger service "psix" with class from logger', loggerPsix);
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
    //inst.setTypedString(111);

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
            inst.setTypedBoolean(null);
    inst.setTypedBoolean(true);
    console.log(inst.getTypedBoolean());



    console.log('');
    console.log('============= Number property ==============');

    console.log(inst.getTypedNumber());
    inst.setTypedNumber(null);
    //inst.setTypedNumber('string');
    inst.setTypedNumber(777);
    console.log(inst.getTypedNumber());



    console.log('');
    console.log('============= Object property ==============');

    console.log(inst.getTypedObject());
    inst.setTypedObject(null);
    //inst.setTypedObject('string');
    inst.setTypedObject({a: 777, b: 888, c: 999});
    console.log(inst.getTypedObject());



    console.log('');
    console.log('============= Array property ==============');

    console.log(inst.getTypedArray());
    //inst.setTypedArray('string');
    inst.setTypedArray(null);
    inst.setTypedArray(['psix']);
    console.log(inst.getTypedArray());



    console.log('');
    console.log('============= Enum property ==============');

    console.log(inst.getTypedEnum());
    //inst.setTypedEnum(null);
    inst.setTypedEnum(3);
    console.log(inst.getTypedEnum());



    console.log('');
    console.log('============= Class property ==============');

    console.log(inst.getTypedClass());
    inst.setTypedClass(null);
    //inst.setTypedClass(logger);
    inst.setTypedClass(inst2);
    console.log(inst.getTypedClass());



    console.log('');
    console.log('============= Function property ==============');

    console.log(inst.getTypedFunction());
    inst.setTypedFunction(null);
    //inst.setTypedFunction(111);
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
    //inst.setTypedMixed({});
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
    //console.log(inst.setTypedMap(111));
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
    //inst.setTypedObjectCollection('string');
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

    inst.setTypedArrayCollection(["psixNew1", "psixNew2", "psixNew3", "psixNew4"]);
    console.log(inst.getTypedArrayCollection().getData());

    arrayCollection.unshift("unshifted");
    arrayCollection.push("pushed");

    console.log(arrayCollection.getData());

    console.log(arrayCollection.shift());
    console.log(arrayCollection.pop());

    console.log(arrayCollection.getData());
    console.log(arrayCollection.length);

    arrayCollection.reverse();
    console.log('reversed:', arrayCollection.getData());

    arrayCollection.sort();
    console.log('sorted:', arrayCollection.getData());

    arrayCollection.sort(function(a, b) {
        console.log(a,b);

        if (a > b) {
            return -1;
        } else if (a < b) {
            return 1;
        }
        return 0;
    });

    console.log('custom sorted:', arrayCollection.getData());
    console.log('joined:', arrayCollection.join(", "));
    console.log('sliced from 1 up to 3:', arrayCollection.slice(1,3));

    arrayCollection.reverse();
    console.log('reversed to start:', arrayCollection.getData());


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

//setTimeout(function() {
//    if (app.isReady()) {
//        app.triggerOnReady();
//    }
//}, 1000);
