/**
 * @class
 * @extends {Subclass.Property.Type.Collection.Collection}
 */
Subclass.Property.Type.Collection.ObjectCollection.ObjectCollection = (function()
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

    ObjectCollection.$parent = Subclass.Property.Type.Collection.Collection;

    /**
     * @inheritDoc
     *
     * @returns {Subclass.Property.Type.Collection.ObjectCollection.ObjectCollection}
     */
    ObjectCollection.prototype.normalizeItem = function(itemName)
    {
        var item = this.getItemData(itemName);
        var manager = this.getManager();

        if (this.getProperty().getProto().constructor.getPropertyTypeName() != 'map') {
            return item;
        }
        if (!item.extends) {
            return item;
        }
        if (!this.issetItem(item.extends)) {
            Subclass.Error.create(
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
            var itemChild = manager.getItemProp(itemName).getChild(propName);
            var itemChildContext = this.getItem(itemName);

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