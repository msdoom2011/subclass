/**
 * @class
 * @extends {Subclass.PropertyManager.PropertyTypes.PropertyType}
 */
Subclass.PropertyManager.PropertyTypes.Array = (function()
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

    ArrayType.$parent = Subclass.PropertyManager.PropertyTypes.PropertyType;

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
        return Subclass.PropertyManager.PropertyTypes.ArrayDefinition;
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

    Subclass.PropertyManager.registerPropertyType(ArrayType);

    return ArrayType;

})();