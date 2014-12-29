/**
 * @class
 */
Subclass.ClassManager.ClassTypes.ClassDefinition = (function()
{
    function ClassDefinition (classInst, classDefinition)
    {
        if (!classInst || !(classInst instanceof Subclass.ClassManager.ClassTypes.ClassTypeInterface)) {

            console.log(classInst);

            throw new Error(
                'Invalid argument "classInst" in constructor ' +
                'of "Subclass.ClassManager.ClassTypes.ClassDefinition" class.' +
                'It must be an instance of "Subclass.ClassManager.ClassTypes.ClassTypeInterface".'
            );
        }
        if (!classDefinition || typeof classDefinition != 'object') {
            throw new Error(
                'Invalid argument "classDefinition" in constructor ' +
                'of "Subclass.ClassManager.ClassTypes.ClassDefinition" class.' +
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
        this._definition = classDefinition;
    }

    ClassDefinition.$parent = null;

    /**
     * Returns class definition object
     *
     * @returns {Object}
     */
    ClassDefinition.prototype.getDefinition = function()
    {
        return this._definition;
    };

    /**
     * Sets class definitino data
     *
     * @param definition
     */
    ClassDefinition.prototype.setDefinition = function(definition)
    {
        if (!definition || typeof definition != 'object') {
            throw new Error('Invalid argument "definition" in method "setDefinition". It must be an object.');
        }
        this._definition = definition;
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
     * @throws {Error}
     */
    ClassDefinition.prototype.validateRequires = function(requires)
    {
        if (requires && typeof requires != 'object') {
            this._throwInvalidAttribute('$_requires', 'a plain object with string properties.');
        }
        if (requires) {
            for (var alias in requires) {
                if (!requires.hasOwnProperty(alias)) {
                    continue;
                }
                if (!alias[0].match(/[a-z$_]/i)) {
                    throw new Error(
                        'Invalid alias name for required class "' + requires[alias] + '" ' +
                        'in class "' + this.getClass().getClassName() + '".'
                    );
                }
            }
        }
    };

    /**
     * Sets "$_requires" attribute value
     *
     * @param {Object.<string>} requires
     *
     *      List of the classes that current one requires.
     *
     *      Example: {
     *         classAlias1: "Namespace/Of/Class1",
     *         classAlias2: "Namespace/Of/Class2",
     *         ...
     *      }
     */
    ClassDefinition.prototype.setRequires = function(requires)
    {
        this.validateRequires(requires);
        this.getDefinition().$_requires = requires || {};
    };

    /**
     * Return "$_requires" attribute value
     *
     * @returns {Object.<string>}
     */
    ClassDefinition.prototype.getRequires = function()
    {
        return this.getDefinition().$_requires;
    };

    /**
     * Validates "$_extends" attribute value
     *
     * @param {*} parentClassName
     * @throws {Error}
     */
    ClassDefinition.prototype.validateExtends = function(parentClassName)
    {
        if (parentClassName !== null && typeof parentClassName != 'string') {
            this._throwInvalidAttribute('$_requires', 'a string or null.');
        }
    };

    /**
     * Sets "$_extends" attribute value
     *
     * @param {string} parentClassName  Name of parent class, i.e. "Namespace/Of/ParentClass"
     */
    ClassDefinition.prototype.setExtends = function(parentClassName)
    {
        this.validateExtends(parentClassName);
        this.getDefinition().$_extends = parentClassName;

        if (parentClassName) {
            this.getClass().setClassParent(parentClassName);
        }
    };

    /**
     * Returns "$_extends" attribute value
     *
     * @returns {string}
     */
    ClassDefinition.prototype.getExtends = function()
    {
        return this.getDefinition().$_extends;
    };

    /**
     * Validates "$_properties" attribute value
     *
     * @param {*} properties
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
                if (!Subclass.ClassManager.isClassPropertyNameAllowed(propName)) {
                    throw Error(
                        'Specified not allowed property name "' + propName + '" in attribute "$_properties"' +
                        'in definition of class "' + this.getClass().getClassName() + '".'
                    );
                }
                if (!properties[propName] || !Subclass.Tools.isPlainObject(properties[propName])) {
                    this._throwInvalidAttribute('$_properties', 'a plain object with not empty property definitions');
                }
            }
        }
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
        this.getDefinition().$_properties = properties || {};

        if (properties) {
            for (var propName in properties) {
                if (!properties.hasOwnProperty(propName)) {
                    continue;
                }
                this.getClass().addClassProperty(
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
        return this.getDefinition().$_properties;
    };

    /**
     * Modifies class definition
     *
     * @returns {object}
     */
    ClassDefinition.prototype.getBaseDefinition = function()
    {
        return {

            /**
             * @type {string} Class name
             */
            $_className: null,

            /**
             * @type {ClassType} Class definition closure
             */
            $_class: null,

            /**
             * @type {(string[]|null)} Required classes
             * @TODO needed for auto load classes in further implementation
             */
            $_requires: {},

            /**
             * @type {string} Parent class name
             */
            $_extends: null,

            /**
             * @type {Object} List of class typed properties
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
             * Returns type name of class
             *
             * @returns {*}
             */
            getClassType: function()
            {
                return this.constructor.name;
            },

            /**
             * Returns class manager instance
             *
             * @returns {ClassManager}
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
                if (!this.$_class.getClassParent()) {
                    return null;
                }
                return this.$_class
                    .getClassParent()
                    .getClassConstructor()
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
             * Validates type of parameter and setts default value if it's undefined
             *
             * @param {string} paramType
             * @param {*} paramValue
             * @param {*} [defaultValue]
             * @returns {*}
             */
            param: function (paramType, paramValue, defaultValue)
            {
                if (typeof paramValue == 'undefined') {
                    paramValue = defaultValue;
                }
                //if (typeof paramValue != paramType && paramValue !== null) {
                //    throw new Error("Trying to set not valid value of type '" + (typeof paramValue) + "'. '" + paramType + "' is expected.");
                //}

                return paramValue;
            },

            /**
             * Checks if property is typed
             *
             * @param {string} propertyName
             * @returns {boolean}
             */
            issetProperty: function(propertyName)
            {
                return this.$_class.issetClassProperty(propertyName);
            },

            /**
             * Returns property api object
             *
             * @param {string} propertyName
             * @returns {Subclass.PropertyManager.PropertyTypes.PropertyAPI}
             */
            getProperty: function(propertyName)
            {
                return this.$_class.getClassProperty(propertyName).getAPI(this);
            }
        };
    };

    /**
     * Validates class definition
     *
     * @throws {Error}
     */
    ClassDefinition.prototype.validateDefinition = function ()
    {
        var classDefinition = this.getDefinition();

        for (var propName in classDefinition) {
            if (!classDefinition.hasOwnProperty(propName)) {
                continue;
            }
            if (!Subclass.ClassManager.isClassPropertyNameAllowed(propName)) {
                throw new Error(
                    'Trying to define property with not allowed name "' + propName + '" ' +
                    'in class "' + this.getClass().getClassName() + '".'
                );
            }
        }
    };

    /**
     * Processes class definition. Getting info from classDefinition.
     */
    ClassDefinition.prototype.processDefinition = function ()
    {
        var definition = this.getDefinition();

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

        this.processClassPropertyAccessors();
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
    ClassDefinition.prototype.processClassPropertyAccessors = function()
    {
        var classProperties = this.getClass().getClassProperties();
        var classDefinition = this.getDefinition();

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
            'in definition of class ' + this.getClass().getClassName() + '. ' +
            'It must be ' + types + '.'
        );
    };

    return ClassDefinition;

})();