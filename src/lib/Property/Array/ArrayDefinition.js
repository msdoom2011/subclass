/**
 * @class
 * @extends {Subclass.PropertyManager.PropertyTypes.PropertyDefinition}
 */
Subclass.PropertyManager.PropertyTypes.ArrayDefinition = (function()
{
    /**
     * @param {PropertyType} property
     * @param {Object} propertyDefinition
     * @constructor
     */
    function ArrayDefinition (property, propertyDefinition)
    {
        ArrayDefinition.$parent.call(this, property, propertyDefinition);
    }

    ArrayDefinition.$parent = Subclass.PropertyManager.PropertyTypes.PropertyDefinition;

    /**
     * @inheritDoc
     */
    ArrayDefinition.prototype.getEmptyValue = function()
    {
        return this.isNullable() ? null : [];
    };

    /**
     * @inheritDoc
     */
    ArrayDefinition.prototype.validateValue = function(value)
    {
        if (ArrayDefinition.$parent.prototype.validateValue.call(this, value)) {
            return;
        }

        if (!Array.isArray(value)) {
            var message = 'The value of the property ' + this.getProperty() + ' must be an array. ';

            if (value && typeof value == 'object' && value.$_className) {
                message += 'Instance of class "' + value.$_className + '" was received instead.';

            } else if (value && typeof value == 'object') {
                message += 'Object with type "' + value.constructor.name + '" was received instead.';

            } else {
                message += 'Value with type "' + (typeof value) + '" was received instead.';
            }
            throw new Error(message);
        }
    };

    return ArrayDefinition;

})();
