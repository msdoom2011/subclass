/**
 * @class
 * @extends {Subclass.PropertyManager.PropertyTypes.PropertyDefinition}
 */
Subclass.PropertyManager.PropertyTypes.EnumDefinition = (function()
{
    /**
     * @param {PropertyType} property
     * @param {Object} propertyDefinition
     * @constructor
     */
    function EnumDefinition (property, propertyDefinition)
    {
        EnumDefinition.$parent.call(this, property, propertyDefinition);
    }

    EnumDefinition.$parent = Subclass.PropertyManager.PropertyTypes.PropertyDefinition;

    /**
     * @inheritDoc
     */
    EnumDefinition.prototype.getEmptyValue = function()
    {
        return this.getAllows()[0];
    };

    /**
     * @inheritDoc
     */
    EnumDefinition.prototype.validateValue = function(value)
    {
        if (EnumDefinition.$parent.prototype.validateValue.call(this, value)) {
            return;
        }

        var allows = this.getAllows();

        if (allows.indexOf(value) < 0) {
            var message = 'The value of the property ' + this.getProperty() + ' is not valid ' +
                'and must be one of the specified values [' + allows.join(", ") + ']. ';

            if (value && typeof value == 'object' && value.$_className) {
                message += 'Instance of class "' + value.$_className + '" was received instead.';

            } else if (value && typeof value == 'object') {
                message += 'Object with type "' + value.constructor.name + '" was received instead.';

            } else if (value === null) {
                message += 'null value was received instead.';

            } else {
                message += 'Value with type "' + (typeof value) + '" was received instead.';
            }
            throw new Error(message);
        }
    };

    /**
     * Validates "allows" attribute value
     *
     * @param {*} allows
     */
    EnumDefinition.prototype.validateAllows = function(allows)
    {
        if (!allows) {
            throw new Error('Missed "allows" parameter in definition ' +
                'of enum property ' + this.getProperty() + ".");
        }
        if (!Array.isArray(allows) || !allows.length) {
            throw new Error('Specified not valid "allows" parameter in definition ' +
                'of property ' + this.getProperty() + '. ' +
                'It must be a not empty array with items of a certain types: "string", "number", "boolean".');
        }

        var allowedTypes = ['string', 'number', 'boolean'];

        for (var i = 0; i < allows.length; i++) {
            if (allowedTypes.indexOf(typeof allows[i]) < 0) {
                throw new Error('Specified not valid values in "allows" parameter in definition ' +
                    'of property ' + this.getProperty() + '. ' +
                    'Allowed types are: ' + allowedTypes.join(", ") + '".');
            }
        }
    };

    /**
     * Sets "allows" attribute of property definition
     *
     * @param {Array} allows
     */
    EnumDefinition.prototype.setAllows = function(allows)
    {
        this.validateAllows(allows);
        this.getDefinition().allows = allows;
    };

    /**
     * Returns value of "allows" attribute of property definition
     *
     * @returns {Array}
     */
    EnumDefinition.prototype.getAllows = function()
    {
        return this.getDefinition().allows;
    };

    /**
     * @inheritDoc
     */
    EnumDefinition.prototype.getRequiredAttributes = function()
    {
        var attrs = EnumDefinition.$parent.prototype.getRequiredAttributes.call(this);

        return attrs.concat(['allows']);
    };

    /**
     * @inheritDoc
     */
    EnumDefinition.prototype.getBaseDefinition = function()
    {
        var basePropertyDefinition = EnumDefinition.$parent.prototype.getBaseDefinition.call(this);

        /**
         * Allows to specify allowed property values.
         * Every value in array must belongs to one of the types: "number", "string", "boolean"
         *
         * @type {Array}
         */
        basePropertyDefinition.allows = null;
        basePropertyDefinition.nullable = false;

        return basePropertyDefinition;
    };

    return EnumDefinition;

})();
