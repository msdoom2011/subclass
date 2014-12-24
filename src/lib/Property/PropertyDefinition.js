Subclass.PropertyManager.PropertyTypes.PropertyDefinition = (function()
{
    /**
     * @param {PropertyType} property
     * @param {Object} propertyDefinition
     * @constructor
     */
    function PropertyDefinition (property, propertyDefinition)
    {
        if (!propertyDefinition || typeof propertyDefinition != 'object') {
            throw new Error('Invalid argument "propertyDefinition" in constructor of "PropertyDefinition" class.' +
                'It must be a plain object');
        }
        /**
         * @type {PropertyType}
         * @private
         */
        this._property = property;

        /**
         * @type {Object}
         * @private
         */
        this._definition = propertyDefinition;
    }

    PropertyDefinition.$parent = null;

    /**
     * Returns property definition
     *
     * @returns {Object}
     */
    PropertyDefinition.prototype.getDefinition = function()
    {
        return this._definition;
    };

    /**
     * Returns property instance
     *
     * @returns {PropertyType}
     */
    PropertyDefinition.prototype.getProperty = function()
    {
        return this._property;
    };

    /**
     * Returns property type
     *
     * @returns {*}
     */
    PropertyDefinition.prototype.getType = function()
    {
        return this.getDefinition().type;
    };

    /**
     * Returns empty property value
     *
     * @return {(null|*)}
     */
    PropertyDefinition.prototype.getEmptyValue = function()
    {
        return null;
    };

    /**
     * Validates "value" attribute value
     *
     * @param {*} value
     */
    PropertyDefinition.prototype.validateValue = function(value)
    {
        try {
            this.getProperty().validate(value);

        } catch (e) {
            console.error("Error! Invalid default value!");
            throw e.stack;
        }
    };

    /**
     * Sets property default value
     */
    PropertyDefinition.prototype.setValue = function(value)
    {
        this.validateValue(value);
        this.getDefinition().value = value;
    };

    /**
     * Returns property default value
     *
     * @returns {*}
     */
    PropertyDefinition.prototype.getValue = function()
    {
        return this.getDefinition().value;
    };

    /**
     * Validates "watcher" attribute value
     *
     * @param {*} watcher
     */
    PropertyDefinition.prototype.validateWatcher = function(watcher)
    {
        if (watcher !== null || typeof watcher != 'function') {
            this._throwInvalidAttribute('watcher', 'a function or null');
        }
    };

    /**
     * Sets property watcher
     *
     * @param watcher
     */
    PropertyDefinition.prototype.setWatcher = function(watcher)
    {
        this.validateWatcher(watcher);
        this.getDefinition().watcher = watcher;
    };

    /**
     * Returns watcher function or null
     *
     * @returns {(Function|null)}
     */
    PropertyDefinition.prototype.getWatcher = function()
    {
        return this.getDefinition().watcher;
    };

    /**
     * Validates "accessors" attribute value
     *
     * @param {*} isAccessors
     */
    PropertyDefinition.prototype.validateAccessors = function(isAccessors)
    {
        if (isAccessors !== null || typeof isAccessors != 'boolean') {
            this._throwInvalidAttribute('accessors', 'a boolean or null');
        }
    };

    /**
     * Sets marker if needs to generate accessor methods for current property
     *
     * @param isAccessors
     */
    PropertyDefinition.prototype.setAccessors = function(isAccessors)
    {
        this.validateAccessors(isAccessors);
        this.getDefinition().accessors = isAccessors;
    };

    /**
     * Checks if there is a need in generation of property accessor methods
     *
     * @returns {(boolean|null)}
     */
    PropertyDefinition.prototype.isAccessors = function()
    {
        var isAccessors = this.getDefinition().accessors;

        return isAccessors !== null ? isAccessors : true;
    };

    /**
     * Validates "writable" attribute value
     *
     * @param {*} isWritable
     */
    PropertyDefinition.prototype.validateWritable = function(isWritable)
    {
        if (isWritable !== null || typeof isWritable != 'boolean') {
            this._throwInvalidAttribute('writable', 'a boolean or null');
        }
    };

    /**
     * Set marker if current property is writable
     *
     * @param {(boolean|null)} isWritable
     */
    PropertyDefinition.prototype.setWritable = function(isWritable)
    {
        this.validateWritable(isWritable);
        this.getDefinition().writable = isWritable;
    };

    /**
     * Checks if current property is writable
     *
     * @returns {boolean}
     */
    PropertyDefinition.prototype.isWritable = function()
    {
        var isWritable = this.getDefinition().writable;

        return isWritable !== null ? isWritable : true;
    };

    /**
     * Validates "nullable" attribute value
     *
     * @param {*} isNullable
     */
    PropertyDefinition.prototype.validateNullable = function(isNullable)
    {
        if (isNullable !== null || typeof isNullable != 'boolean') {
            this._throwInvalidAttribute('nullable', 'a boolean or null');
        }
    };

    /**
     * Sets "nullable" attribute value
     *
     * @param {(boolean|null)} isNullable
     */
    PropertyDefinition.prototype.setNullable = function(isNullable)
    {
        this.validateNullable(isNullable);
        this.getDefinition().nullable = isNullable;
    };

    /**
     * Checks if current property can store null value
     *
     * @returns {(boolean|null)}
     */
    PropertyDefinition.prototype.isNullable = function()
    {
        var isNullable = this.getDefinition().nullable;

        return isNullable !== null ? isNullable : true;
    };

    /**
     * Modifies class definition
     *
     * @returns {object}
     */
    PropertyDefinition.prototype.getBaseDefinition = function()
    {
        return {
            /**
             * @type {string}
             *
             * Type of property data
             */
            type: null,

            /**
             * @type {(*|null)}
             *
             * Default value of property
             */
            value: null,

            /**
             * @type {boolean}
             *
             * It's true if current parameter is changeable and vice-versa
             */
            writable: true,

            /**
             * @type {(function|null)}
             *
             * Callback that triggers when trying to set property value.
             * It takes two arguments: the new value and the old value of property.
             */
            watcher: null,

            /**
             * @type {(boolean|null)}
             *
             * Indicates that accessor functions would be generated
             */
            accessors: null,

            /**
             * @type {(boolean|null)}
             *
             * Indicates that current property can hold null value or not.
             * If null as a value of current parameter was specified it means that value of current
             * parameter will defined in accordance with the default settings of each property type.
             */
            nullable: null
        };
    };

    /**
     * Processing property definition
     */
    PropertyDefinition.prototype.processDefinition = function()
    {
        var baseDefinition = this.getBaseDefinition();
        var definition = this.getDefinition();
        var value = definition.value;

        this._definition = Subclass.Tools.extend(baseDefinition, definition);

        if (value === undefined) {
            this.setValue(this.getEmptyValue());
        }
    };

    /**
     * Validating property definition
     */
    PropertyDefinition.prototype.validateDefinition = function()
    {
        var definition = this.getDefinition();

        for (var attrName in definition) {
            if (!definition.hasOwnProperty(attrName)) {
                continue;
            }
            var validatorMethod = "validate" + attrName[0].toUpperCase() + attrName.substr(1);

            if (this[validatorMethod]) {
                this[validatorMethod](definition[attrName]);
            }
        }

        //var property = this.getProperty();
        //var propertyName = property.getPropertyNameFull();
        //var contextClass = property.getContextClass();

        //var accessors = this.isAccessors();
        //var writable = this.isWritable();
        //var watcher = this.getWatcher();
        //
        //// Validating accessors attribute value
        //
        //if (accessors !== null && typeof accessors != 'boolean') {
        //    throw new Error('Invalid value of attribute "accessors" in definition of property "' + propertyName + '"' +
        //    (contextClass && ' in class "' + contextClass.getClassName() + '"') + '. ' +
        //    'It must be a boolean or null.');
        //}
        //
        //// Validating watcher attribute value
        //
        //if (watcher !== null && typeof watcher != 'function') {
        //    throw new Error('Invalid value of attribute "watcher" in definition of property "' + propertyName + '"' +
        //    (contextClass && ' in class "' + contextClass.getClassName() + '"') + '. ' +
        //    'It must be a function or null.');
        //}
        //
        //// Validating writable attribute value
        //
        //if (typeof writable != 'boolean') {
        //    throw new Error('Invalid value of attribute "writable" in definition of property "' + propertyName + '"' +
        //    (contextClass && ' in class "' + contextClass.getClassName() + '"') + '. ' +
        //    'It must be a boolean.');
        //}
        //
        //try {
        //    property.validate(this.getDefaultValue());
        //
        //} catch (e) {
        //    console.error("Error! Invalid default value!");
        //    throw e.stack;
        //}
    };

    PropertyDefinition.prototype._throwInvalidAttribute = function(attributeName, types)
    {
        var property = this.getProperty();
        var propertyName = property.getPropertyNameFull();
        var contextClass = property.getContextClass();

        throw new Error('Invalid value of attribute "' + attributeName + '" in definition of property "' + propertyName + '"' +
            (contextClass && ' in class "' + contextClass.getClassName() + '"') + '. ' +
            'It must be ' + types + '.');
    };

    return PropertyDefinition;

})();
