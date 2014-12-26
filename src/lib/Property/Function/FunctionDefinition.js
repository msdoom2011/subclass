/**
 * @class
 * @extends {Subclass.PropertyManager.PropertyTypes.PropertyDefinition}
 */
Subclass.PropertyManager.PropertyTypes.FunctionDefinition = (function()
{
    /**
     * @param {PropertyType} property
     * @param {Object} propertyDefinition
     * @constructor
     */
    function FunctionDefinition (property, propertyDefinition)
    {
        FunctionDefinition.$parent.call(this, property, propertyDefinition);
    }

    FunctionDefinition.$parent = Subclass.PropertyManager.PropertyTypes.PropertyDefinition;

    /**
     * @inheritDoc
     */
    FunctionDefinition.prototype.getEmptyValue = function()
    {
        return this.isNullable() ? null : function() {};
    };

    /**
     * @inheritDoc
     */
    FunctionDefinition.prototype.validateValue = function(value)
    {
        if (FunctionDefinition.$parent.prototype.validateValue.call(this, value)) {
            return;
        }
        if (typeof value != 'function') {
            var message = 'The value of the property ' + this.getProperty() + ' must be a function. ';

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

    return FunctionDefinition;

})();
