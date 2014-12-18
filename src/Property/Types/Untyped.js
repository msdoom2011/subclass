; ClassManager.PropertyManager.PropertyTypes.Untyped = (function()
{
    /*************************************************/
    /*      Describing property type "Untyped"       */
    /*************************************************/

    /**
     * @param {PropertyManager} propertyManager
     * @param {string} propertyName
     * @param {Object} propertyDefinition
     * @extends {PropertyType}
     * @constructor
     */
    function UntypedType(propertyManager, propertyName, propertyDefinition)
    {
        UntypedType.$parent.call(
            this,
            propertyManager,
            propertyName,
            propertyDefinition
        );
    }

    UntypedType.$parent = ClassManager.PropertyManager.PropertyTypes.PropertyType;

    /**
     * @inheritDoc
     */
    UntypedType.getPropertyTypeName = function()
    {
        return "untyped";
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    ClassManager.PropertyManager.registerPropertyType(UntypedType);

    return UntypedType;

})();