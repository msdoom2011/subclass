/**
 * @class
 */
Subclass.ClassManager.ClassTypes.ClassDefinition = (function()
{
    function ClassDefinition (classInst, classDefinition)
    {
        if (!classInst || !(classInst instanceof Subclass.ClassManager.ClassTypes.ClassTypeInterface)) {
            throw new Error('Invalid argument "classInst" in constructor ' +
                'of "Subclass.ClassManager.ClassTypes.ClassDefinition" class.' +
                'It must be an instance of "Subclass.ClassManager.ClassTypes.ClassTypeInterface".'
            );
        }
        if (!classDefinition || typeof classDefinition != 'object') {
            throw new Error('Invalid argument "classDefinition" in constructor ' +
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
        try {
            if (requires && typeof requires != 'object') {
                throw 'error';
            }
            for (var alias in requires) {
                if (!requires.hasOwnProperty(alias)) {
                    continue;
                }
                if (!alias[0].match(/[a-z$_]/i)) {
                    throw 'error';
                }
            }

        } catch (e) {
            this._throwInvalidAttribute('$_requires', 'a plain object with string properties.');
        }
    };

    /**
     * Sets "$_requires" attribute value
     *
     * @param {Object.<string>} requires
     *
     *      List of classes that current one requires.
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
        this.getDefinition().$_requires = requires;
    };

    /**
     * Sets "$_requires" attribute value
     *
     * @returns {Object.<string>}
     */
    ClassDefinition.prototype.getRequires = function()
    {
        return this.getDefinition().$_requires;
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
             * @type {string} Class type
             */
            $_classType: null,

            /**
             * @type {ClassType} Class definition closure
             */
            $_class: null,

            /**
             * @type {(string[]|null)} Required classes
             * @TODO needed for auto load classes in further implementation
             */
            $_requires: null,

            /**
             * @type {string} Parent class name
             */
            $_extends: null,

            /**
             * @type {Object} List of class typed properties
             */
            $_properties: {},

            /**
             * @type {Object} Static properties and methods for current class constructor
             */
            $_static: {},

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
             * Returns all static methods and properties
             *
             * @returns {Object}
             */
            getStatic: function()
            {
                return this.$_class.getStatic();
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
                // @TODO needs further implementation
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
     * Validates class
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
                    'in class "' + this.getClassName() + '".'
                );
            }
        }
    };

    /**
     * Processes class definition. Getting info from classDefinition.
     */
    ClassDefinition.prototype.processDefinition = function ()
    {
        var classDefinition = this.getDefinition();
        var classProperties = classDefinition.$_properties;
        var parentClassName = classDefinition.$_extends;

        if (classProperties && typeof classProperties == 'object') {
            for (var propName in classProperties) {
                if (!classProperties.hasOwnProperty(propName)) {
                    continue;
                }
                this.getClass().addClassProperty(
                    propName,
                    classProperties[propName]
                );
            }
        }
        if (parentClassName && typeof parentClassName == 'string') {
            this.getClass().setClassParent(parentClassName);
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
        throw new Error('Invalid value of attribute "' + attributeName + '" ' +
            'in definition of class ' + this.getClass().getClassName() + '. ' +
            'It must be ' + types + '.'
        );
    };

    return ClassDefinition;

})();