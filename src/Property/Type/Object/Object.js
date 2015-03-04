/**
 * @namespace
 */
Subclass.Property.Type.Object = {};

/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Type.Object.Object = (function()
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
    ObjectType.getDefinitionClass = function()
    {
        return Subclass.Property.Type.Object.ObjectDefinition;
    };

    /**
     * @inheritDoc
     */
    ObjectType.getEmptyDefinition = function()
    {
        return this.$parent.getEmptyDefinition.call(this);
    };

    /**
     * @inheritDoc
     */
    ObjectType.normalizeDefinition = function(definition)
    {
        return this.$parent.normalizeDefinition.call(this, definition);
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(ObjectType);

    return ObjectType;

})();