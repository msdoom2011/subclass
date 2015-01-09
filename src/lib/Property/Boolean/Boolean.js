/**
 * @namespace
 */
Subclass.Property.Boolean = {};

/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Boolean.Boolean = (function()
{
    /*************************************************/
    /*      Describing property type "Boolean"       */
    /*************************************************/

    /**
     * @param {Subclass.Property.PropertyManager} propertyManager
     * @param {string} propertyName
     * @param {Object} propertyDefinition
     * @constructor
     */
    function BooleanType(propertyManager, propertyName, propertyDefinition)
    {
        BooleanType.$parent.call(
            this,
            propertyManager,
            propertyName,
            propertyDefinition
        );
    }

    BooleanType.$parent = Subclass.Property.PropertyType;

    /**
     * @inheritDoc
     */
    BooleanType.getPropertyTypeName = function()
    {
        return "boolean";
    };

    /**
     * @inheritDoc
     */
    BooleanType.isAllowedValue = function(value)
    {
        return typeof value == 'boolean';
    };

    /**
     * @inheritDoc
     */
    BooleanType.getDefinitionClass = function()
    {
        return Subclass.Property.Boolean.BooleanDefinition;
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(BooleanType);

    return BooleanType;

})();