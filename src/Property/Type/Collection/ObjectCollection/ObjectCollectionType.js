/**
 * @namespace
 */
Subclass.Property.Type.Collection.ObjectCollection = {};

/**
 * @class
 * @extends {Subclass.Property.Type.Collection.CollectionType}
 */
Subclass.Property.Type.Collection.ObjectCollection.ObjectCollectionType = (function()
{
    /*************************************************/
    /*   Describing property type "ObjectCollection" */
    /*************************************************/

    /**
     * @param {Subclass.Property.PropertyManager} propertyManager
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

    ObjectCollectionType.$parent = Subclass.Property.Type.Collection.CollectionType;

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
    ObjectCollectionType.parseRelatedClasses = function(propertyDefinition)
    {
        if (
            !propertyDefinition.proto
            || typeof propertyDefinition.proto != 'object'
            || !propertyDefinition.proto.type
        ) {
            return;
        }
        var propDef = propertyDefinition.proto;
        var propertyType = Subclass.Property.PropertyManager.getPropertyType(propDef.type);

        if (!propertyType.parseRelatedClasses) {
            return;
        }
        return propertyType.parseRelatedClasses(propDef);
    };

    /**
     * @inheritDoc
     */
    ObjectCollectionType.getDefinitionClass = function()
    {
        return Subclass.Property.Type.Collection.ObjectCollection.ObjectCollectionDefinition;
    };

    /**
     * @inheritDoc
     */
    ObjectCollectionType.getEmptyDefinition = function()
    {
        return this.$parent.getEmptyDefinition();
    };

    /**
     * @inheritDoc
     */
    ObjectCollectionType.normalizeDefinition = function(definition)
    {
        return this.$parent.normalizeDefinition(definition);
    };

    /**
     * @inheritDoc
     */
    ObjectCollectionType.prototype.getCollectionClass = function()
    {
        return Subclass.Property.Type.Collection.ObjectCollection.ObjectCollection;
    };

    /**
     * @inheritDoc
     */
    ObjectCollectionType.prototype.addCollectionItem = function(key, value)
    {
        this._collection.addItem(key, value, false);
    };

    /**
     * @inheritDoc
     */
    ObjectCollectionType.prototype.getValue = function(context, dataOnly)
    {
        var value = ObjectCollectionType.$parent.prototype.getValue.call(this, context, dataOnly);

        if (dataOnly !== true) {
            return value;
        }
        var collection = this.getCollection();
        var collectionItems = {};

        collection.eachItem(function(item, itemName) {
            collectionItems[itemName] = collection.getItemData(itemName);
        });

        return collectionItems;
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(ObjectCollectionType);

    return ObjectCollectionType;

})();