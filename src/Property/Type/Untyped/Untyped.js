/**
 * @namespace
 */
Subclass.Property.Type.Untyped = {};

/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Type.Untyped.Untyped = (function()
{
    /*************************************************/
    /*      Describing property type "Untyped"       */
    /*************************************************/

    /**
     * @param {Subclass.Property.PropertyManager} propertyManager
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
    UntypedType.getDefinitionClass = function()
    {
        return Subclass.Property.Type.Untyped.UntypedDefinition;
    };

    /**
     * @inheritDoc
     */
    UntypedType.getEmptyDefinition = function()
    {
        return Subclass.Property.PropertyType.getEmptyDefinition.call(this);
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(UntypedType);

    return UntypedType;

})();