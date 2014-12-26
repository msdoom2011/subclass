/**
 * @class
 * @extends {Subclass.PropertyManager.PropertyTypes.PropertyType}
 */
Subclass.PropertyManager.PropertyTypes.Function = (function()
{
    /*************************************************/
    /*      Describing property type "Function"      */
    /*************************************************/

    /**
     * @param {PropertyManager} propertyManager
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

    FunctionType.$parent = Subclass.PropertyManager.PropertyTypes.PropertyType;

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
    FunctionType.prototype.getPropertyDefinitionClass = function()
    {
        return Subclass.PropertyManager.PropertyTypes.FunctionDefinition;
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.PropertyManager.registerPropertyType(FunctionType);

    return FunctionType;

})();