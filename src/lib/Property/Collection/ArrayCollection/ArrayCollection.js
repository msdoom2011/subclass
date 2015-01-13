/**
 * @class
 * @extends {Subclass.Property.Collection.Collection}
 */
Subclass.Property.Collection.ArrayCollection.ArrayCollection = (function()
{
    /**
     * @param {CollectionType} property
     * @constructor
     */
    function ArrayCollection(property)
    {
        ArrayCollection.$parent.call(this, property);
    }

    ArrayCollection.$parent = Subclass.Property.Collection.Collection;

    /**
     * @inheritDoc
     * @param {*} value
     */
    ArrayCollection.prototype.addItem = function(value)
    {
        return ArrayCollection.$parent.prototype.addItem.call(
            this, String(this.getLength()), value, false
        );
    };

    /**
    * @inheritDoc
    * @param {Array} items
    */
    ArrayCollection.prototype.addItems = function(items)
    {
        if (!Array.isArray(items)) {
            throw new Error('Trying to set not array value to property ' + this.getProperty() + '.');
        }
        var itemsNew = {};

        for (var i = 0; i < items.length; i++) {
            itemsNew[String(i)] = items[i];
        }

        return ArrayCollection.$parent.prototype.addItems.call(this, itemsNew);
    };

    /**
    * @inheritDoc
    * @param {Array} items
    */
    ArrayCollection.prototype.setItems = ArrayCollection.prototype.addItems;

    /**
     * @inheritDoc
     * @param {number} index
     */
    ArrayCollection.prototype.getItem = function(index)
    {
        if (!this.issetItem(index)) {
            throw new Error(
                'Trying to get non existent array element with index "' + index + '" ' +
                'in property ' + this.getProperty() + '.'
            );
        }
        return this._items[index];
    };

    /**
     * Sorts out all collection items using passed callback function
     *
     * @param callback
     */
    ArrayCollection.prototype.eachItem = function(callback)
    {
        if (typeof callback != 'function') {
            throw new Error('Invalid callback argument in method "ArrayCollection#eachItem". It must be a function.');
        }
        for (var key in this._items) {
            if (!this._items.hasOwnProperty(key) || !key.match(/^[0-9]+$/i)) {
                continue;
            }
            if (callback(this._items[key], parseInt(key)) === false) {
                break;
            }
        }
    };

    return ArrayCollection;

})();