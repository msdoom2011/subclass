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
        return this.$parent.getEmptyDefinition.call(this);
    };

    /**
     * @inheritDoc
     */
    UntypedType.normalizeDefinition = function(definition)
    {
        return this.$parent.normalizeDefinition.call(this, definition);
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(UntypedType);

    return UntypedType;

})();