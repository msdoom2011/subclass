/**
 * @namespace
 */
Subclass.Property.Type.Function = {};

/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Type.Function.Function = (function()
{
    /*************************************************/
    /*      Describing property type "Function"      */
    /*************************************************/

    /**
     * @param {Subclass.Property.PropertyManager} propertyManager
     * @param {string} propertyName
     * @param {Object} propertyDefinition
     * @extends {PropertyType}
     * @constructor
     */
    function FunctionType(propertyManager, propertyName, propertyDefinition)
    {
        FunctionType.$parent.call(
            this,
            propertyManager,
            propertyName,
            propertyDefinition
        );
    }

    FunctionType.$parent = Subclass.Property.PropertyType;

    /**
     * @inheritDoc
     */
    FunctionType.getPropertyTypeName = function()
    {
        return "function";
    };

    /**
     * @inheritDoc
     */
    FunctionType.getDefinitionClass = function()
    {
        return Subclass.Property.Type.Function.FunctionDefinition;
    };

    /**
     * @inheritDoc
     */
    FunctionType.getEmptyDefinition = function()
    {
        return this.$parent.getEmptyDefinition.call(this);
    };

    /**
     * @inheritDoc
     */
    FunctionType.normalizeDefinition = function(definition)
    {
        return this.$parent.normalizeDefinition.call(this, definition);
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(FunctionType);

    return FunctionType;

})();