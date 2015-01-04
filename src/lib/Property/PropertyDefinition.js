/**
 * @class
 */
Subclass.Property.PropertyDefinition = (function()
{
    /**
     * @param {PropertyType} property
     * @param {Object} propertyDefinition
     * @constructor
     */
    function PropertyDefinition (property, propertyDefinition)
    {
        if (!property || !(property instanceof Subclass.Property.PropertyTypeInterface)) {
            throw new Error(
                'Invalid argument "property" in constructor ' +
                'of "Subclass.Property.PropertyDefinition" class.' +
                'It must be an instance of class "Subclass.Property.PropertyTypeInterface".'
            );
        }
        if (!propertyDefinition || typeof propertyDefinition != 'object') {
            throw new Error(
                'Invalid argument "propertyDefinition" in constructor ' +
                'of "Subclass.Property.PropertyDefinition" class.' +
                'It must be a plain object.'
            );
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
     * Returns empty property value
     *
     * @return {(null|*)}
     */
    PropertyDefinition.prototype.getEmptyValue = function()
    {
        return null;
    };

    /**
     * Validates "type" attribute value
     *
     * @param {*} type
     */
    PropertyDefinition.prototype.validateType = function(type)
    {
        if (typeof type != 'string') {
            this._throwInvalidAttribute('type', 'a string');
        }
    };

    /**
     * Sets "type" attribute value
     *
     * @param {string} type
     */
    PropertyDefinition.prototype.setType = function(type)
    {
        this.validateType(type);
        this.getDefinition().type = type;
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
     * Validates "value" attribute value
     *
     * @param {*} value
     */
    PropertyDefinition.prototype.validateValue = function(value)
    {
        return this.isNullable() && value === null;

        //try {
        //    this.getProperty().validate(value);
        //
        //} catch (e) {
        //    console.error("Error! Invalid default value!");
        //    throw e.stack;
        //}
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
        if (watcher !== null && typeof watcher != 'function') {
            this._throwInvalidAttribute('watcher', 'a function or null');
        }
    };

    /**
     * Sets property watcher
     *
     * @param {(Function|null)} watcher
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
        if (isAccessors !== null && typeof isAccessors != 'boolean') {
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
        if (isWritable !== null && typeof isWritable != 'boolean') {
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
        if (isNullable !== null && typeof isNullable != 'boolean') {
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
     * Returns attributes that are required to filling
     *
     * @returns {string[]}
     */
    PropertyDefinition.prototype.getRequiredAttributes = function()
    {
        return ["type"];
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
     * Validating property definition
     */
    PropertyDefinition.prototype.validateDefinition = function()
    {
        var requiredAttributes = this.getRequiredAttributes();
        var definition = this.getDefinition();

        for (var i = 0; i < requiredAttributes.length; i++) {
            var attrName = requiredAttributes[i];

            if (!definition.hasOwnProperty(attrName)) {
                this._throwMissedAttribute(attrName);
            }
        }
    };

    /**
     * Processing property definition
     */
    PropertyDefinition.prototype.processDefinition = function()
    {
        var definition = this.getDefinition();
        var emptyValue = !definition.hasOwnProperty('value');

        this._definition = this.getBaseDefinition();

        for (var attrName in definition) {
            if (!definition.hasOwnProperty(attrName) || attrName == 'value') {
                continue;
            }
            var setterMethod = "set" + attrName[0].toUpperCase() + attrName.substr(1);

            if (this[setterMethod]) {
                this[setterMethod](definition[attrName]);
            }
        }

        if (emptyValue) {
            this.setValue(this.getEmptyValue());

        } else {
            this.setValue(definition.value);
        }
    };

    /**
     * Throws error if specified argument was missed
     *
     * @param {string} attributeName
     * @throws {Error}
     * @private
     */
    PropertyDefinition.prototype._throwMissedAttribute = function(attributeName)
    {
        throw new Error(
            'Missed required attribute "' + attributeName + '" ' +
            'in definition of property ' + this.getProperty() + '.'
        );
    };

    /**
     * Throws error if specified attribute value is invalid
     *
     * @param {string} attributeName
     * @param {string} types
     * @private
     */
    PropertyDefinition.prototype._throwInvalidAttribute = function(attributeName, types)
    {
        throw new Error(
            'Invalid value of attribute "' + attributeName + '" ' +
            'in definition of property ' + this.getProperty() + '. ' +
            'It must be ' + types + '.'
        );
    };

    return PropertyDefinition;

})();
