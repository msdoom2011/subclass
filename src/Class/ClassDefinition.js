/**
 * @class
 */
Subclass.Class.ClassDefinition = (function()
{
    function ClassDefinition (classInst, classDefinition)
    {
        if (!classInst || !(classInst instanceof Subclass.Class.ClassType)) {
            Subclass.Error.create('InvalidArgument')
                .argument("the class instance", false)
                .received(classInst)
                .expected('an instance of "Subclass.Class.ClassType"')
                .apply()
            ;
        }
        if (!classDefinition || typeof classDefinition != 'object') {
            Subclass.Error.create('InvalidArgument')
                .argument("the definition of class", false)
                .received(classDefinition)
                .expected('a plain object')
                .apply()
            ;
        }

        /**
         * @type {Subclass.Class.ClassType}
         * @private
         */
        this._class = classInst;

        /**
         * @type {Object}
         * @private
         */
        this._data = classDefinition;
    }

    ClassDefinition.$parent = null;

    /**
     * Returns class definition object
     *
     * @returns {Object}
     */
    ClassDefinition.prototype.getData = function()
    {
        return this._data;
    };

    /**
     * Sets class definition data
     *
     * @param data
     */
    ClassDefinition.prototype.setData = function(data)
    {
        if (!data || typeof data != 'object') {
            Subclass.Error.create('InvalidArgument')
                .argument("the definition data", false)
                .received(data)
                .expected("a plain object")
                .apply()
            ;
        }
        this._data = data;
    };

    /**
     * Returns class instance
     *
     * @returns {Subclass.Class.ClassType}
     */
    ClassDefinition.prototype.getClass = function()
    {
        return this._class;
    };

    /**
     * Validates "$_requires" option value
     *
     * @param {*} requires
     * @returns {boolean}
     * @throws {Error}
     */
    ClassDefinition.prototype.validateRequires = function(requires)
    {
        if (requires && typeof requires != 'object') {
            Subclass.Error.create('InvalidClassOption')
                .option('$_requires')
                .received(requires)
                .className(this.getClass().getName())
                .expected('a plain object with string properties')
                .apply()
            ;
        }
        if (requires) {
            if (Array.isArray(requires)) {
                for (var i = 0; i < requires.length; i++) {
                    if (typeof requires[i] != 'string') {
                        Subclass.Error.create('InvalidClassOption')
                            .option('$_requires')
                            .received(requires)
                            .className(this.getClass().getName())
                            .expected('a plain object with string properties')
                            .apply()
                        ;
                    }
                }
            } else {
                for (var alias in requires) {
                    if (!requires.hasOwnProperty(alias)) {
                        continue;
                    }
                    if (!alias[0].match(/[a-z$_]/i)) {
                        Subclass.Error.create(
                            'Invalid alias name for required class "' + requires[alias] + '" ' +
                            'in class "' + this.getClass().getName() + '".'
                        );
                    }
                    if (typeof requires[alias] != 'string') {
                        Subclass.Error.create('InvalidClassOption')
                            .option('$_requires')
                            .received(requires)
                            .className(this.getClass().getName())
                            .expected('a plain object with string properties')
                            .apply()
                        ;
                    }
                }
            }
        }
        return true;
    };

    /**
     * Sets "$_requires" option value
     *
     * @param {Object.<string>} requires
     *
     *      List of the classes that current one requires. It can be specified in two ways:
     *
     *      1. As an array of class names:
     *
     *      Example:
     *      [
     *         "Namespace/Of/Class1",
     *         "Namespace/Of/Class2",
     *         ...
     *      ]
     *
     //*      2. As an object with pairs key/value where key is an class alias and value is a class name.
     //*
     //*      Example:
     //*      {
     //*         classAlias1: "Namespace/Of/Class1",
     //*         classAlias2: "Namespace/Of/Class2",
     //*         ...
     //*      }
     */
    ClassDefinition.prototype.setRequires = function(requires)
    {
        this.validateRequires(requires);
        this.getData().$_requires = requires || null;


        //var classInst = this.getClass();
        //
        //if (requires && Subclass.Tools.isPlainObject(requires)) {
        //    for (var alias in requires) {
        //        if (!requires.hasOwnProperty(alias)) {
        //            continue;
        //        }
        //        classInst.addProperty(alias, {
        //            type: "untyped",
        //            className: requires[alias]
        //        });
        //    }
        //}
    };

    /**
     * Return "$_requires" option value
     *
     * @returns {Object.<string>}
     */
    ClassDefinition.prototype.getRequires = function()
    {
        return this.getData().$_requires;
    };

    /**
     * Validates "$_extends" option value
     *
     * @param {*} parentClassName
     * @returns {boolean}
     * @throws {Error}
     */
    ClassDefinition.prototype.validateExtends = function(parentClassName)
    {
        if (parentClassName !== null && typeof parentClassName != 'string') {
            Subclass.Error.create('InvalidClassOption')
                .option('$_extends')
                .received(parentClassName)
                .className(this.getClass().getName())
                .expected('a string or null')
                .apply()
            ;
        }
        return true;
    };

    /**
     * Sets "$_extends" option value
     *
     * @param {string} parentClassName  Name of parent class, i.e. "Namespace/Of/ParentClass"
     */
    ClassDefinition.prototype.setExtends = function(parentClassName)
    {
        this.validateExtends(parentClassName);
        this.getData().$_extends = parentClassName;

        if (parentClassName) {
            this.getClass().setParent(parentClassName);
        }
    };

    /**
     * Returns "$_extends" option value
     *
     * @returns {string}
     */
    ClassDefinition.prototype.getExtends = function()
    {
        return this.getData().$_extends;
    };

    /**
     * Validates "$_constants" option value
     *
     * @param {*} constants
     * @returns {boolean}
     * @throws {Error}
     */
    ClassDefinition.prototype.validateConstants = function(constants)
    {
        if (constants !== null && !Subclass.Tools.isPlainObject(constants)) {
            Subclass.Error.create("InvalidClassOption")
                .option('$_constants')
                .className(this.getClass().getName())
                .received(constants)
                .expected('a plain object with not function values')
                .apply()
            ;
        } else if (constants) {
            for (var constantName in constants) {
                if (!constants.hasOwnProperty(constantName)) {
                    continue;
                }
                if (typeof constants[constantName] == 'function') {
                    Subclass.Error.create("InvalidClassOption")
                        .option('$_constants')
                        .className(this.getClass().getName())
                        .expected('a plain object with not function values')
                        .apply()
                    ;
                }
            }
        }
    };

    /**
     * Sets "$_constants" option value
     *
     * @param {Object} constants
     *      Name of parent class, i.e. "Namespace/Of/ParentClass"
     */
    ClassDefinition.prototype.setConstants = function(constants)
    {
        this.validateConstants(constants);
        this._constants = constants;

        if (constants) {
            this.getClass().setConstants(constants);
        }
    };

    /**
     * Returns "$_constants" option value
     *
     * @returns {Object}
     */
    ClassDefinition.prototype.getConstants = function()
    {
        return this._constants;
    };

    ///**
    // * Validates "$_properties" option value
    // *
    // * @param {*} properties
    // * @returns {boolean}
    // * @throws {Error}
    // */
    //ClassDefinition.prototype.validateProperties = function(properties)
    //{
    //    if (properties && typeof properties != 'object') {
    //        Subclass.Error.create('InvalidClassOption')
    //            .option('$_properties')
    //            .received(properties)
    //            .className(this.getClass().getName())
    //            .expected('a plain object with property definitions')
    //            .apply()
    //        ;
    //
    //    } else if (properties) {
    //        for (var propName in properties) {
    //            if (!properties.hasOwnProperty(propName)) {
    //                continue;
    //            }
    //            if (!Subclass.Property.PropertyManager.isPropertyNameAllowed(propName)) {
    //                Subclass.Error.create(
    //                    'Specified not allowed typed property name "' + propName + '" in option "$_properties" ' +
    //                    'in definition of class "' + this.getClass().getName() + '".'
    //                );
    //            }
    //            if (!properties[propName] || !Subclass.Tools.isPlainObject(properties[propName])) {
    //                Subclass.Error.create('InvalidClassOption')
    //                    .option('$_properties')
    //                    .received(properties)
    //                    .className(this.getClass().getName())
    //                    .expected('a plain object with property definitions')
    //                    .apply()
    //                ;
    //            }
    //            if (!properties[propName].type) {
    //                Subclass.Error.create(
    //                    'Trying to set not valid definition of typed property "' + propName + '" in option "$_properties" ' +
    //                    'in definition of class "' + this.getClass().getName() + '". ' +
    //                    'Required property "type" was missed.'
    //                );
    //            }
    //        }
    //    }
    //    return true;
    //};
    //
    ///**
    // * Normalizes property definitions.
    // * Brings all property definitions to the single form.
    // *
    // * @param {Object} properties
    // *      The object with property definitions
    // *
    // * @returns {Object}
    // */
    //ClassDefinition.prototype.normalizeProperties = function(properties)
    //{
    //    var classManager = this.getClass().getClassManager();
    //    var propertyManager = classManager.getModule().getPropertyManager();
    //
    //    if (properties && Subclass.Tools.isPlainObject(properties)) {
    //        for (var propertyName in properties) {
    //            if (properties.hasOwnProperty(propertyName)) {
    //                properties[propertyName] = propertyManager.normalizePropertyDefinition(
    //                    properties[propertyName]
    //                );
    //            }
    //        }
    //    }
    //    return properties;
    //};
    //
    ///**
    // * Sets "$_properties" option value
    // *
    // * @param {Object.<Object>} properties
    // *
    // *      List of the property definitions
    // *
    // *      Example: {
    // *         propName1: { type: "string", value: "init value" },
    // *         propName2: { type: "boolean" },
    // *         ...
    // *      }
    // */
    //ClassDefinition.prototype.setProperties = function(properties)
    //{
    //    this.normalizeProperties(properties);
    //    this.validateProperties(properties);
    //    this.getData().$_properties = properties || {};
    //
    //    if (properties) {
    //        for (var propName in properties) {
    //            if (!properties.hasOwnProperty(propName)) {
    //                continue;
    //            }
    //            this.getClass().addProperty(
    //                propName,
    //                properties[propName]
    //            );
    //        }
    //    }
    //};
    //
    ///**
    // * Return "$_properties" option value
    // *
    // * @returns {Object.<Object>}
    // */
    //ClassDefinition.prototype.getProperties = function()
    //{
    //    return this.getData().$_properties;
    //};

    /**
     * Returns all properties which names started from symbols "$_"
     *
     * @param {boolean} [withInherited = false]
     * @returns {Object}
     */
    ClassDefinition.prototype.getMetaData = function(withInherited)
    {
        return this._getDataPart('metaData', withInherited);
    };

    /**
     * Returns all class methods (except methods which names started from symbols "$_")
     *
     * @param {boolean} [withInherited = false]
     * @returns {Object}
     */
    ClassDefinition.prototype.getMethods = function(withInherited)
    {
        return this._getDataPart('methods', withInherited);
    };

    /**
     * Returns class to which belongs specified method body
     *
     * @param {Function} methodFunc
     * @returns {(Subclass.Class.ClassType|null)}
     */
    ClassDefinition.prototype.getMethodClass = function(methodFunc)
    {
        var classInst = this.getData();

        for (var propName in classInst) {
            if (classInst.hasOwnProperty(propName)) {
                return this.getClass();
            }
        }
        if (this.getClass().hasParent()) {
            return this.getClass()
                .getParent()
                .getDefinition()
                .getMethodClass(methodFunc)
            ;
        }
        return null;
    };

    /**
     * Returns all class properties (except properties which names started from symbols "$_")
     * that are not methods
     *
     * @param {boolean} [withInherited = false]
     * @returns {Object}
     */
    ClassDefinition.prototype.getNoMethods = function(withInherited)
    {
        return this._getDataPart('noMethods', withInherited);
    };

    /**
     * Returns some grouped parts of class definition depending on specified typeName.
     *
     * @param {string} typeName
     *      Can be one of the followed values: 'noMethods', 'methods' or 'metaData'
     *
     *      noMethods - Returns all class properties (except properties which names started from symbols "$_")
     *      that are not methods
     *
     *      methods - Returns all class methods (except methods which names started from symbols "$_")
     *
     *      metaData - Returns all properties which names started from symbols "$_"
     *
     * @param {boolean} [withInherited = false]
     * @returns {Object}
     * @private
     */
    ClassDefinition.prototype._getDataPart = function(typeName, withInherited)
    {
        if (['noMethods', 'methods', 'metaData'].indexOf(typeName) < 0) {
            Subclass.Error.create(
                'Trying to get not existent class definition part data "' + typeName + '".'
            );
        }
        if (withInherited !== true) {
            withInherited = false;
        }
        var definition = this.getData();
        var classInst = this.getClass();
        var parts = {};

        if (classInst.hasParent() && withInherited) {
            var classParent = classInst.getParent();
            var classParentDefinition = classParent.getDefinition();

            parts = classParentDefinition._getDataPart(
                typeName,
                withInherited
            );
        }

        for (var propName in definition) {
            if (
                !definition.hasOwnProperty(propName)
                || (
                    (typeName == 'noMethods' && (
                        typeof definition[propName] == 'function'
                        || propName.match(/^\$_/i)

                    )) || (typeName == 'methods' && (
                        typeof definition[propName] != 'function'
                        || propName.match(/^\$_/i)

                    )) || (typeName == 'metaData' && (
                        !propName.match(/^\$_/i)
                    ))
                )
            ) {
                continue;
            }
            parts[propName] = definition[propName];
        }
        return parts;
    };

    /**
     * Modifies class definition
     *
     * @returns {object}
     */
    ClassDefinition.prototype.getBaseData = function()
    {
        return {

            /**
             * Class name
             *
             * @type {string}
             */
            $_className: null,

            /**
             * Class type
             *
             * @type {string}
             */
            $_classType: null,

            /**
             * Class definition closure
             *
             * @type {Subclass.Class.ClassType}
             */
            $_class: null,

            /**
             * Required classes
             *
             * @type {(string[]|Object.<string>|null)}
             */
            $_requires: null,

            /**
             * Parent class name
             *
             * @type {string}
             */
            $_extends: null,

            /**
             * Constants list
             *
             * @type {Object}
             */
            $_constants: null,

            ///**
            // * List of class typed properties
            // *
            // * @type {Object}
            // */
            //$_properties: {},

            /**
             * Class constructor
             *
             * @param [arguments] Any class constructor arguments
             */
            $_constructor: function()
            {
                // Do something
            },

            /**
             * Returns class manager instance
             *
             * @returns {Subclass.Class.ClassManager}
             */
            getClassManager: function()
            {
                return this.$_class.getClassManager();
            },

            /**
             * Returns class definition instance
             *
             * @returns {Subclass.Class.ClassType}
             */
            getClass: function()
            {
                return this.$_class;
            },

            /**
             * Returns class name
             *
             * @returns {string}
             */
            getClassName: function()
            {
                return this.$_className;
            },

            /**
             * Returns type name of class
             *
             * @returns {*}
             */
            getClassType: function()
            {
                return this.$_classType;
            },

            /**
             * Checks if current class instance of passed class with specified name
             *
             * @param {string} className
             * @returns {boolean}
             */
            isInstanceOf: function (className)
            {
                return this.$_class.isInstanceOf(className);
            },

            /**
             * Returns parent class definition instance
             *
             * @returns {Object} Prototype of parent class.
             */
            getParent: function ()
            {
                if (!this.$_class.getParent()) {
                    return null;
                }
                return this.$_class
                    .getParent()
                    .getConstructor()
                    .prototype
                ;
            },

            /**
             *
             * @param {string} methodName
             * @param [arguments]
             */
            callParent: function (methodName)
            {
                var methodFunc = this[methodName];

                if (!methodFunc || typeof methodFunc != 'function') {
                    Subclass.Error.create(
                        'Trying to call to non existent method "' + methodName + '" ' +
                        'in class "' + this.getClass().getName() + '"'
                    );
                }
                var parentClass = this
                    .getParent()
                    .getClass()
                    .getDefinition()
                    .getMethodClass(this[methodName])
                ;
                if (!parentClass) {
                    Subclass.Error.create(
                        'Trying to call parent method "' + methodName + '" ' +
                        'in class "' + this.getClass().getName() + '" which hasn\'t parent'
                    );
                }
                if (methodFunc == parentClass.getDefinition().getData()[methodName]) {
                    parentClass = parentClass.getParent();
                }
                var args = [];

                for (var i = 1; i < arguments.length; i++) {
                    args.push(arguments[i]);
                }
                return parentClass
                    .getDefinition()
                    .getData()[methodName]
                    .apply(this, args)
                ;
            },

            /**
             * Returns copy of current class instance
             *
             * @returns {Object}
             */
            getCopy: function()
            {
                var copyInst = new this.constructor();

                for (var propName in this) {
                    if (!this.hasOwnProperty(propName)) {
                        continue;
                    }
                    copyInst[propName] = this[propName];
                }
                return copyInst;
            }
            //
            ///**
            // * Checks if property is typed
            // *
            // * @param {string} propertyName
            // * @returns {boolean}
            // */
            //issetProperty: function(propertyName)
            //{
            //    return this.$_class.issetProperty(propertyName);
            //},
            //
            ///**
            // * Returns property api object
            // *
            // * @param {string} propertyName
            // * @returns {Subclass.Property.PropertyAPI}
            // */
            //getProperty: function(propertyName)
            //{
            //    return this.$_class.getProperty(propertyName).getAPI(this);
            //}
        };
    };

    /**
     * Normalizes definition data
     */
    ClassDefinition.prototype.normalizeData = function()
    {
        // Do some manipulations with class definition data


        //-----------------------------------------------------------
        //var data = this.getData();
        //
        //if (
        //    data.hasOwnProperty('$_properties')
        //    && Subclass.Tools.isPlainObject(data["$_properties"])
        //) {
        //    data["$_properties"] = this.normalizeProperties(data["$_properties"]);
        //}
    };

    /**
     * Validates class definition
     *
     * @returns {boolean}
     * @throws {Error}
     */
    ClassDefinition.prototype.validateData = function ()
    {
        // Do some validation manipulations with class definition data


        //-----------------------------------------------------------
        //var definition = this.getData();
        //var classInst = this.getClass();
        //
        //for (var propName in definition) {
        //    if (!definition.hasOwnProperty(propName)) {
        //        continue;
        //    }
        //    if (!Subclass.Property.PropertyManager.isPropertyNameAllowed(propName)) {
        //        Subclass.Error.create(
        //            'Trying to define property with not allowed name "' + propName + '" ' +
        //            'in class "' + classInst.getName() + '".'
        //        );
        //    }
        //}
        return true;
    };

    /**
     * Processes class definition. Getting info from classDefinition.
     */
    ClassDefinition.prototype.processData = function ()
    {
        var definition = this.getData();

        for (var attrName in definition) {
            if (
                !definition.hasOwnProperty(attrName)
                || !attrName.match(/^\$_/i)
            ) {
                continue;
            }
            var setterMethod = "set" + attrName.substr(2)[0].toUpperCase() + attrName.substr(3);

            if (this[setterMethod]) {
                this[setterMethod](definition[attrName]);
            }
        }

        ////Extending accessors
        //
        //this.processPropertyAccessors();
    };

    ///**
    // * Extends class constructor with specific methods.
    // *
    // * If getter or setter of any typed property was redefined in the class definition
    // * the new methods will generated. For setter it's gonna be "<setterOrGetterName>Default"
    // * where "<setterOrGetterName>" is name of redefined setter or getter name.
    // *
    // * These methods allows to interact with private properties through redefined getters and setters.
    // *
    // * @returns {Function}
    // */
    //ClassDefinition.prototype.processPropertyAccessors = function()
    //{
    //    var classProperties = this.getClass().getProperties();
    //    var classDefinition = this.getData();
    //
    //    for (var propertyName in classProperties) {
    //        if (!classProperties.hasOwnProperty(propertyName)) {
    //            continue;
    //        }
    //        var property = classProperties[propertyName];
    //
    //        if (!property.getDefinition().isAccessors()) {
    //            continue;
    //        }
    //        var accessors = {
    //            Getter: Subclass.Tools.generateGetterName(propertyName),
    //            Setter: Subclass.Tools.generateSetterName(propertyName)
    //        };
    //
    //        for (var accessorType in accessors) {
    //            if (!accessors.hasOwnProperty(accessorType)) {
    //                continue;
    //            }
    //            var accessorName = accessors[accessorType];
    //
    //            if (classDefinition[accessorName]) {
    //                classDefinition[accessorName + "Default"] = property['generate' + accessorType]();
    //            }
    //        }
    //    }
    //};

    /**
     * Searches for the names of classes which are needed to be loaded
     */
    ClassDefinition.prototype.processRelatedClasses = function()
    {
        var classInst = this.getClass();
        var classManager = classInst.getClassManager();
        //var propertyManager = classManager.getModule().getPropertyManager();
        //var dataTypeManager = propertyManager.getDataTypeManager();

        var requires = this.getRequires();
        //var properties = this.getProperties();
        var parentClass = this.getExtends();

        // Performing $_requires option

        if (requires && this.validateRequires(requires)) {
            if (Subclass.Tools.isPlainObject(requires)) {
                for (var alias in requires) {
                    if (requires.hasOwnProperty(alias)) {
                        classManager.loadClass(requires[alias]);
                    }
                }
            } else if (Array.isArray(requires)) {
                for (var i = 0; i < requires.length; i++) {
                    classManager.loadClass(requires[i]);
                }
            }
        }

        // Performing $_extends option

        if (parentClass && this.validateExtends(parentClass)) {
            classManager.loadClass(parentClass);
        }

        //// Performing $_properties option
        //
        //if (properties && Subclass.Tools.isPlainObject(properties)) {
        //    for (var propName in properties) {
        //        if (!properties.hasOwnProperty(propName)) {
        //            continue;
        //        }
        //        var propertyDefinition = propertyManager.normalizePropertyDefinition(properties[propName]);
        //
        //        if (typeof propertyDefinition != 'object') {
        //            continue;
        //        }
        //        var propertyTypeName = propertyDefinition.type;
        //
        //        if (dataTypeManager.issetType(propertyTypeName)) {
        //            var dataTypeDefinition = Subclass.Tools.copy(dataTypeManager.getTypeDefinition(propertyTypeName));
        //            propertyTypeName = dataTypeDefinition.type;
        //
        //            propertyDefinition = Subclass.Tools.extendDeep(dataTypeDefinition, propertyDefinition);
        //            propertyDefinition.type = propertyTypeName;
        //        }
        //        var propertyType = Subclass.Property.PropertyManager.getPropertyType(propertyDefinition.type);
        //
        //        if (!propertyType.parseRelatedClasses) {
        //            continue;
        //        }
        //        var requiredClasses = propertyType.parseRelatedClasses(propertyDefinition);
        //
        //        if (requiredClasses && requiredClasses.length) {
        //            for (i = 0; i < requiredClasses.length; i++) {
        //                classManager.loadClass(requiredClasses[i]);
        //            }
        //        }
        //    }
        //}
    };

    return ClassDefinition;

})();