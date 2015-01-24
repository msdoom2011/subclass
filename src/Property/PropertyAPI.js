/**
 * @class
 */
Subclass.Property.PropertyAPI = (function()
{
    /**
     * @param {PropertyType} property
     * @param {Object} context
     * @constructor
     */
    function PropertyAPI (property, context)
    {
        /**
         * @type {PropertyType}
         * @private
         */
        this._property = property;

        /**
         * @type {Object}
         * @private
         */
        this._context = context;
    }

    /**
     * Returns property instance
     *
     * @returns {Subclass.Property.PropertyType}
     */
    PropertyAPI.prototype.getProperty = function()
    {
        return this._property;
    };

    /**
     * Returns property name
     *
     * @returns {string}
     */
    PropertyAPI.prototype.getName = function()
    {
        return this._property.getName();
    };

    /**
     * Tries to rename property
     *
     * @param {string} newName
     */
    PropertyAPI.prototype.rename = function(newName)
    {
        return this._property.rename(newName, this._context);
    };

    /**
     * Sets class typed property
     *
     * @param {*} value
     * @returns {PropertyType}
     */
    PropertyAPI.prototype.setValue = function(value)
    {
        return this._property.setValue(this._context, value);
    };

    /**
     * Returns class typed property
     *
     * @returns {PropertyType}
     */
    PropertyAPI.prototype.getValue = function(dataOnly)
    {
        return this._property.getValue(this._context, dataOnly);
    };

    /**
     * Checks if specified value is valid for interesting property
     *
     * @param {*} value
     * @returns {boolean}
     */
    PropertyAPI.prototype.isValueValid = function(value)
    {
        try {
            this._property.validateValue(value);
            return true;

        } catch (e) {
            return false;
        }
    };

    /**
     * Sets default value of typed class property
     *
     * @returns {*}
     */
    PropertyAPI.prototype.setDefaultValue = function(value)
    {
        return this._property.setDefaultValue(this._context, value);
    };

    /**
     * Returns default value of typed class property
     *
     * @returns {*}
     */
    PropertyAPI.prototype.getDefaultValue = function()
    {
        return this._property.getDefaultValue();
    };

    /**
     * Checks whether property value is equals default and is not modified
     *
     * @returns {*}
     */
    PropertyAPI.prototype.isDefaultValue = function()
    {
        return this._property.isDefaultValue(this._context);
    };

    /**
     * Checks if property is empty
     *
     * @returns {boolean}
     */
    PropertyAPI.prototype.isEmpty = function()
    {
        return this._property.isEmpty(this._context);
    };

    /**
     * Checks if property value was ever changed
     *
     * @returns {boolean}
     */
    PropertyAPI.prototype.isModified = function()
    {
        return this._property.isModified();
    };

    /**
     * Marks property as modified
     */
    PropertyAPI.prototype.setModified = function()
    {
        this._property.setIsModified(true);
    };

    /**
     * Marks property as not modified
     */
    PropertyAPI.prototype.setUnModified = function()
    {
        return this._property.setIsModified(false);
    };

    /**
     * Returns all registered watchers
     *
     * @returns {Function[]}
     */
    PropertyAPI.prototype.getWatchers = function()
    {
        return this._property._watchers;
    };

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
    PropertyAPI.prototype.addWatcher = function(callback)
    {
        return this._property.addWatcher(callback);
    };

    /**
     * Checks if specified watcher callback is registered
     *
     * @param {Function} callback
     * @returns {boolean}
     */
    PropertyAPI.prototype.issetWatcher = function(callback)
    {
        return this._property.issetWatcher(callback);
    };

    /**
     * Removes specified watcher callback
     *
     * @param callback
     */
    PropertyAPI.prototype.removeWatcher = function(callback)
    {
        return this._property.removeWatcher(callback);
    };

    /**
     * Unbind all watchers from current property
     */
    PropertyAPI.prototype.removeWatchers = function()
    {
        return this._property.removeWatchers();
    };

    PropertyAPI.prototype.toString = function()
    {
        return this._property.toString();
    };

    return PropertyAPI;

})();