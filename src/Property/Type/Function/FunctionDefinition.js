/**
 * @class
 * @extends {Subclass.Property.PropertyDefinition}
 */
Subclass.Property.Type.Function.FunctionDefinition = (function()
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

    FunctionDefinition.$parent = Subclass.Property.PropertyDefinition;

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
        FunctionDefinition.$parent.prototype.validateValue.call(this, value);

        if (value && typeof value != 'function') {
            Subclass.Error.create('InvalidPropertyValue')
                .property(this.getProperty())
                .received(value)
                .expected("a function")
                .apply()
            ;
        }
        return true;
    };

    return FunctionDefinition;

})();
