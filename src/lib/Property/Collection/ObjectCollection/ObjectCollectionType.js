/**
 * @class
 * @extends {Subclass.PropertyManager.PropertyTypes.CollectionType}
 */
Subclass.PropertyManager.PropertyTypes.ObjectCollection = (function()
{
    /*************************************************/
    /*   Describing property type "ObjectCollection" */
    /*************************************************/

    /**
     * @param {PropertyManager} propertyManager
     * @param {string} propertyName
     * @param {Object} propertyDefinition
     * @param {ClassType} contextClass
     * @extends {PropertyType}
     * @constructor
     */
    function ObjectCollectionType(propertyManager, propertyName, propertyDefinition, contextClass)
    {
        ObjectCollectionType.$parent.call(
            this,
            propertyManager,
            propertyName,
            propertyDefinition,
            contextClass
        );
    }

    ObjectCollectionType.$parent = Subclass.PropertyManager.PropertyTypes.CollectionType;

    /**
     * @inheritDoc
     */
    ObjectCollectionType.getPropertyTypeName = function()
    {
        return "objectCollection";
    };

    /**
     * @inheritDoc
     */
    ObjectCollectionType.isAllowedValue = function(value)
    {
        return Subclass.Tools.isPlainObject(value);
    };

    /**
     * @inheritDoc
     */
    ObjectCollectionType.prototype.getPropertyDefinitionClass = function()
    {
        return Subclass.PropertyManager.PropertyTypes.ObjectCollectionDefinition;
    };

    /**
     * @inheritDoc
     */
    ObjectCollectionType.prototype.getCollectionClass = function()
    {
        return Subclass.PropertyManager.PropertyTypes.ObjectCollection.Collection;
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.PropertyManager.registerPropertyType(ObjectCollectionType);

    return ObjectCollectionType;

})();