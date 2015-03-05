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
     * @param {Subclass.Class.ClassManager} classManager
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

        /**
         * List of interfaces class names
         *
         * @type {String[]}
         * @private
         */
        this._interfaces = [];

        /**
         * List of traits class names
         *
         * @type {String[]}
         * @private
         */
        this._traits = [];
    }

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
    Class.prototype.setParent = function (parentClassName)
    {
        Class.$parent.prototype.setParent.call(this, parentClassName);

        if (
            this._parent
            && this._parent.constructor != Class
            && this._parent.constructor != Subclass.Class.ClassManager.getClassType('AbstractClass')
        ) {
            Subclass.Error.create(
                'The class "' + this.getName() + '" can be inherited ' +
                'only from another class or abstract class.'
            );
        }
    };

    /**
     * Returns class static properties and methods
     *
     * @returns {Object}
     */
    Class.prototype.getStatic = function()
    {
        return this.getDefinition().getStatic();
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

            if (parent.getAbstractMethods) {
                Subclass.Tools.extend(
                    abstractMethods,
                    parent.getAbstractMethods()
                );
            }
        }
        if (
            !Subclass.Class.ClassManager.issetClassType('AbstractClass')
            || (
                Subclass.Class.ClassManager.issetClassType('AbstractClass')
                && this.constructor != Subclass.Class.Type.AbstractClass.AbstractClass
            )
        ) {
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
            ) || (
                this.isImplements
                && this.isImplements(className)
            )
        );
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

    /**
     * Returns trait names list
     *
     * @returns {Array}
     * @throws {Error}
     */
    Class.prototype.getTraits = function ()
    {
        if (!Subclass.Class.ClassManager.issetClassType('Trait')) {
            Subclass.Error.create('NotExistentMethod')
                .method('getTraits')
                .apply()
            ;
        }
        return this._traits;
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

        if (!Subclass.Class.ClassManager.issetClassType('Trait')) {
            Subclass.Error.create('NotExistentMethod')
                .method('addTrait')
                .apply()
            ;
        }
        if (!traitName || typeof traitName != 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument("the name of trait", false)
                .received(traitName)
                .expected("a string")
                .apply()
            ;
        }
        var traitClass = this.getClassManager().getClass(traitName);
        var traitClassConstructor = traitClass.getConstructor();
        //var traitClassProperties = traitClass.getProperties();
        var traitProps = {};

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

        // Copying all properties and methods (with inherited) from trait to class definition

        for (var propName in traitClassConstructor.prototype) {
            if (propName.match(/^\$_/i)) {
                continue;
            }
            traitProps[propName] = traitClassConstructor.prototype[propName];
        }
        this.getTraits().push(traitClass);

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
        if (!Subclass.Class.ClassManager.issetClassType('Trait')) {
            Subclass.Error.create('NotExistentMethod')
                .method('hasTrait')
                .apply()
            ;
        }
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

    /**
     * Returns interface names list
     *
     * @returns {Array}
     * @throws {Error}
     */
    Class.prototype.getInterfaces = function ()
    {
        if (!Subclass.Class.ClassManager.issetClassType('Interface')) {
            Subclass.Error.create('NotExistentMethod')
                .method('getInterfaces')
                .apply()
            ;
        }
        return this._interfaces;
    };

    /**
     * Adds new interface
     *
     * @param {string} interfaceName
     * @throws {Error}
     */
    Class.prototype.addInterface = function (interfaceName)
    {
        if (!Subclass.Class.ClassManager.issetClassType('Interface')) {
            Subclass.Error.create('NotExistentMethod')
                .method('addInterface')
                .apply()
            ;
        }
        if (!interfaceName || typeof interfaceName != 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument("the name of interface", false)
                .received(interfaceName)
                .expected("a string")
                .apply()
            ;
        }
        var interfaceClass = this.getClassManager().getClass(interfaceName);

        if (interfaceClass.constructor != Subclass.Class.Type.Interface.Interface) {
            Subclass.Error.create(
                'Can\'t implement no interface "' + interfaceName + '" ' +
                'in class "' + this.getName() + '".'
            );
        }

        var interfaceClassConstructor = interfaceClass.getConstructor();
        var interfaceClassConstructorProto = interfaceClassConstructor.prototype;
        //var interfaceClassProperties = interfaceClass.getClassDefinitionProperties();
        var abstractMethods = {};

        if (interfaceClass.constructor != Subclass.Class.Type.Interface.Interface) {
            Subclass.Error.create(
                'Trying add to "$_implements" option ' +
                'the new class "' + interfaceName + '" that is not an interface.'
            );
        }

        // Add interface properties

        //for (var propName in interfaceClassProperties) {
        //    if (!interfaceClassProperties.hasOwnProperty(propName)) {
        //        continue;
        //    }
        //    this.addProperty(
        //        propName,
        //        interfaceClassProperties[propName]
        //    );
        //}

        // Add all interface prototype properties (with inherited)

        loop: for (var methodName in interfaceClassConstructorProto) {
            if (typeof interfaceClassConstructorProto[methodName] != 'function') {
                continue;
            }
            //for (propName in interfaceClassProperties) {
            //    if (!interfaceClassProperties.hasOwnProperty(propName)) {
            //        continue;
            //    }
            //    var setterName = Subclass.Tools.generateSetterName(propName);
            //    var getterName = Subclass.Tools.generateGetterName(propName);
            //
            //    if (methodName == setterName || methodName == getterName) {
            //        continue loop;
            //    }
            //}
            abstractMethods[methodName] = interfaceClassConstructorProto[methodName];
        }
        this.addAbstractMethods(abstractMethods);
        this.getInterfaces().push(interfaceName);
    };

    /**
     * Checks if current class implements specified interface
     *
     * @param interfaceName
     * @returns {*}
     * @throws {Error}
     */
    Class.prototype.isImplements = function (interfaceName)
    {
        if (!Subclass.Class.ClassManager.issetClassType('Interface')) {
            Subclass.Error.create('NotExistentMethod')
                .method('isImplements')
                .apply()
            ;
        }
        if (!interfaceName || typeof interfaceName != 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument("the name of interface", false)
                .received(interfaceName)
                .expected("a string")
                .apply()
            ;
        }
        var classManager = this.getClassManager();
        var interfaces = this.getInterfaces();

        if (interfaces && interfaces.indexOf(interfaceName) >= 0) {
            return true;

        } else {
            for (var i = 0; i < interfaces.length; i++) {
                var classInst = classManager.getClass(interfaces[i]);

                if (classInst.isInstanceOf(interfaceName)) {
                    return true;
                }
            }
        }
        if (this.hasParent()) {
            var parent = this.getParent();

            if (parent.isImplements) {
                return parent.isImplements(interfaceName);
            }
        }
        return false;
    };


    /*************************************************/
    /*         Registering new class type            */
    /*************************************************/

    Subclass.Class.ClassManager.registerClassType(Class);

    return Class;

})();