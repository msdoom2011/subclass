/**
 * @class
 * @extends {Subclass.Property.PropertyDefinition}
 */
Subclass.Property.Type.Untyped.UntypedDefinition = (function()
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

    UntypedDefinition.$parent = Subclass.Property.PropertyDefinition;

    /**
     * @inheritDoc
     */
    UntypedDefinition.prototype.getEmptyValue = function()
    {
        return null;
    };

    return UntypedDefinition;

})();
