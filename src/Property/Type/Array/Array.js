/**
 * @namespace
 */
Subclass.Property.Type.Array = {};

/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Type.Array.Array = (function()
{
    /*************************************************/
    /*       Describing property type "Array"        */
    /*************************************************/

    /**
     * @param {Subclass.Property.PropertyManager} propertyManager
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
    ArrayType.getDefinitionClass = function()
    {
        return Subclass.Property.Type.Array.ArrayDefinition;
    };

    /**
     * @inheritDoc
     */
    ArrayType.getEmptyDefinition = function()
    {
        return this.$parent.getEmptyDefinition.call(this);
    };

    /**
     * @inheritDoc
     */
    ArrayType.normalizeDefinition = function(definition)
    {
        return this.$parent.normalizeDefinition.call(this, definition);
    };

    /**
     * @inheritDoc
     */
    ArrayType.prototype.isEmpty = function(context)
    {
        var isNullable = this.getDefinition().isNullable();
        var value = this.getValue(context);

        return (isNullable && value === null) || (!isNullable && value.length === 0);
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(ArrayType);

    return ArrayType;

})();