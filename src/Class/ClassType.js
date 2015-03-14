/**
 * @class
 * @description Abstract class of the each class type.
 *      Each instance of current class is a class definition which will be used
 *      for creating instances of its declaration.
 */
Subclass.Class.ClassType = (function()
{
    /**
     * @param {Subclass.Class.ClassManager} classManager
     *      Instance of class manager which will hold all class definitions of current module
     *
     * @param {string} className
     *      Name of the creating class
     *
     * @param {Object} classDefinition
     *      Definition of the creating class
     *
     * @constructor
     */
    function ClassType(classManager, className, classDefinition)
    {
        if (!classManager) {
            Subclass.Error.create('InvalidArgument')
                .argument("the class manager instance", false)
                .received(classManager)
                .expected("an instance of Subclass.Class.ClassManager class")
                .apply()
            ;
        }
        if (!className || typeof className != 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument("the name of class", false)
                .received(className)
                .expected("a string")
                .apply()
            ;
        }
        if (!classDefinition && typeof classDefinition != 'object') {
            Subclass.Error.create('InvalidArgument')
                .argument("the definition of class", false)
                .received(classDefinition)
                .expected("a plain object")
                .apply()
            ;
        }

        /**
         * The instance of class manager
         *
         * @type {Subclass.Class.ClassManager}
         * @protected
         */
        this._classManager = classManager;

        /**
         * The name of class
         *
         * @type {string}
         * @protected
         */
        this._name = className;

        /**
         * The instance class definition
         *
         * @type {Subclass.Class.ClassDefinition}
         * @protected
         */
        this._definition = this.createDefinition(classDefinition);

        /**
         * The class constructor function
         *
         * @type {(function|null)}
         * @protected
         */
        this._constructor = null;

        /**
         * The instance of class which is parent of current class
         *
         * @type {(Subclass.Class.ClassType|null)}
         * @protected
         */
        this._parent = null;

        /**
         * The plain object with class constants
         *
         * @type {Object}
         * @private
         */
        this._constants = {};

        //
        ///**
        // * @type {Object}
        // * @protected
        // */
        //this._properties = {};

        /**
         * Reports whether the instance of current class was created
         *
         * @type {boolean}
         * @private
         */
        this._created = false;

        /**
         * Initializing operations
         */
        this.initialize();
    }

    /**
     * Can be parent class type
     *
     * @type {(Subclass.Class.ClassType|null)}
     */
    ClassType.$parent = null;

    /**
     * Returns name of class type
     *
     * @example Example:
     *      Subclass.Class.Trait.Trait.getClassTypeName(); // returns "Trait"
     *
     * @returns {string}
     */
    ClassType.getClassTypeName = function ()
    {
        Subclass.Error.create("NotImplementedMethod")
            .method("getClassTypeName")
            .apply()
        ;
    };

    /**
     * Returns class builder constructor for specific class of current class type.
     *
     * @example Example:
     *      Subclass.Class.Type.AbstractClass.AbstractClass.getBuilderClass();
     *      // returns Subclass.Class.Type.AbstractClass.AbstractClassBuilder class constructor
     *
     * @returns {Function}
     */
    ClassType.getBuilderClass = function()
    {
        Subclass.Error.create("NotImplementedMethod")
            .method("getBuilderClass")
            .apply()
        ;
    };

    /**
     * Returns constructor for creating class definition instance
     *
     * @returns {Function}
     *      Returns class type definition constructor function
     */
    ClassType.getDefinitionClass = function()
    {
        return Subclass.Class.ClassDefinition;
    };

    /**
     * Initializes class on creation stage.
     * Current method invokes automatically right at the end of the class type constructor.
     * It can contain different manipulations with class definition or other manipulations that is needed
     */
    ClassType.prototype.initialize = function()
    {
        var classDefinition = this.getDefinition();
            classDefinition.processRelatedClasses();
    };

    /**
     * Returns class manager instance
     *
     * @returns {Subclass.Class.ClassManager}
     */
    ClassType.prototype.getClassManager = function ()
    {
        return this._classManager;
    };

    /**
     * Returns name of the current class instance
     *
     * @returns {string}
     */
    ClassType.prototype.getName = function()
    {
        return this._name;
    };

    /**
     * Creates and returns class definition instance.
     *
     * @param {Object} classDefinition
     * @returns {Subclass.Class.ClassDefinition}
     */
    ClassType.prototype.createDefinition = function(classDefinition)
    {
        return Subclass.Tools.createClassInstance(
            this.constructor.getDefinitionClass(),
            this,
            classDefinition
        );


        //var construct = null;
        //var createInstance = true;
        //
        //if (!arguments[1]) {
        //    construct = this.constructor.getDefinitionClass();
        //} else {
        //    construct = arguments[1];
        //}
        //if (arguments[2] === false) {
        //    createInstance = false;
        //}
        //
        //if (construct.$parent) {
        //    var parentConstruct = this.createDefinition(
        //        classDefinition,
        //        construct.$parent,
        //        false
        //    );
        //    var constructProto = Object.create(parentConstruct.prototype);
        //
        //    constructProto = Subclass.Tools.extend(
        //        constructProto,
        //        construct.prototype
        //    );
        //    construct.prototype = constructProto;
        //    construct.prototype.constructor = construct;
        //}
        //if (createInstance) {
        //    return new construct(this, classDefinition);
        //}
        //
        //return construct;
    };

    /**
     * Sets class definition
     *
     * @param {Object} classDefinition
     */
    ClassType.prototype.setDefinition = function(classDefinition)
    {
        this.constructor.call(
            this,
            this.getClassManager(),
            this.getName(),
            classDefinition
        );
    };

    /**
     * Returns class definition object
     *
     * @returns {Subclass.Class.ClassDefinition}
     */
    ClassType.prototype.getDefinition = function()
    {
        return this._definition;
    };

    /**
     * Sets class parent
     *
     * @param {string} parentClassName
     */
    ClassType.prototype.setParent = function (parentClassName)
    {
        if (typeof parentClassName == 'string') {
            this._parent = this.getClassManager().getClass(parentClassName)

        } else if (parentClassName === null) {
            this._parent = null;

        } else {
            Subclass.Error.create('InvalidArgument')
                .argument("the name of parent class", false)
                .received(parentClassName)
                .expected('a name of parent class or null in class "' + this.getName() + '"')
                .apply()
            ;
        }
    };

    /**
     * Returns parent class instance
     *
     * @return {(Subclass.Class.ClassType|null)}
     */
    ClassType.prototype.getParent = function ()
    {
        return this._parent;
    };

    /**
     * Checks whether current class extends another one
     *
     * @returns {boolean}
     */
    ClassType.prototype.hasParent = function()
    {
        return !!this._parent;
    };

    /**
     * Sets constants of the class
     *
     * @param {Object} constants
     *      The plain object which keys are names and values are values of constants
     */
    ClassType.prototype.setConstants = function(constants)
    {
        this._constants = constants;
    };

    /**
     * Creates the new (or redefines) constant with specified name and value
     *
     * @param {string} constName
     *      The name of constant
     *
     * @param {*} constValue
     *      The value of constant
     */
    ClassType.prototype.setConstant = function(constName, constValue)
    {
        this._constants[constName] = constValue;
    };

    /**
     * Returns class constants
     *
     * @param {boolean} [withInherited=false]
     *
     * @returns {Object}
     */
    ClassType.prototype.getConstants = function(withInherited)
    {
        var constants = this._constants;

        if (withInherited !== true) {
            withInherited = false;
        }
        if (withInherited && this.hasParent()) {
            var parentConstants = this.getParent().getConstants();
            constants = Subclass.Tools.extend(parentConstants, constants);
        }
        return constants;
    };
    //
    ///**
    // * Returns all typed properties in current class definition instance
    // *
    // * @param {boolean} [withInherited]
    // * @returns {Object.<Subclass.Property.PropertyType>}
    // */
    //ClassType.prototype.getProperties = function(withInherited)
    //{
    //    var properties = {};
    //
    //    if (withInherited !== true) {
    //        withInherited = false;
    //    }
    //
    //    if (withInherited && this.hasParent()) {
    //        var parentClass = this.getParent();
    //        var parentClassProperties = parentClass.getProperties(withInherited);
    //
    //        Subclass.Tools.extend(
    //            properties,
    //            parentClassProperties
    //        );
    //    }
    //    return Subclass.Tools.extend(
    //        properties,
    //        this._properties
    //    );
    //};
    //
    ///**
    // * Adds new typed property to class
    // *
    // * @param {string} propertyName
    // * @param {Object} propertyDefinition
    // */
    //ClassType.prototype.addProperty = function(propertyName, propertyDefinition)
    //{
    //    var propertyManager = this.getClassManager().getModule().getPropertyManager();
    //
    //    this._properties[propertyName] = propertyManager.createProperty(
    //        propertyName,
    //        propertyDefinition,
    //        this
    //    );
    //};
    //
    ///**
    // * Returns property instance by its name
    // *
    // * @param {string} propertyName
    // * @returns {Subclass.Property.PropertyType}
    // * @throws {Error}
    // */
    //ClassType.prototype.getProperty = function(propertyName)
    //{
    //    var classProperties = this.getProperties();
    //
    //    if (!classProperties[propertyName] && this.hasParent()) {
    //        return this.getParent().getProperty(propertyName);
    //
    //    } else if (!classProperties[propertyName]) {
    //        Subclass.Error.create(
    //            'Trying to call to non existent property "' + propertyName + '" ' +
    //            'in class "' + this.getName() + '".'
    //        );
    //    }
    //    return this.getProperties()[propertyName];
    //};
    //
    ///**
    // * Checks if property with specified property name exists
    // *
    // * @param {string} propertyName
    // * @returns {boolean}
    // */
    //ClassType.prototype.issetProperty = function(propertyName)
    //{
    //    var classProperties = this.getProperties();
    //
    //    if (!classProperties[propertyName] && this.hasParent()) {
    //        return this.getParent().issetProperty(propertyName);
    //
    //    } else if (!classProperties[propertyName]) {
    //        return false;
    //    }
    //    return true;
    //};

    /**
     * Returns constructor function for current class type
     *
     * @returns {function} Returns named function
     * @throws {Error}
     */
    ClassType.prototype.getConstructorEmpty = function ()
    {
        Subclass.Error.create("NotImplementedMethod")
            .method("getConstructorEmpty")
            .apply()
        ;
    };

    /**
     * Returns class constructor
     *
     * @returns {Function}
     */
    ClassType.prototype.getConstructor = function ()
    {
        if (!this._constructor) {
            var classDefinition = this.getDefinition();
            var baseClassDefinition = classDefinition.getBaseData();

            classDefinition.normalizeData();
            classDefinition.setData(Subclass.Tools.extend(
                baseClassDefinition,
                classDefinition.getData()
            ));
            classDefinition.validateData();
            classDefinition.processData();

            this._constructor = this.createConstructor();
        }

        return this._constructor;
    };

    /**
     * Generates and returns current class instance constructor
     *
     * @returns {function}
     */
    ClassType.prototype.createConstructor = function ()
    {
        var classConstructor = this.getConstructorEmpty();
        var parentClass = this.getParent();

        if (parentClass) {
            var parentClassConstructor = parentClass.getConstructor();
            var classConstructorProto = Object.create(parentClassConstructor.prototype);

            Subclass.Tools.extend(classConstructorProto, classConstructor.prototype);
            classConstructor.prototype = classConstructorProto;
        }

        //this.attachProperties(classConstructor.prototype);
        Subclass.Tools.extend(classConstructor.prototype, this.getDefinition().getMethods());
        Subclass.Tools.extend(classConstructor.prototype, this.getDefinition().getMetaData());
        Object.defineProperty(classConstructor.prototype, "constructor", {
            enumerable: false,
            configurable: true,
            value: classConstructor
        });

        classConstructor.prototype.$_className = this.getName();
        classConstructor.prototype.$_classType = this.constructor.getClassTypeName();
        classConstructor.prototype.$_class = this;

        return classConstructor;
    };

    /**
     * Returns whether it is needed to create constructor right away
     * after get class instance by Subclass.Class.ClassManager#getClass method
     *
     * @returns {boolean}
     */
    ClassType.prototype.createConstructorOnGet = function()
    {
        return true;
    };
    //
    ///**
    // * Creates and attaches class typed properties
    // *
    // * @param {Object} context Class constructor prototype
    // */
    //ClassType.prototype.attachProperties = function(context)
    //{
    //    var classProperties = this.getProperties();
    //
    //    for (var propName in classProperties) {
    //        if (!classProperties.hasOwnProperty(propName)) {
    //            continue;
    //        }
    //        classProperties[propName].attach(context);
    //    }
    //};

    /**
     * Creates class instance of current class type
     *
     * @returns {object} Class instance
     */
    ClassType.prototype.createInstance = function()
    {
        var args = [];

        for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
        }

        var classManager = this.getClassManager();
        var classConstructor = this.getConstructor();
        //var classProperties = this.getProperties(true);
        var classConstants = this.getConstants();
        var classInstance = new classConstructor();
        var setterName;

        // Attaching constants

        for (var constantName in classConstants) {
            if (!classConstants.hasOwnProperty(constantName)) {
                continue;
            }
            Object.defineProperty(classInstance, constantName, {
                enumerable: true,
                configurable: false,
                writable: false,
                value: classConstants[constantName]
            });
        }

        // Attaching hashed typed properties

        //for (var propertyName in classProperties) {
        //    if (!classProperties.hasOwnProperty(propertyName)) {
        //        continue;
        //    }
        //    classProperties[propertyName].attachHashed(classInstance);
        //
        //    // Getting init value
        //
        //    var property = classProperties[propertyName];
        //    var propertyDefinition = property.getDefinition();
        //    var initValue = propertyDefinition.getValue();
        //
        //    // Setting init value
        //
        //    if (initValue !== undefined) {
        //        if (propertyDefinition.isAccessors()) {
        //            setterName = Subclass.Tools.generateSetterName(propertyName);
        //            classInstance[setterName](initValue);
        //
        //        } else {
        //            classInstance[propertyName] = initValue;
        //        }
        //        property.setIsModified(false);
        //    }
        //}

        // Adding no methods to class instance

        var classNoMethods = this.getDefinition().getNoMethods(true);

        for (var propName in classNoMethods) {
            if (!classNoMethods.hasOwnProperty(propName)) {
                continue;
            }
            classInstance[propName] = Subclass.Tools.copy(classNoMethods[propName]);
        }

        Object.seal(classInstance);


        // Setting required classes to alias typed properties

        if (classInstance.$_requires) {
            if (Subclass.Tools.isPlainObject(classInstance.$_requires)) {
                for (var alias in classInstance.$_requires) {
                    if (!classInstance.$_requires.hasOwnProperty(alias)) {
                        continue;
                    }
                    setterName = Subclass.Tools.generateSetterName(alias);
                    var requiredClassName = classInstance.$_requires[alias];
                    var requiredClass = classManager.getClass(requiredClassName);

                    classInstance[setterName](requiredClass);
                }
            }
        }

        if (classInstance.$_constructor) {
            classInstance.$_constructor.apply(classInstance, args);
        }

        // Telling that instance of current class was created
        this.setInstanceCreated();

        return classInstance;
    };

    /**
     * Sets state that the instance of current class was created
     */
    ClassType.prototype.setInstanceCreated = function()
    {
        this._created = true;
    };

    /**
     * Reports whether the instance of current class was ever created
     *
     * @returns {boolean}
     */
    ClassType.prototype.wasInstanceCreated = function()
    {
        return this._created;
    };

    /**
     * Checks if current class is instance of another class
     *
     * @param {string} className
     * @return {boolean}
     */
    ClassType.prototype.isInstanceOf = function (className)
    {
        if (!className || typeof className != 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument("the name of class", false)
                .received(className)
                .expected("a string")
                .apply()
            ;
        }
        if (this.getName() == className) {
            return true;
        }
        if (this.hasParent()) {
            return this.getParent().isInstanceOf(className);
        }
        return false;
    };


    /*************************************************/
    /*        Performing register operations         */
    /*************************************************/

    // Adding not allowed class properties

    //Subclass.Property.PropertyManager.registerNotAllowedPropertyNames([
    //    "class",
    //    "parent",
    //    "classManager",
    //    "class_manager",
    //    "classWrap",
    //    "class_wrap",
    //    "className",
    //    "class_name"
    //]);

    return ClassType;

})();