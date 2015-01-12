/**
 * @interface
 */
Subclass.Property.PropertyTypeInterface = (function()
{
    /**
     * @param {Subclass.Property.PropertyManager} propertyManager
     * @param {string} propertyName
     * @param {Object} propertyDefinition
     * @constructor
     */
    function PropertyTypeInterface(propertyManager, propertyName, propertyDefinition)
    {
        // Do nothing
    }

    /**
     * Returns name of current property type
     *
     * @static
     * @returns {string}
     */
    PropertyTypeInterface.getPropertyTypeName = function() {};

    /**
     * Returns property definition constructor
     *
     * @returns {Function}
     */
    PropertyTypeInterface.getDefinitionClass = function() {};

    /**
     * Checks if specified value can be allowed by current property type
     *
     * @static
     * @returns {boolean}
     */
    PropertyTypeInterface.isAllowedValue = function(value) {};

    /**
     * Parses passed property definition and returns required classes to load
     *
     * @param {Object} propertyDefinition
     */
    PropertyTypeInterface.parseRequires = function(propertyDefinition) {};

    /**
     * Initializing property instance
     */
    PropertyTypeInterface.prototype.initialize = function() {};

    /**
     * Returns property manager instance
     *
     * @returns {Subclass.Property.PropertyManager}
     */
    PropertyTypeInterface.prototype.getPropertyManager = function() {};

    /**
     * Returns name of the chain of properties to which current property belongs to.
     *
     * @returns {string}
     */
    PropertyTypeInterface.prototype.getContextProperty = function() {};

    /**
     * Returns property clear name
     *
     * @returns {string}
     */
    PropertyTypeInterface.prototype.getName = function() {};

    /**
     * Returns property name with names of context property
     *
     * @returns {string}
     */
    PropertyTypeInterface.prototype.getNameFull = function() {};

    /**
     * Returns property hashed name
     *
     * @returns {*}
     */
    PropertyTypeInterface.prototype.getNameHashed = function() {};

    /**
     * Returns property definition instance
     *
     * @returns {Subclass.Property.PropertyDefinition}
     */
    PropertyTypeInterface.prototype.getDefinition = function() {};

    /**
     * Returns property api
     *
     * @param {Object} context
     * @returns {Subclass.Property.PropertyAPI}
     */
    PropertyTypeInterface.prototype.getAPI = function(context) {};

    /**
     * Setup marker if current property value was ever modified
     *
     * @param {boolean} isModified
     */
    PropertyTypeInterface.prototype.setIsModified = function(isModified) {};

    /**
     * Checks if current property value was ever modified
     *
     * @returns {boolean}
     */
    PropertyTypeInterface.prototype.isModified = function() {};

    /**
     * Sets property context class
     *
     * @param {(ClassType|null)} contextClass
     */
    PropertyTypeInterface.prototype.setContextClass = function(contextClass) {};

    /**
     * Returns context class instance to which current property belongs to
     *
     * @returns {(ClassType|null)}
     */
    PropertyTypeInterface.prototype.getContextClass = function() {};

    /**
     * Sets name of the chain of properties to which current property belongs to.
     *
     * @param {(PropertyType|null)} contextProperty
     */
    PropertyTypeInterface.prototype.setContextProperty = function(contextProperty) {};

    /**
     * Returns all registered watchers
     *
     * @returns {Function[]}
     */
    PropertyTypeInterface.prototype.getWatchers = function() {};

    /**
     * Adds new watcher
     *
     * @param {Function} callback Function, that takes two arguments:
     *      - newValue {*} New property value
     *      - oldValue {*} Old property value
     *
     *      "this" variable inside callback function will link to the class instance to which property belongs to
     *      This callback function MUST return newValue value.
     *      So you can modify it if you need.
     */
    PropertyTypeInterface.prototype.addWatcher = function(callback) {};

    /**
     * Checks if specified watcher callback is registered
     *
     * @param {Function} callback
     * @returns {boolean}
     */
    PropertyTypeInterface.prototype.issetWatcher = function(callback) {};

    /**
     * Removes specified watcher callback
     *
     * @param {Function} callback
     */
    PropertyTypeInterface.prototype.removeWatcher = function(callback) {};

    /**
     * Unbind all watchers from current property
     */
    PropertyTypeInterface.prototype.removeWatchers = function() {};

    /**
     * Invokes all registered watcher functions
     *
     * @param {Object} context
     * @param {*} newValue
     * @param {*} oldValue
     */
    PropertyTypeInterface.prototype.invokeWatchers = function(context, newValue, oldValue) {};

    /**
     * Validates property value. Throws error if value is invalid
     *
     * @param {*} value
     * @returns {boolean}
     * @throws {Error}
     */
    PropertyTypeInterface.prototype.validateValue = function(value) {};

    /**
     * Sets property value
     *
     * @param {Object} context
     * @param {*} value
     * @returns {*}
     */
    PropertyTypeInterface.prototype.setValue = function(context, value) {};

    /**
     * Returns value of current property
     *
     * @param {Object} context An object to which current property belongs to.
     */
    PropertyTypeInterface.prototype.getValue = function(context) {};

    /**
     * Returns property default value
     *
     * @returns {*}
     */
    PropertyTypeInterface.prototype.getDefaultValue = function() {};

    /**
     * Generates property getter function
     *
     * @returns {Function}
     */
    PropertyTypeInterface.prototype.generateGetter = function() {};

    /**
     * Generates setter for specified property
     *
     * @returns {function}
     */
    PropertyTypeInterface.prototype.generateSetter = function() {};

    /**
     * Attaches property to specified context
     *
     * @param {Object} context
     */
    PropertyTypeInterface.prototype.attach = function(context) {};

    /**
     * Attaches property accessor functions
     *
     * @param {Object} context
     */
    PropertyTypeInterface.prototype.attachAccessors = function(context) {};

    /**
     * Attaches property that will hold property value in class instance
     *
     * @param {Object} context
     */
    PropertyTypeInterface.prototype.attachHashed = function(context) {};

    /**
     * Checks if property contains empty value
     *
     * @returns {boolean}
     */
    PropertyTypeInterface.prototype.isEmpty = function(context) {};


    return PropertyTypeInterface;

})();