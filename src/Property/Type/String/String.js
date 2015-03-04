/**
 * @namespace
 */
Subclass.Property.Type.String = {};

/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Type.String.String = (function()
{
    /*************************************************/
    /*      Describing property type "String"        */
    /*************************************************/

    /**
     * @param {Subclass.Property.PropertyManager} propertyManager
     * @param {string} propertyName
     * @param {Object} propertyDefinition
     * @extends {PropertyType}
     * @constructor
     */
    function StringType(propertyManager, propertyName, propertyDefinition)
    {
        StringType.$parent.call(
            this,
            propertyManager,
            propertyName,
            propertyDefinition
        );
    }

    StringType.$parent = Subclass.Property.PropertyType;

    /**
     * @inheritDoc
     */
    StringType.getPropertyTypeName = function()
    {
        return "string";
    };

    /**
     * @inheritDoc
     */
    StringType.getDefinitionClass = function()
    {
        return Subclass.Property.Type.String.StringDefinition;
    };

    /**
     * @inheritDoc
     */
    StringType.getEmptyDefinition = function()
    {
        return this.$parent.getEmptyDefinition.call(this);
    };

    /**
     * @inheritDoc
     */
    StringType.normalizeDefinition = function(definition)
    {
        return this.$parent.normalizeDefinition.call(this, definition);
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(StringType);

    return StringType;

})();