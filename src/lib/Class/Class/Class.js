; Subclass.ClassManager.ClassTypes.Class = (function() {

    /*************************************************/
    /*        Describing class type "Class"          */
    /*************************************************/

    /**
     * @param {ClassManager} classManager
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

    Class.$parent = Subclass.ClassManager.ClassTypes.ClassType;

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
    Class.getClassBuilder = function()
    {
        return Subclass.ClassManager.ClassTypes.Class.Builder;
    };

    /**
     * @inheritDoc
     */
    Class.prototype.setClassParent = function (parentClassName)
    {
        Class.$parent.prototype.setClassParent.call(this, parentClassName);

        if (
            this._classParent
            && this._classParent.constructor != Class
            && this._classParent.constructor != Subclass.ClassManager.getClassType('AbstractClass')
        ) {
            throw new Error('Class "' + this.getClassName() + '" can be inherited only from an another class or an abstract class.');
        }
    };

    /**
     * @inheritDoc
     */
    Class.prototype.getClassProperties = function ()
    {
        //if (Subclass.ClassManager.issetClassType("Trait") && this.getTraits().length) {
        //    var traits = this.getTraits();
        //
        //    for (var i = 0; i < traits.length; i++) {
        //        var trait = traits[i];
        //        var traitProperties = trait.getClassProperties();
        //
        //        Subclass.Tools.extend(this._classProperties, traitProperties);
        //    }
        //}
        return this._classProperties;
    };

    /**
     * @inheritDoc
     */
    Class.prototype.getClassConstructorEmpty = function ()
    {
        return function Class() {};
    };

    /**
     * @inheritDoc
     * @throws {Error}
     */
    Class.prototype.createClassConstructor = function ()
    {
        var classConstructor = Class.$parent.prototype.createClassConstructor.call(this);
        var abstractMethods = this._abstractMethods = this.getAbstractMethods();
        var notImplementedMethods = [];

        if (this.getClassParent()) {
            var parent = this.getClassParent();

            if (parent.getAbstractMethods) {
                Subclass.Tools.extend(
                    abstractMethods,
                    parent.getAbstractMethods()
                );
            }
        }
        if (
            !Subclass.ClassManager.issetClassType('AbstractClass')
            || (
                Subclass.ClassManager.issetClassType('AbstractClass')
                && this.constructor != Subclass.ClassManager.ClassTypes.AbstractClass
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
                throw new Error('Class "' + this.getClassName() + '" must be an abstract or implement abstract methods: ' +
                    '"' + notImplementedMethods.join('", "') + '".');
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
        if (Class.$parent.prototype.isInstanceOf.call(this, className)) {
            return true;
        }
        if (this.hasTrait && this.hasTrait(className)) {
            return true;
        }
        if (this.isImplements && this.isImplements(className)) {
            return true;
        }
        return false;
    };

    /**
     * @inheritDoc
     */
    Class.prototype.getBaseClassDefinition = function ()
    {
        var classDefinition = Class.$parent.prototype.getBaseClassDefinition();

        if (Subclass.ClassManager.issetClassType('Trait')) {

            /**
             * Array of traits names
             *
             * @type {string[]}
             */
            classDefinition.$_traits = [];

            /**
             * Checks if current class instance has specified trait
             *
             * @param {string} traitName
             * @returns {boolean}
             */
            classDefinition.hasTrait = function (traitName)
            {
                return this.$_class.hasTrait(traitName);
            };
        }

        if (Subclass.ClassManager.issetClassType('Interface')) {

            /**
             * Array of interfaces names
             *
             * @type {string[]}
             */
            classDefinition.$_implements = [];

            /**
             * Checks if current class implements specified interface
             *
             * @param {string} interfaceName
             * @returns {boolean}
             */
            classDefinition.isImplements = function (interfaceName)
            {
                return this.$_class.isImplements(interfaceName);
            };
        }
        return classDefinition;
    };

    /**
     * @inheritDoc
     */
    Class.prototype.processClassDefinition = function ()
    {
        var classDefinition = this.getClassDefinition();

        // Parsing traits

        if (Subclass.ClassManager.issetClassType('Trait')) {
            for (var i = 0; i < classDefinition.$_traits.length; i++) {
                this.addTrait(classDefinition.$_traits[i]);
            }
        }

        // Parsing interfaces

        if (Subclass.ClassManager.issetClassType('Interface')) {
            for (i = 0; i < classDefinition.$_implements.length; i++) {
                this.addInterface(classDefinition.$_implements[i]);
            }
        }

        Class.$parent.prototype.processClassDefinition.call(this);
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
        if (!Subclass.ClassManager.issetClassType('Trait')) {
            throw new Error('Trying to call non existent method "getTraits".');
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
        var classDefinition = this.getClassDefinition();

        if (!Subclass.ClassManager.issetClassType('Trait')) {
            throw new Error('Trying to call non existent method "addTrait".');
        }
        if (!traitName) {
            throw new Error('Trait name must be specified.');
        }
        var traitClass = this.getClassManager().getClass(traitName);
        var traitClassConstructor = traitClass.getClassConstructor();
        var traitClassProperties = traitClass.getClassProperties();
        var traitProps = {};

        if (traitClass.constructor != Subclass.ClassManager.ClassTypes.Trait) {
            throw new Error('Trying add to "$_traits" parameter new class "' + traitName + '" that is not trait.');
        }

        for (var propName in traitClassProperties) {
            if (!traitClassProperties.hasOwnProperty(propName)) {
                continue;
            }
            var property = traitClassProperties[propName];
            this.addClassProperty(propName, property.getPropertyDefinition());
        }

        for (propName in traitClassConstructor.prototype) {
            if (['$_extends', '$_properties'].indexOf(propName) >= 0) {
                continue;
            }
            traitProps[propName] = traitClassConstructor.prototype[propName];
        }
        this._classDefinition = Subclass.Tools.extend(traitProps, classDefinition);
        this.getTraits().push(traitClass);
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
        if (!Subclass.ClassManager.issetClassType('Trait')) {
            throw new Error('Trying to call non existent method "hasTrait".');
        }
        if (!traitName || typeof traitName != "string") {
            throw new Error('Trait name must be specified.');
        }
        var traits = this.getTraits();

        for (var i = 0; i < traits.length; i++) {
            if (traits[i].isInstanceOf(traitName)) {
                return true;
            }
        }
        if (this.getClassParent()) {
            var parent = this.getClassParent();

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
        if (!Subclass.ClassManager.issetClassType('Interface')) {
            throw new Error('Trying to call non existent method "getInterfaces".');
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
        if (!Subclass.ClassManager.issetClassType('Interface')) {
            throw new Error('Trying to call non existent method "addInterface".');
        }
        if (!interfaceName) {
            throw new Error('Interface name must be specified.');
        }
        var interfaceClass = this.getClassManager().getClass(interfaceName);
        var interfaceClassConstructor = interfaceClass.getClassConstructor();
        var interfaceClassConstructorProto = interfaceClassConstructor.prototype;
        var interfaceClassProperties = interfaceClass.getClassDefinitionProperties();
        var abstractMethods = {};

        if (interfaceClass.constructor != Subclass.ClassManager.ClassTypes.Interface) {
            throw new Error('Trying add to "$_implements" parameter new class "' + interfaceName + '" that is not interface.');
        }

        // Add interface properties

        for (var propName in interfaceClassProperties) {
            if (!interfaceClassProperties.hasOwnProperty(propName)) {
                continue;
            }
            this.addClassProperty(
                propName,
                interfaceClassProperties[propName]
            );
        }

        // Add all interface prototype properties (with inherited)

        loop: for (var methodName in interfaceClassConstructorProto) {
            if (typeof interfaceClassConstructorProto[methodName] != 'function') {
                continue;
            }
            for (propName in interfaceClassProperties) {
                if (!interfaceClassProperties.hasOwnProperty(propName)) {
                    continue;
                }
                var setterName = Subclass.Tools.generateSetterName(propName);
                var getterName = Subclass.Tools.generateGetterName(propName);

                if (methodName == setterName || methodName == getterName) {
                    continue loop;
                }
            }
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
        if (!Subclass.ClassManager.issetClassType('Interface')) {
            throw new Error('Trying to call non existent method "isImplements".');
        }
        if (!interfaceName) {
            throw new Error('Interface name must be specified.');
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
        if (this.getClassParent()) {
            var parent = this.getClassParent();

            if (parent.hasTrait) {
                return parent.isImplements(interfaceName);
            }
        }
        return false;
    };


    /*************************************************/
    /*         Registering new class type            */
    /*************************************************/

    Subclass.ClassManager.registerClassType(Class);

    return Class;

})();