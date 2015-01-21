/**
 * @namespace
 */
Subclass.Property.Function = {};

/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Function.Function = (function()
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
    FunctionType.isAllowedValue = function(value)
    {
        return typeof value == 'function';
    };

    /**
     * @inheritDoc
     */
    FunctionType.getDefinitionClass = function()
    {
        return Subclass.Property.Function.FunctionDefinition;
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(FunctionType);

    return FunctionType;

})();