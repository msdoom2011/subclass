/**
 * @namespace
 */
Subclass.Property.String = {};

/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.String.String = (function()
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
    StringType.isAllowedValue = function(value)
    {
        return typeof value == 'string';
    };

    /**
     * @inheritDoc
     */
    StringType.getDefinitionClass = function()
    {
        return Subclass.Property.String.StringDefinition;
    };

    /**
     * @inheritDoc
     */
    StringType.getEmptyDefinition = function()
    {
        return Subclass.Property.PropertyType.getEmptyDefinition.call(this);
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(StringType);

    return StringType;

})();