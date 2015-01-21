/**
 * @class
 * @extends {Subclass.Property.PropertyDefinition}
 */
Subclass.Property.Boolean.BooleanDefinition = (function()
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

    BooleanDefinition.$parent = Subclass.Property.PropertyDefinition;

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
    BooleanDefinition.prototype.getBaseData = function()
    {
        var basePropertyDefinition = BooleanDefinition.$parent.prototype.getBaseData.call(this);
            basePropertyDefinition.nullable = false;

        return basePropertyDefinition;
    };

    /**
     * @inheritDoc
     */
    BooleanDefinition.prototype.validateValue = function(value)
    {
        BooleanDefinition.$parent.prototype.validateValue.call(this, value);

        if (value && typeof value != 'boolean') {
            throw new Subclass.Property.Error.InvalidValue(
                this.getProperty(),
                value,
                "a boolean"
            );
        }
        return true;
    };

    return BooleanDefinition;

})();
