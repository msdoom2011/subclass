/**
 * @class
 * @extends {Subclass.PropertyManager.PropertyTypes.PropertyDefinition}
 */
Subclass.PropertyManager.PropertyTypes.UntypedDefinition = (function()
{
    /**
     * @param {PropertyType} property
     * @param {Object} propertyDefinition
     * @constructor
     */
    function UntypedDefinition (property, propertyDefinition)
    {
        UntypedDefinition.$parent.call(this, property, propertyDefinition);
    }

    UntypedDefinition.$parent = Subclass.PropertyManager.PropertyTypes.PropertyDefinition;

    /**
     * @inheritDoc
     */
    UntypedDefinition.prototype.getEmptyValue = function()
    {
        return null;
    };

    return UntypedDefinition;

})();
