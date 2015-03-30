/**
 * @namespace
 */
Subclass.Class.Type.Class = {};

/**
 * @class
 * @extends {Subclass.Class.ClassType}
 */
Subclass.Class.Type.Class.Class = (function() {

    /*************************************************/
    /*        Describing class type "Class"          */
    /*************************************************/

    /**
     * @param {Subclass.ClassManager} classManager
     * @param {string} className
     * @param {Object} classDefinition
     * @extends {ClassType}
     * @constructor
     */
    function Class(classManager, className, classDefinition)
    {
        Class.$parent.call(this, classManager, className, classDefinition);

        /**
         * List of abstract methods (functions with needed arguments)
         *
         * @type {(Object|null)}
         * @private
         */
        this._abstractMethods = {};

//==============================================
//============== INTERFACE START ===============
//==============================================
//
//        /**
//        * List of interfaces class names
//        *
//        * @type {Array<Subclass.Class.Interface.Interface>}
//        * @private
//        */
//        this._interfaces = [];
//
//==============================================
//================ INTERFACE END ===============
//==============================================

        /**
         * List of traits class names
         *
         * @type {Array<Subclass.Class.Trait.Trait>}
         * @private
         */
        this._traits = [];

        /**
         * Names of class static properties
         *
         * @type {Array}
         * @private
         */
        this._static = [];

        /**
         * The context object for static methods
         *
         * @type {Object}
         * @private
         */
        this._staticContext = null;
    }

    Subclass.Class.ClassType.addStaticMethods.call(Class);

    Class.$parent = Subclass.Class.ClassType;

    /**
     * @inheritDoc
     */
    Class.getClassTypeName = function ()
    {
        return "Class";
    };

    /**
     * @inheritDoc
     */
    Class.getBuilderClass = function()
    {
        return Subclass.Class.Type.Class.ClassBuilder;
    };

    /**
     * @inheritDoc
     */
    Class.getDefinitionClass = function()
    {
        return Subclass.Class.Type.Class.ClassDefinition;
    };

    /**
     * @inheritDoc
     */
    Class.prototype.getConstructorEmpty = function ()
    {
        return function Class() {

            // Hook for the grunt-contrib-uglify plugin
            return Class.name;
        };
    };

    /**
     * @inheritDoc
     * @throws {Error}
     */
    Class.prototype.createConstructor = function ()
    {
        var classConstructor = Class.$parent.prototype.createConstructor.call(this);
        var abstractMethods = this._abstractMethods = this.getAbstractMethods();
        var notImplementedMethods = [];

        if (this.hasParent()) {
            var parent = this.getParent();

            // Adding parent abstract methods

            if (parent.getAbstractMethods) {
                this.extendAbstractMethods(parent);
            }

            // Adding parent static properties

            if (parent.getStaticProperties) {
                this.extendStaticProperties(parent);
            }
        }

        // Checking for not implemented methods

        if (this.constructor != Subclass.Class.Type.AbstractClass.AbstractClass) {
            for (var abstractMethodName in abstractMethods) {
                if (!abstractMethods.hasOwnProperty(abstractMethodName)) {
                    continue;
                }
                if (
                    !classConstructor.prototype[abstractMethodName]
                    || typeof classConstructor.prototype[abstractMethodName] != 'function'
                ) {
                    notImplementedMethods.push(abstractMethodName);
                }
            }
            if (notImplementedMethods.length) {
                Subclass.Error.create(
                    'The class "' + this.getName() + '" must be an abstract or implement abstract methods: ' +
                    '"' + notImplementedMethods.join('", "') + '".'
                );
            }
        }

        return classConstructor;
    };

    /**
     * @inheritDoc
     */
    Class.prototype.getClassParents = function(grouping)
    {
        var classes = Class.$parent.prototype.getClassParents.apply(this, arguments);
        var classManager = this.getClassManager();
        var classGroups = [];

        function addClassName(classes, className)
        {
            if (classes.indexOf(className) < 0) {
                classes.push(className);
            }
        }

//==============================================
//============== INTERFACE START ===============
//==============================================
//
//        classGroups = classGroups.concat(this.getInterfaces(true));
//
//==============================================
//============== INTERFACE END ===============
//==============================================

        classGroups = classGroups.concat(this.getTraits(true));

        if (grouping !== true) {
            grouping = false;
        }

        for (var i = 0; i < classGroups.length; i++) {
            var classInst = classGroups[i];

            if (typeof classGroups[i] == 'string') {
                classInst = classManager.getClass(classGroups[i]);
            }
            var className = classInst.getName();

            if (grouping) {
                var classType = classInst.getType();

                if (!classes.hasOwnProperty(classType)) {
                    classes[classType] = [];
                }
                addClassName(classes[classType], className);

            } else {
                addClassName(classes, className);
            }
        }
        return classes;
    };

    /**
     * @inheritDoc
     */
    Class.prototype.setParent = function (parentClassName)
    {
        Class.$parent.prototype.setParent.call(this, parentClassName);

        if (
            this._parent
            && this._parent.constructor != Class
            && this._parent.constructor != Subclass.ClassManager.getClassType('AbstractClass')
        ) {
            Subclass.Error.create(
                'The class "' + this.getName() + '" can be inherited ' +
                'only from another class or abstract class.'
            );
        }
    };

    /**
     * Checks if current class is instance of another class,
     * has trait or event implements interface with specified class name.
     *
     * @inheritDoc
     */
    Class.prototype.isInstanceOf = function (className)
    {
        return ((
                Class.$parent.prototype.isInstanceOf.call(this, className)
            ) || (
                this.hasTrait
                && this.hasTrait(className)
            )

//==============================================
//============== INTERFACE START ===============
//==============================================
//
//            || (
//                this.isImplements
//                && this.isImplements(className)
//            )
//
//==============================================
//============== INTERFACE END ===============
//==============================================


        );
    };

    /**
     * Returns class static properties and methods
     *
     * @returns {Object}
     */
    Class.prototype.getStaticContext = function()
    {
        var $this = this;

        if (!this._staticContext) {
            this._staticContext = {

                /**
                 * Returns current class declaration instance
                 *
                 * @returns {Subclass.Class.ClassType}
                 */
                getClass: function()
                {
                    return $this;
                },

                /**
                 * Returns parent of current class
                 *
                 * @returns {(Subclass.Class.ClassType|null)}
                 */
                getParent: function()
                {
                    return $this.getParent();
                }
            }
        }
        return this._staticContext;
    };

    /**
     * Adds static properties
     *
     * @throws {Error}
     *      Throws error if specified invalid static properties definition
     *
     * @param {Object} properties
     */
    Class.prototype.addStaticProperties = function(properties)
    {
        if (!properties || !Subclass.Tools.isPlainObject(properties)) {
            Subclass.Error.create("InvalidArgument")
                .argument('the static properties definition', false)
                .expected('a plain object')
                .received(properties)
                .apply()
            ;
        }
        for (var propName in properties) {
            if (properties.hasOwnProperty(propName)) {
                this.addStaticProperty(propName, properties[propName]);
            }
        }
    };

    /**
     * Adds the new static property.<br />
     *
     * If the static property value was specified as a function then it will contain
     * specific static context object with all earlier defined static properties and methods.<br />
     *
     * If you'll want call static method with another context, you should use the "origin" property of it.
     * For example, instead of using expression myClass.staticMethod.call(obj) you should use this:
     * myClass.staticMethod.<b>origin</b>.call(obj).
     *
     * @thorws {Error}
     *      Throws error if specified invalid static property name
     *
     * @param {string} propertyName
     *      The name of static property
     *
     * @param {*} propertyValue
     *      The value of static property
     */
    Class.prototype.addStaticProperty = function(propertyName, propertyValue)
    {
        if (!propertyName || typeof propertyName != 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument('the name of static property', false)
                .expected('a string')
                .received(propertyName)
                .apply()
            ;
        }
        var staticContext = this.getStaticContext();
            staticContext[propertyName] = propertyValue;

        this._static.push(propertyName);

        if (typeof propertyValue == 'function') {
            this[propertyName] = function() {
                return staticContext[propertyName].apply(staticContext, arguments);
            };
            this[propertyName].origin = propertyValue;

        } else {
            Object.defineProperty(this, propertyName, {
                configurable: true,
                enumerable: true,
                set: function(value) {
                    staticContext[propertyName] = value;
                },
                get: function() {
                    return staticContext[propertyName];
                }
            });
        }
    };

    /**
     * Extends static properties from parent to current class
     *
     * @param {Subclass.Class.Type.Class.Class} parentClass
     *      The parent class declaration instance
     */
    Class.prototype.extendStaticProperties = function(parentClass)
    {
        var ownStaticPropertyNames = Subclass.Tools.copy(this.getStaticPropertyNames());
        var ownStaticContext = Subclass.Tools.copy(this.getStaticContext());
        var parentStaticContext = parentClass.getStaticContext();
        var parentStaticPropertyNames = parentClass.getStaticPropertyNames();
        var propName, propValue;

        for (var i = 0; i < parentStaticPropertyNames.length; i++) {
            propName = parentStaticPropertyNames[i];
            propValue = parentStaticContext[propName];

            this.addStaticProperty(propName, propValue);
        }
        for (i = 0; i < ownStaticPropertyNames.length; i++) {
            propName = ownStaticPropertyNames[i];
            propValue = ownStaticContext[propName];

            this.addStaticProperty(propName, propValue);
        }
    };

    /**
     * Returns all defined static class properties
     *
     * @returns {Object}
     */
    Class.prototype.getStaticProperties = function()
    {
        var staticPropertyNames = this._static;
        var staticProperties = {};

        for (var i = 0; i < staticPropertyNames.length; i++) {
            staticProperties[staticPropertyNames[i]] = this[staticPropertyNames];
        }
    };

    /**
     * Returns array with names of static class properties
     *
     * @returns {Array}
     */
    Class.prototype.getStaticPropertyNames = function()
    {
        return this._static;
    };

    /**
     * Returns all abstract methods
     *
     * @returns {Array}
     */
    Class.prototype.getAbstractMethods = function ()
    {
        return this._abstractMethods;
    };

    /**
     * Adds new abstract methods to be implemented
     *
     * @param methods
     */
    Class.prototype.addAbstractMethods = function(methods)
    {
        Subclass.Tools.extend(this._abstractMethods, methods);
    };

    Class.prototype.extendAbstractMethods = function(parentClass)
    {
        Subclass.Tools.extend(
            this.getAbstractMethods(),
            parentClass.getAbstractMethods()
        );
    };

    /**
     * Adds traits
     *
     * @param {Object} traits
     */
    Class.prototype.addTraits = function(traits)
    {
        if (!traits || !Array.isArray(traits)) {
            Subclass.Error.create('InvalidArgument')
                .argument('the traits list', false)
                .expected('an array')
                .received(traits)
                .apply()
            ;
        }
        for (var i = 0; i < traits.length; i++) {
            this.addTrait(traits[i]);
        }
    };

    /**
     * Returns trait names list
     *
     * @throws {Error}
     *
     * @param {boolean} [withInherited=false]
     *      Whether the inherited traits should be returned
     *
     * @returns {Array<Subclass.Class.Trait.Trait>}
     */
    Class.prototype.getTraits = function(withInherited)
    {
        //if (!Subclass.ClassManager.issetClassType('Trait')) {
        //    Subclass.Error.create('NotExistentMethod')
        //        .method('getTraits')
        //        .apply()
        //    ;
        //}
        if (withInherited !== true) {
            return this._traits;
        }
        var classManager = this.getClassManager();
        var traits = Subclass.Tools.copy(this._traits);

        for (var i = 0; i < traits.length; i++) {
            var traitParents = traits[i].getClassParents();

            for (var j = 0; j < traitParents.length; j++) {
                traits.push(classManager.getClass(traitParents[j]));
            }
        }
        if (this.hasParent()) {
            var parent = this.getParent();

            if (parent.getTraits) {
                traits = traits.concat(parent.getTraits(withInherited))
            }
        }
        return traits;
    };

    /**
     * Adds trait class name
     *
     * @param {string} traitName
     * @throws {Error}
     */
    Class.prototype.addTrait = function (traitName)
    {
        var classDefinition = this.getDefinition();

        //if (!Subclass.ClassManager.issetClassType('Trait')) {
        //    return;
        //}
        if (!traitName || typeof traitName != 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument("the name of trait", false)
                .received(traitName)
                .expected("a string")
                .apply()
            ;
        }
        var traitClass = this.getClassManager().getClass(traitName);
        //var traitClassConstructor = traitClass.getConstructor();
        var traitClassDefinition = traitClass.getDefinition();
        //var traitClassProperties = traitClass.getProperties();
        var traitProps = {};

        traitClass.addChildClass(this.getName());

        if (traitClass.constructor != Subclass.Class.Type.Trait.Trait) {
            Subclass.Error.create(
                'Trying add to "$_traits" option ' +
                'the new class "' + traitName + '" that is not a trait.'
            );
        }

        //for (var propName in traitClassProperties) {
        //    if (!traitClassProperties.hasOwnProperty(propName)) {
        //        continue;
        //    }
        //    var property = traitClassProperties[propName];
        //    this.addProperty(propName, property.getDefinition().getData());
        //}

        // Copying all static properties to current class

        this.extendStaticProperties(traitClass);
        this.getTraits().push(traitClass);

        // Copying all properties and methods (with inherited) from trait to class definition

        Subclass.Tools.extend(traitProps, traitClassDefinition.getNoMethods(true));
        Subclass.Tools.extend(traitProps, traitClassDefinition.getMethods(true));

        classDefinition.setData(Subclass.Tools.extend(
            traitProps,
            classDefinition.getData()
        ));
    };

    /**
     * Checks if current class has specified trait class name
     *
     * @param {string} traitName
     * @returns {boolean}
     * @throws {Error}
     */
    Class.prototype.hasTrait = function (traitName)
    {
        //if (!Subclass.ClassManager.issetClassType('Trait')) {
        //    Subclass.Error.create('NotExistentMethod')
        //        .method('hasTrait')
        //        .apply()
        //    ;
        //}
        if (!traitName || typeof traitName != "string") {
            Subclass.Error.create('InvalidArgument')
                .argument('the name of trait', false)
                .received(traitName)
                .expected('a string')
                .apply()
            ;
        }
        var traits = this.getTraits();

        for (var i = 0; i < traits.length; i++) {
            if (traits[i].isInstanceOf(traitName)) {
                return true;
            }
        }
        if (this.hasParent()) {
            var parent = this.getParent();

            if (parent.hasTrait) {
                return parent.hasTrait(traitName);
            }
        }
        return false;
    };

//==============================================
//============== INTERFACE START ===============
//==============================================
//
//    /**
//     * Adds interfaces
//     *
//     * @param {Object} interfaces
//     */
//    Class.prototype.addInterfaces = function(interfaces)
//    {
//        if (!interfaces || !Array.isArray(interfaces)) {
//            Subclass.Error.create('InvalidArgument')
//                .argument('the traits list', false)
//                .expected('an array')
//                .received(interfaces)
//                .apply()
//            ;
//        }
//        for (var i = 0; i < interfaces.length; i++) {
//            this.addInterface(interfaces[i]);
//        }
//    };
//
//    /**
//     * Returns interface names list
//     *
//     * @throws {Error}
//     *
//     * @param {boolean} [withInherited=false]
//     *      Whether the inherited interfaces should be returned
//     *
//     * @returns {Array<Subclass.Class.Interface.Interface>}
//     */
//    Class.prototype.getInterfaces = function(withInherited)
//    {
//        //if (!Subclass.ClassManager.issetClassType('Interface')) {
//        //    Subclass.Error.create('NotExistentMethod')
//        //        .method('getInterfaces')
//        //        .apply()
//        //    ;
//        //}
//        //return this._interfaces;
//
//        if (withInherited !== true) {
//            return this._interfaces;
//        }
//        var classManager = this.getClassManager();
//        var interfaces = Subclass.Tools.copy(this._interfaces);
//
//        for (var i = 0; i < interfaces.length; i++) {
//            var interfaceParents = interfaces[i].getClassParents();
//
//            for (var j = 0; j < interfaceParents.length; j++) {
//                interfaces.push(classManager.getClass(interfaceParents[j]));
//            }
//        }
//        if (this.hasParent()) {
//            var parent = this.getParent();
//
//            if (parent.getInterfaces) {
//                interfaces = interfaces.concat(parent.getInterfaces(withInherited))
//            }
//        }
//        return interfaces;
//    };
//
//    /**
//     * Adds new interface
//     *
//     * @param {string} interfaceName
//     * @throws {Error}
//     */
//    Class.prototype.addInterface = function (interfaceName)
//    {
//        if (!interfaceName || typeof interfaceName != 'string') {
//            Subclass.Error.create('InvalidArgument')
//                .argument("the name of interface", false)
//                .received(interfaceName)
//                .expected("a string")
//                .apply()
//            ;
//        }
//        var interfaceClass = this.getClassManager().getClass(interfaceName);
//            interfaceClass.addChildClass(this.getName());
//
//        if (interfaceClass.constructor != Subclass.Class.Type.Interface.Interface) {
//            Subclass.Error.create(
//                'Can\'t implement no interface "' + interfaceName + '" ' +
//                'in class "' + this.getName() + '".'
//            );
//        }
//
//        var interfaceClassConstructor = interfaceClass.getConstructor();
//        var interfaceClassConstructorProto = interfaceClassConstructor.prototype;
//        //var interfaceClassProperties = interfaceClass.getClassDefinitionProperties();
//        var abstractMethods = {};
//
//        if (interfaceClass.constructor != Subclass.Class.Type.Interface.Interface) {
//            Subclass.Error.create(
//                'Trying add to "$_implements" option ' +
//                'the new class "' + interfaceName + '" that is not an interface.'
//            );
//        }
//
//        // Add interface properties
//
//        //for (var propName in interfaceClassProperties) {
//        //    if (!interfaceClassProperties.hasOwnProperty(propName)) {
//        //        continue;
//        //    }
//        //    this.addProperty(
//        //        propName,
//        //        interfaceClassProperties[propName]
//        //    );
//        //}
//
//        // Add all interface prototype properties (with inherited)
//
//        loop: for (var methodName in interfaceClassConstructorProto) {
//            if (typeof interfaceClassConstructorProto[methodName] != 'function') {
//                continue;
//            }
//            //for (propName in interfaceClassProperties) {
//            //    if (!interfaceClassProperties.hasOwnProperty(propName)) {
//            //        continue;
//            //    }
//            //    var setterName = Subclass.Tools.generateSetterName(propName);
//            //    var getterName = Subclass.Tools.generateGetterName(propName);
//            //
//            //    if (methodName == setterName || methodName == getterName) {
//            //        continue loop;
//            //    }
//            //}
//            abstractMethods[methodName] = interfaceClassConstructorProto[methodName];
//        }
//        this.addAbstractMethods(abstractMethods);
//        this.getInterfaces().push(interfaceClass);
//        //this.getInterfaces().push(interfaceName);
//    };
//
//    /**
//     * Checks if current class implements specified interface
//     *
//     * @param interfaceName
//     * @returns {*}
//     * @throws {Error}
//     */
//    Class.prototype.isImplements = function (interfaceName)
//    {
//        //if (!Subclass.ClassManager.issetClassType('Interface')) {
//        //    Subclass.Error.create('NotExistentMethod')
//        //        .method('isImplements')
//        //        .apply()
//        //    ;
//        //}
//        if (!interfaceName || typeof interfaceName != 'string') {
//            Subclass.Error.create('InvalidArgument')
//                .argument("the name of interface", false)
//                .received(interfaceName)
//                .expected("a string")
//                .apply()
//            ;
//        }
//        var classManager = this.getClassManager();
//        var interfaces = this.getInterfaces();
//
//        if (interfaces && interfaces.indexOf(interfaceName) >= 0) {
//            return true;
//
//        } else {
//            for (var i = 0; i < interfaces.length; i++) {
//                if (interfaces[i].isInstanceOf(interfaceName)) {
//                    return true;
//                }
//            }
//        }
//        if (this.hasParent()) {
//            var parent = this.getParent();
//
//            if (parent.isImplements) {
//                return parent.isImplements(interfaceName);
//            }
//        }
//        return false;
//    };
//
//==============================================
//============== INTERFACE END ===============
//==============================================


    /*************************************************/
    /*         Registering new class type            */
    /*************************************************/

    Subclass.ClassManager.registerClassType(Class);

    return Class;

})();