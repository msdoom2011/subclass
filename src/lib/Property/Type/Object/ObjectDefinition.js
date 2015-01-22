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
        ObjectDefinition.$parent.prototype.validateValue.call(this, value);

        if (value && !Subclass.Tools.isPlainObject(value)) {
            Subclass.Property.Error.InvalidValue(
                this.getProperty(),
                value,
                'a plain object'
            );
        }
    };

    return ObjectDefinition;

})();
