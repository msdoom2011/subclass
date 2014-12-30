/**
 * @namespace
 */
Subclass.Property.Untyped = {};

/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Untyped.Untyped = (function()
{
    /*************************************************/
    /*      Describing property type "Untyped"       */
    /*************************************************/

    /**
     * @param {PropertyManager} propertyManager
     * @param {string} propertyName
     * @param {Object} propertyDefinition
     * @extends {PropertyType}
     * @constructor
     */
    function UntypedType(propertyManager, propertyName, propertyDefinition)
    {
        UntypedType.$parent.call(
            this,
            propertyManager,
            propertyName,
            propertyDefinition
        );
    }

    UntypedType.$parent = Subclass.Property.PropertyType;

    /**
     * @inheritDoc
     */
    UntypedType.getPropertyTypeName = function()
    {
        return "untyped";
    };

    /**
     * @inheritDoc
     */
    UntypedType.isAllowedValue = function(value)
    {
        return true;
    };

    /**
     * @inheritDoc
     */
    UntypedType.prototype.getPropertyDefinitionClass = function()
    {
        return Subclass.Property.Untyped.UntypedDefinition;
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(UntypedType);

    return UntypedType;

})();