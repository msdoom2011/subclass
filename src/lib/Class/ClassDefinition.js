/**
 * @class
 */
Subclass.Class.ClassDefinition = (function()
{
    function ClassDefinition (classInst, classDefinition)
    {
        if (!classInst || !(classInst instanceof Subclass.Class.ClassTypeInterface)) {
            throw new Error(
                'Invalid argument "classInst" in constructor ' +
                'of "Subclass.Class.ClassDefinition" class.' +
                'It must be an instance of "Subclass.Class.ClassTypeInterface".'
            );
        }
        if (!classDefinition || typeof classDefinition != 'object') {
            throw new Error(
                'Invalid argument "classDefinition" in constructor ' +
                'of "Subclass.Class.ClassDefinition" class.' +
                'It must be a plain object'
            );
        }

        /**
         * @type {PropertyType}
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
            throw new Error('Invalid argument "data" in method "setData". It must be an object.');
        }
        this._data = data;
    };

    /**
     * Returns property instance
     *
     * @returns {PropertyType}
     */
    ClassDefinition.prototype.getClass = function()
    {
        return this._class;
    };

    /**
     * Validates "$_requires" attribute value
     *
     * @param {*} requires
     * @returns {boolean}
     * @throws {Error}
     */
    ClassDefinition.prototype.validateRequires = function(requires)
    {
        if (requires && typeof requires != 'object') {
            this._throwInvalidAttribute('$_requires', 'a plain object with string properties.');
        }
        if (requires) {
            if (Array.isArray(requires)) {
                for (var i = 0; i < requires.length; i++) {
                    if (typeof requires[i] != 'string') {
                        this._throwInvalidAttribute('$_requires', 'a plain object with string properties.');
                    }
                }
            } else {
                for (var alias in requires) {
                    if (!requires.hasOwnProperty(alias)) {
                        continue;
                    }
                    if (!alias[0].match(/[a-z$_]/i)) {
                        throw new Error(
                            'Invalid alias name for required class "' + requires[alias] + '" ' +
                            'in class "' + this.getClass().getName() + '".'
                        );
                    }
                    if (typeof requires[alias] != 'string') {
                        this._throwInvalidAttribute('$_requires', 'a plain object with string properties.');
                    }
                }
            }
        }
        return true;
    };

    /**
     * Sets "$_requires" attribute value
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
     *      2. As an object with pairs key/value where key is an class alias and value is a class name.
     *
     *      Example:
     *      {
     *         classAlias1: "Namespace/Of/Class1",
     *         classAlias2: "Namespace/Of/Class2",
     *         ...
     *      }
     */
    ClassDefinition.prototype.setRequires = function(requires)
    {
        this.validateRequires(requires);
        this.getData().$_requires = requires || null;
        var classInst = this.getClass();

        if (requires && Subclass.Tools.isPlainObject(requires)) {
            for (var alias in requires) {
                if (!requires.hasOwnProperty(alias)) {
                    continue;
                }
                classInst.addProperty(alias, {
                    type: "untyped",
                    className: requires[alias]
                });
            }
        }
    };

    /**
     * Return "$_requires" attribute value
     *
     * @returns {Object.<string>}
     */
    ClassDefinition.prototype.getRequires = function()
    {
        return this.getData().$_requires;
    };

    /**
     * Validates "$_extends" attribute value
     *
     * @param {*} parentClassName
     * @returns {boolean}
     * @throws {Error}
     */
    ClassDefinition.prototype.validateExtends = function(parentClassName)
    {
        if (parentClassName !== null && typeof parentClassName != 'string') {
            this._throwInvalidAttribute('$_requires', 'a string or null.');
        }
        return true;
    };

    /**
     * Sets "$_extends" attribute value
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
     * Returns "$_extends" attribute value
     *
     * @returns {string}
     */
    ClassDefinition.prototype.getExtends = function()
    {
        return this.getData().$_extends;
    };

    /**
     * Validates "$_properties" attribute value
     *
     * @param {*} properties
     * @returns {boolean}
     * @throws {Error}
     */
    ClassDefinition.prototype.validateProperties = function(properties)
    {
        if (properties && typeof properties != 'object') {
            this._throwInvalidAttribute('$_properties', 'a plain object with property definitions');

        } else if (properties) {
            for (var propName in properties) {
                if (!properties.hasOwnProperty(propName)) {
                    continue;
                }
                if (!Subclass.Property.PropertyManager.isPropertyNameAllowed(propName)) {
                    throw Error(
                        'Specified not allowed typed property name "' + propName + '" in attribute "$_properties" ' +
                        'in definition of class "' + this.getClass().getName() + '".'
                    );
                }
                if (!properties[propName] || !Subclass.Tools.isPlainObject(properties[propName])) {
                    this._throwInvalidAttribute('$_properties', 'a plain object with not empty property definitions');
                }
                if (!properties[propName].type) {
                    throw new Error(
                        'Trying to set not valid definition of typed property "' + propName + '" in attribute "$_properties" ' +
                        'in definition of class "' + this.getClass().getName() + '". Required property "type" was missed.'
                    );
                }
            }
        }
        return true;
    };

    /**
     * Sets "$_properties" attribute value
     *
     * @param {Object.<Object>} properties
     *
     *      List of the property definitions
     *
     *      Example: {
     *         propName1: { type: "string", value: "init value" },
     *         propName2: { type: "boolean" },
     *         ...
     *      }
     */
    ClassDefinition.prototype.setProperties = function(properties)
    {
        this.validateProperties(properties);
        this.getData().$_properties = properties || {};

        if (properties) {
            for (var propName in properties) {
                if (!properties.hasOwnProperty(propName)) {
                    continue;
                }
                this.getClass().addProperty(
                    propName,
                    properties[propName]
                );
            }
        }
    };

    /**
     * Return "$_properties" attribute value
     *
     * @returns {Object.<Object>}
     */
    ClassDefinition.prototype.getProperties = function()
    {
        return this.getData().$_properties;
    };

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
     * Returns all class properties (except typed properties from "$_properties"
     * attribute and other properties which names started from symbols "$_") that are not methods
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
     *      noMethods - Returns all class properties (except typed properties from "$_properties"
     *      attribute and other properties which names started from symbols "$_") that are not methods
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
            throw new Error('Trying to get not existent class definition part data "' + typeName + '".');
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
             * @type {ClassType}
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
             * List of class typed properties
             *
             * @type {Object}
             */
            $_properties: {},

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
            },

            /**
             * Checks if property is typed
             *
             * @param {string} propertyName
             * @returns {boolean}
             */
            issetProperty: function(propertyName)
            {
                return this.$_class.issetProperty(propertyName);
            },

            /**
             * Returns property api object
             *
             * @param {string} propertyName
             * @returns {Subclass.Property.PropertyAPI}
             */
            getProperty: function(propertyName)
            {
                return this.$_class.getProperty(propertyName).getAPI(this);
            }
        };
    };

    /**
     * Validates class definition
     *
     * @returns {boolean}
     * @throws {Error}
     */
    ClassDefinition.prototype.validateData = function ()
    {
        var definition = this.getData();
        var classInst = this.getClass();

        for (var propName in definition) {
            if (!definition.hasOwnProperty(propName)) {
                continue;
            }
            if (!Subclass.Property.PropertyManager.isPropertyNameAllowed(propName)) {
                throw new Error(
                    'Trying to define property with not allowed name "' + propName + '" ' +
                    'in class "' + classInst.getName() + '".'
                );
            }
        }
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

        // Extending accessors

        this.processPropertyAccessors();
    };

    /**
     * Extends class constructor with specific methods.
     *
     * If getter or setter of any typed property was redefined in the class definition
     * the new methods will generated. For setter it's gonna be "<setterOrGetterName>Default"
     * where "<setterOrGetterName>" is name of redefined setter or getter name.
     *
     * These methods allows to interact with private properties through redefined getters and setters.
     *
     * @returns {Function}
     */
    ClassDefinition.prototype.processPropertyAccessors = function()
    {
        var classProperties = this.getClass().getProperties();
        var classDefinition = this.getData();

        for (var propertyName in classProperties) {
            if (!classProperties.hasOwnProperty(propertyName)) {
                continue;
            }
            var property = classProperties[propertyName];

            if (!property.getPropertyDefinition().isAccessors()) {
                continue;
            }
            var accessors = {
                Getter: Subclass.Tools.generateGetterName(propertyName),
                Setter: Subclass.Tools.generateSetterName(propertyName)
            };

            for (var accessorType in accessors) {
                if (!accessors.hasOwnProperty(accessorType)) {
                    continue;
                }
                var accessorName = accessors[accessorType];

                if (classDefinition[accessorName]) {
                    classDefinition[accessorName + "Default"] = property['generate' + accessorType]();
                }
            }
        }
    };

    ClassDefinition.prototype.processRelatives = function()
    {
        var classInst = this.getClass();
        var classManager = classInst.getClassManager();
        var propertyManager = classManager.getModule().getPropertyManager();
        var customTypesManager = propertyManager.getCustomTypesManager();

        var requires = this.getRequires();
        var properties = this.getProperties();
        var parentClass = this.getExtends();

        // Performing $_requires attribute

        if (requires && this.validateRequires(requires)) {
            if (Subclass.Tools.isPlainObject(requires)) {
                for (var alias in requires) {
                    if (requires.hasOwnProperty(alias)) {
                        classManager.addToLoadStack(requires[alias]);
                    }
                }
            } else if (Array.isArray(requires)) {
                for (var i = 0; i < requires.length; i++) {
                    classManager.addToLoadStack(requires[i]);
                }
            }
        }

        // Performing $_extends attribute

        if (parentClass && this.validateExtends(parentClass)) {
            classManager.addToLoadStack(parentClass);
        }

        // Performing $_properties attribute

        if (properties && this.validateProperties(properties)) {
            for (var propName in properties) {
                if (!properties.hasOwnProperty(propName)) {
                    continue;
                }
                var propertyDefinition = properties[propName];

                if (typeof propertyDefinition != 'object') {
                    continue;
                }
                var propertyTypeName = propertyDefinition.type;

                if (customTypesManager.issetType(propertyTypeName)) {
                    var customTypeDefinition = Subclass.Tools.copy(customTypesManager.getTypeDefinition(propertyTypeName));
                    propertyTypeName = customTypeDefinition.type;

                    propertyDefinition = Subclass.Tools.extendDeep(customTypeDefinition, propertyDefinition);
                    propertyDefinition.type = propertyTypeName;
                }
                var propertyType = Subclass.Property.PropertyManager.getPropertyType(propertyDefinition.type);

                if (!propertyType.parseRelatives) {
                    continue;
                }
                var requiredClasses = propertyType.parseRelatives(propertyDefinition);

                if (requiredClasses && requiredClasses.length) {
                    for (i = 0; i < requiredClasses.length; i++) {
                        classManager.addToLoadStack(requiredClasses[i]);
                    }
                }
            }
        }
    };

    /**
     * Throws error if specified attribute value is invalid
     *
     * @param {string} attributeName
     * @param {string} types
     * @private
     */
    ClassDefinition.prototype._throwInvalidAttribute = function(attributeName, types)
    {
        throw new Error(
            'Invalid value of attribute "' + attributeName + '" ' +
            'in definition of class ' + this.getClass().getName() + '. ' +
            'It must be ' + types + '.'
        );
    };

    return ClassDefinition;

})();