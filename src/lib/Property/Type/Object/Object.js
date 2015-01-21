/**
 * @namespace
 */
Subclass.Property.Object = {};

/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Object.Object = (function()
{
    /*************************************************/
    /*      Describing property type "Object"        */
    /*************************************************/

    /**
     * @param {Subclass.Property.PropertyManager} propertyManager
     * @param {string} propertyName
     * @param {Object} propertyDefinition
     * @extends {PropertyType}
     * @constructor
     */
    function ObjectType(propertyManager, propertyName, propertyDefinition)
    {
        ObjectType.$parent.call(
            this,
            propertyManager,
            propertyName,
            propertyDefinition
        );
    }

    ObjectType.$parent = Subclass.Property.PropertyType;

    /**
     * @inheritDoc
     */
    ObjectType.getPropertyTypeName = function()
    {
        return "object";
    };

    /**
     * @inheritDoc
     */
    ObjectType.isAllowedValue = function(value)
    {
        return Subclass.Tools.isPlainObject(value);
    };

    /**
     * @inheritDoc
     */
    ObjectType.getDefinitionClass = function()
    {
        return Subclass.Property.Object.ObjectDefinition;
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(ObjectType);

    return ObjectType;

})();