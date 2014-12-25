/**
 * @class
 * @extends {Subclass.PropertyManager.PropertyTypes.PropertyDefinition}
 */
Subclass.PropertyManager.PropertyTypes.ObjectDefinition = (function()
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

    ObjectDefinition.$parent = Subclass.PropertyManager.PropertyTypes.PropertyDefinition;

    /**
     * @inheritDoc
     */
    ObjectDefinition.prototype.getEmptyValue = function()
    {
        return this.isNullable() ? null : {};
    };

    return ObjectDefinition;

})();
