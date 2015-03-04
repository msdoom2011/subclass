/**
 * @namespace
 */
Subclass.Property.Type.Number = {};

/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Type.Number.Number = (function()
{
    /*************************************************/
    /*      Describing property type "Number"        */
    /*************************************************/

    /**
     * @param {Subclass.Property.PropertyManager} propertyManager
     * @param {string} propertyName
     * @param {Object} propertyDefinition
     * @extends {PropertyType}
     * @constructor
     */
    function NumberType(propertyManager, propertyName, propertyDefinition)
    {
        NumberType.$parent.call(
            this,
            propertyManager,
            propertyName,
            propertyDefinition
        );
    }

    NumberType.$parent = Subclass.Property.PropertyType;

    /**
     * @inheritDoc
     */
    NumberType.getPropertyTypeName = function()
    {
        return "number";
    };

    /**
     * @inheritDoc
     */
    NumberType.getDefinitionClass = function()
    {
        return Subclass.Property.Type.Number.NumberDefinition;
    };

    /**
     * @inheritDoc
     */
    NumberType.getEmptyDefinition = function()
    {
        return this.$parent.getEmptyDefinition.call(this);
    };

    /**
     * @inheritDoc
     */
    NumberType.normalizeDefinition = function(definition)
    {
        return this.$parent.normalizeDefinition.call(this, definition);
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(NumberType);

    return NumberType;

})();