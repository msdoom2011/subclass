/**
 * @namespace
 */
Subclass.Property.Array = {};

/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Array.Array = (function()
{
    /*************************************************/
    /*       Describing property type "Array"        */
    /*************************************************/

    /**
     * @param {PropertyManager} propertyManager
     * @param {string} propertyName
     * @param {Object} propertyDefinition
     * @constructor
     */
    function ArrayType(propertyManager, propertyName, propertyDefinition)
    {
        ArrayType.$parent.call(
            this,
            propertyManager,
            propertyName,
            propertyDefinition
        );
    }

    ArrayType.$parent = Subclass.Property.PropertyType;

    /**
     * @inheritDoc
     */
    ArrayType.getPropertyTypeName = function()
    {
        return "array";
    };

    /**
     * @inheritDoc
     */
    ArrayType.isAllowedValue = function(value)
    {
        return Array.isArray(value);
    };

    /**
     * @inheritDoc
     */
    ArrayType.prototype.getPropertyDefinitionClass = function()
    {
        return Subclass.Property.Array.ArrayDefinition;
    };

    /**
     * @inheritDoc
     */
    ArrayType.prototype.isEmpty = function(context)
    {
        var isNullable = this.getPropertyDefinition().isNullable();
        var value = this.getValue(context);

        return (isNullable && value === null) || (!isNullable && value.length === 0);
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(ArrayType);

    return ArrayType;

})();