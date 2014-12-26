/**
 * @class
 * @extends {Subclass.PropertyManager.PropertyTypes.PropertyType}
 */
Subclass.PropertyManager.PropertyTypes.Number = (function()
{
    /*************************************************/
    /*      Describing property type "Number"        */
    /*************************************************/

    /**
     * @param {PropertyManager} propertyManager
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

    NumberType.$parent = Subclass.PropertyManager.PropertyTypes.PropertyType;

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
    NumberType.isAllowedValue = function(value)
    {
        return typeof value == 'number';
    };

    /**
     * @inheritDoc
     */
    NumberType.prototype.getPropertyDefinitionClass = function()
    {
        return Subclass.PropertyManager.PropertyTypes.NumberDefinition;
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.PropertyManager.registerPropertyType(NumberType);

    return NumberType;

})();