/**
 * @class
 * @extends {Subclass.Property.PropertyDefinition}
 */
Subclass.Property.Type.Object.ObjectDefinition = (function()
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
            Subclass.Error.create('InvalidPropertyValue')
                .property(this.getProperty())
                .received(value)
                .expected('a plain object')
                .apply()
            ;
        }
    };

    return ObjectDefinition;

})();
