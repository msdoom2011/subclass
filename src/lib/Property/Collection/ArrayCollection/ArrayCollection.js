/**
 * @class
 * @extends {Subclass.Property.Collection.Collection}
 */
Subclass.Property.Collection.ArrayCollection.ArrayCollection = (function()
{
    /**
     * @param {CollectionType} property
     * @param {Object} context
     * @constructor
     */
    function ArrayCollection(property, context)
    {
        ArrayCollection.$parent.call(this, property, context);
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
        for (var key in items) {
            if (items.hasOwnProperty(key)) {
                this.addItem(items[key], false);
            }
        }
        this.normalizeItems();
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
     * Removes item with specified key from collection
     *
     * @param {(string|number)} key
     */
    ArrayCollection.prototype.removeItem = function(key)
    {
        key = parseInt(key);
        var $this = this;
        var value = false;

        this.eachItem(function(item, index) {
            if (index == key) {
                value = ArrayCollection.$parent.prototype.removeItem.call($this, key);
            }
            if (index > key) {
                var newName = String(index - 1);
                var context = $this._items;

                $this._itemsProto[index].rename(newName, context);
                $this._itemsProto[newName] = $this._itemsProto[index];
            }
        });

        return value;
    };

    /**
     * @inheritDoc
     */
    ArrayCollection.prototype.indexOf = function(value)
    {
        var key = ArrayCollection.$parent.prototype.indexOf.call(this, value);

        if (key === false) {
            return key;
        }
        return parseInt(key);
    };

    /**
     * Filters collection using passed callback function
     *
     * @param testCallback
     * @returns {(Array|Object)}
     */
    ArrayCollection.prototype.filter = function(testCallback)
    {
        if (!testCallback || typeof testCallback !== 'function') {
            throw new Error('Argument "testCallback" must be a function.');
        }
        var items = [];

        this.eachItem(function(itemValue, itemKey) {
            if (testCallback(itemValue, itemKey) === true) {
                items[itemKey] = itemValue;
            }
        });

        return items;
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

        var keysAll = Object.keys(this._items);
        var $this = this;
        var keys = [];

        keysAll.map(function(keyName) {
            if (keyName.match(/^[0-9]+$/i)) {
                keys.push(parseInt(keyName));
            }
        });
        keys.sort();

        keys.every(function(key) {
            if (callback.call($this, $this._items[key], key) === false) {
                return false;
            }
            return true;
        });
    };

    return ArrayCollection;

})();