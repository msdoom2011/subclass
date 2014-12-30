/**
 * @class
 * @extends {Subclass.Property.PropertyDefinition}
 */
Subclass.Property.Object.ObjectDefinition = (function()
{
    /**
     * @param {PropertyType} property
     * @param {Object} propertyDefinition
     * @constructor
     */
    function ObjectDefinition (property, propertyDefinition)
    {
        ObjectDefinition.$parent.call(this, property, propertyDefinition);
    }

    ObjectDefinition.$parent = Subclass.Property.PropertyDefinition;

    /**
     * @inheritDoc
     */
    ObjectDefinition.prototype.getEmptyValue = function()
    {
        return this.isNullable() ? null : {};
    };

    /**
     * @inheritDoc
     */
    ObjectDefinition.prototype.validateValue = function(value)
    {
        if (ObjectDefinition.$parent.prototype.validateValue.call(this, value)) {
            return;
        }
        if (value !== null && (typeof value != 'object' || !Subclass.Tools.isPlainObject(value))) {
            var message = 'The value of the property ' + this.getProperty() + ' must be a plain object. ';

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

    return ObjectDefinition;

})();
