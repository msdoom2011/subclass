/**
 * @class
 * @extends {Subclass.PropertyManager.PropertyTypes.PropertyType}
 */
Subclass.PropertyManager.PropertyTypes.Untyped = (function()
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

    UntypedType.$parent = Subclass.PropertyManager.PropertyTypes.PropertyType;

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
        return Subclass.PropertyManager.PropertyTypes.UntypedDefinition;
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.PropertyManager.registerPropertyType(UntypedType);

    return UntypedType;

})();