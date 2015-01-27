/**
 * @namespace
 */
Subclass.Property.Collection.ObjectCollection = {};

/**
 * @class
 * @extends {Subclass.Property.Collection.CollectionType}
 */
Subclass.Property.Collection.ObjectCollection.ObjectCollectionType = (function()
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

    ObjectCollectionType.$parent = Subclass.Property.Collection.CollectionType;

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
    ObjectCollectionType.parseRelatives = function(propertyDefinition)
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

        if (!propertyType.parseRelatives) {
            return;
        }
        return propertyType.parseRelatives(propDef);
    };

    /**
     * @inheritDoc
     */
    ObjectCollectionType.getDefinitionClass = function()
    {
        return Subclass.Property.Collection.ObjectCollection.ObjectCollectionDefinition;
    };

    /**
     * @inheritDoc
     */
    ObjectCollectionType.prototype.getCollectionClass = function()
    {
        return Subclass.Property.Collection.ObjectCollection.ObjectCollection;
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