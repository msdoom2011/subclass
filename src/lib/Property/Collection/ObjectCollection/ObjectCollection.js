/**
 * @class
 * @extends {Subclass.Property.Collection.Collection}
 */
Subclass.Property.Collection.ObjectCollection.ObjectCollection = (function()
{
    /**
     * @param {CollectionType} property
     * @param {Object} context
     * @constructor
     */
    function ObjectCollection(property, context)
    {
        ObjectCollection.$parent.call(this, property, context);
    }

    ObjectCollection.$parent = Subclass.Property.Collection.Collection;

    /**
     * @inheritDoc
     *
     * @returns {Subclass.Property.Collection.ObjectCollection.ObjectCollection}
     */
    ObjectCollection.prototype.normalizeItem = function(itemName)
    {
        var item = this._itemsProto[itemName].getValue(this._items, true);

        if (this.getProperty().getProto().constructor.getPropertyTypeName() != 'map') {
            return item;
        }
        if (!item.extends) {
            return item;
        }
        if (!this.issetItem(item.extends)) {
            throw new Error(
                'Trying to extend object collection element "' + itemName + '" ' +
                'by non existent another collection element with key "' + item.extends + '".'
            );
        }
        var parentItem = Subclass.Tools.copy(this.normalizeItem(item.extends));
        item.extends = null;

        for (var propName in item) {
            if (!item.hasOwnProperty(propName)) {
                continue;
            }
            var itemChild = this._itemsProto[itemName].getChild(propName);
            var itemChildContext = this._items[itemName];

            if (itemChild.isDefaultValue(itemChildContext)) {
                delete item[propName];
            }
        }

        item = Subclass.Tools.extendDeep(parentItem, item);
        this.setItem(itemName, item);

        return item;
    };


    return ObjectCollection;

})();