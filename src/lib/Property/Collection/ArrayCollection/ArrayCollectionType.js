/**
 * @namespace
 */
Subclass.Property.Collection.ArrayCollection = {};

/**
 * @class
 * @extends {Subclass.Property.Collection.CollectionType}
 */
Subclass.Property.Collection.ArrayCollection.ArrayCollection = (function()
{
    /*************************************************/
    /*   Describing property type "ArrayCollection"  */
    /*************************************************/

    /**
     * @param {Subclass.Property.PropertyManager} propertyManager
     * @param {string} propertyName
     * @param {Object} propertyDefinition
     * @param {ClassType} contextClass
     * @extends {PropertyType}
     * @constructor
     */
    function ArrayCollectionType(propertyManager, propertyName, propertyDefinition, contextClass)
    {
        ArrayCollectionType.$parent.call(
            this,
            propertyManager,
            propertyName,
            propertyDefinition,
            contextClass
        );
    }

    ArrayCollectionType.$parent = Subclass.Property.Collection.CollectionType;

    /**
     * @inheritDoc
     */
    ArrayCollectionType.getPropertyTypeName = function()
    {
        return "arrayCollection";
    };

    /**
     * @inheritDoc
     */
    ArrayCollectionType.isAllowedValue = function(value)
    {
        return Array.isArray(value);
    };

    /**
     * @inheritDoc
     * @throws {Error}
     */
    ArrayCollectionType.parseRelatives = function(propertyDefinition)
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
    ArrayCollectionType.getDefinitionClass = function()
    {
        return Subclass.Property.Collection.ArrayCollection.ArrayCollectionDefinition;
    };

    /**
     * @inheritDoc
     */
    ArrayCollectionType.prototype.getCollectionClass = function()
    {
        return Subclass.Property.Collection.ArrayCollection.ArrayCollection;
    };

    /**
     * @inheritDoc
     */
    ArrayCollectionType.prototype.addCollectionItem = function(key, value)
    {
        this._collection.addItem(value, false);
    };

    /**
     * @inheritDoc
     */
    ArrayCollectionType.prototype.getValue = function(context, dataOnly)
    {
        var value = ArrayCollectionType.$parent.prototype.getValue.call(this, context, dataOnly);

        if (dataOnly !== true) {
            return value;
        }
        var collection = this.getCollection();
        var collectionItems = [];

        collection.eachItem(function(item, itemName) {
            collectionItems[itemName] = collection._itemsProto[itemName].getValue(collection._items, dataOnly);
        });

        return collectionItems;
    };

    /**
     * @inheritDoc
     */
    ArrayCollectionType.prototype.generateSetter = function()
    {
        var $this = this;

        return function(value) {
            $this.validateValue(value);
            $this.setIsModified(true);

            if (value !== null) {
                $this.setIsNull(false);

                for (var i = 0; i < value.length; i++) {
                    this[$this.getNameHashed()].addItem(value[i]);
                }

            } else {
                $this.setIsNull(true);
                $this.getCollection(this).removeItems();
            }
        };
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(ArrayCollectionType);

    return ArrayCollectionType;

})();