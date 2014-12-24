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

    return ArrayDefinition;

})();
