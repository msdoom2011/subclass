/**
 * @class
 * @extends {Subclass.PropertyManager.PropertyTypes.PropertyDefinition}
 */
Subclass.PropertyManager.PropertyTypes.BooleanDefinition = (function()
{
    /**
     * @param {PropertyType} property
     * @param {Object} propertyDefinition
     * @constructor
     */
    function BooleanDefinition (property, propertyDefinition)
    {
        BooleanDefinition.$parent.call(this, property, propertyDefinition);
    }

    BooleanDefinition.$parent = Subclass.PropertyManager.PropertyTypes.PropertyDefinition;

    /**
     * @inheritDoc
     */
    BooleanDefinition.prototype.getEmptyValue = function()
    {
        return this.isNullable() ? null : false;
    };

    /**
     * @inheritDoc
     */
    BooleanDefinition.prototype.validateValue = function(value)
    {
        if (BooleanDefinition.$parent.prototype.validateValue.call(this, value)) {
            return;
        }

        if (typeof value != 'boolean') {
            var message = 'The value of the property ' + this.getProperty() + ' must be a boolean. ';

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

    return BooleanDefinition;

})();
