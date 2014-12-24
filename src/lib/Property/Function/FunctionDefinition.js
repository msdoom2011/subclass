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

    return FunctionDefinition;

})();
