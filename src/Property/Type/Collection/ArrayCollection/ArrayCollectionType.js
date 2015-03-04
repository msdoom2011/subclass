/**
 * @namespace
 */
Subclass.Property.Type.Collection.ArrayCollection = {};

/**
 * @class
 * @extends {Subclass.Property.Type.Collection.CollectionType}
 */
Subclass.Property.Type.Collection.ArrayCollection.ArrayCollection = (function()
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

    ArrayCollectionType.$parent = Subclass.Property.Type.Collection.CollectionType;

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
    ArrayCollectionType.parseRelatedClasses = function(propertyDefinition)
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
    ArrayCollectionType.getDefinitionClass = function()
    {
        return Subclass.Property.Type.Collection.ArrayCollection.ArrayCollectionDefinition;
    };


    /**
     * @inheritDoc
     */
    ArrayCollectionType.getEmptyDefinition = function()
    {
        return this.$parent.getEmptyDefinition();
    };

    /**
     * @inheritDoc
     */
    ArrayCollectionType.normalizeDefinition = function(definition)
    {
        return this.$parent.normalizeDefinition(definition);
    };

    /**
     * @inheritDoc
     */
    ArrayCollectionType.prototype.getCollectionClass = function()
    {
        return Subclass.Property.Type.Collection.ArrayCollection.ArrayCollection;
    };

    /**
     * @inheritDoc
     */
    ArrayCollectionType.prototype.alterCollection = function()
    {
        Object.defineProperty(this._collection, 'length', {
            enumerable: false,
            get: this._collection.getLength,
            set: function() {}
        });
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
            collectionItems[itemName] = collection.getItemData(itemName);
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