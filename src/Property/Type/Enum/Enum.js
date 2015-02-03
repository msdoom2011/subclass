/**
 * @namespace
 */
Subclass.Property.Enum = {};

/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Enum.Enum = (function()
{
    /*************************************************/
    /*       Describing property type "Enum"         */
    /*************************************************/

    /**
     * @param {Subclass.Property.PropertyManager} propertyManager
     * @param {string} propertyName
     * @param {Object} propertyDefinition
     * @extends {PropertyType}
     * @constructor
     */
    function EnumType(propertyManager, propertyName, propertyDefinition)
    {
        EnumType.$parent.call(
            this,
            propertyManager,
            propertyName,
            propertyDefinition
        );
    }

    EnumType.$parent = Subclass.Property.PropertyType;

    /**
     * @inheritDoc
     */
    EnumType.getPropertyTypeName = function()
    {
        return "enum";
    };

    /**
     * @inheritDoc
     */
    EnumType.isAllowedValue = function(value)
    {
        return ['boolean', 'string', 'number'].indexOf(typeof value) >= 0;
    };

    /**
     * @inheritDoc
     */
    EnumType.getDefinitionClass = function()
    {
        return Subclass.Property.Enum.EnumDefinition;
    };

    /**
     * @inheritDoc
     */
    EnumType.getEmptyDefinition = function()
    {
        return false;
    };

    /**
     * @inheritDoc
     */
    EnumType.prototype.isEmpty = function(context)
    {
        return false;
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(EnumType);

    return EnumType;

})();