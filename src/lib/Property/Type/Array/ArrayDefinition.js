/**
 * @class
 * @extends {Subclass.Property.PropertyDefinition}
 */
Subclass.Property.Array.ArrayDefinition = (function()
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

    ArrayDefinition.$parent = Subclass.Property.PropertyDefinition;

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
        ArrayDefinition.$parent.prototype.validateValue.call(this, value);

        if (value && !Array.isArray(value)) {
            Subclass.Property.Error.InvalidValue(
                this.getProperty(),
                value,
                "an array"
            );
        }
        return true;
    };

    return ArrayDefinition;

})();
