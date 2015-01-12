/**
 * @class
 * @extends {Subclass.Property.Collection.Collection}
 */
Subclass.Property.Collection.ObjectCollection.ObjectCollection = (function()
{
    /**
     * @param {CollectionType} property
     * @constructor
     */
    function ObjectCollection(property)
    {
        ObjectCollection.$parent.call(this, property);
    }

    ObjectCollection.$parent = Subclass.Property.Collection.Collection;

    /**
     * @inheritDoc
     */
    ObjectCollection.prototype.normalize = function()
    {
        var $this = this;

        this.eachItem(function(item, itemName) {
            $this.normalizeItem(itemName);
        });
    };

    /**
     * @inheritDoc
     *
     * @returns {Subclass.Property.Collection.ObjectCollection.ObjectCollection}
     */
    ObjectCollection.prototype.normalizeItem = function(itemName)
    {
        var item = this.getItem(itemName);

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
        var parentItem = Subclass.Tools.copy(this.normalize(item.extends));
        item.extends = null;

        item = Subclass.Tools.extendDeep(parentItem, item);
        this.setItem(itemName, item);

        return item;
    };


    return ObjectCollection;

})();