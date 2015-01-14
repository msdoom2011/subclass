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
     * @alias Subclass.Property.Collection.ArrayCollection#addItem
     */
    ArrayCollection.prototype.push = ArrayCollection.prototype.addItem;

    /**
     * Removes from array and returns the last item in collection
     *
     * @returns {(*|null)}
     */
    ArrayCollection.prototype.pop = function()
    {
        var length = this.getLength();

        if (!length) {
            return null;
        }
        return this.removeItem(length - 1);
    };

    /**
     * Removes from array and returns the first item in collection
     *
     * @returns {(*|null)}
     */
    ArrayCollection.prototype.shift = function()
    {
        var length = this.getLength();

        if (!length) {
            return null;
        }
        return this.removeItem(0);
    };

    /**
     * Adds new item to the start of array
     */
    ArrayCollection.prototype.unshift = function(value)
    {
        var manager = this.getManager();
        var $this = this;

        this.eachItem(true, function(item, index) {
            var newName = String(index + 1);
            var context = manager.getItems();
            var itemProto = manager.getItemProp(index);

            itemProto.rename(newName, context);
            manager.getItemProps()[newName] = itemProto;
        });

        this.setItem(0, value);
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

    ArrayCollection.prototype.setItem = function(key, value, normalize)
    {
        if (isNaN(parseInt(key))) {
            throw new Error('Array item index must be a number.');
        }
        return ArrayCollection.$parent.prototype.setItem.call(
            this, String(key), value, normalize
        );
    };

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
        return this.getManager().getItems()[index];
    };

    /**
     * Removes item with specified key from collection
     *
     * @param {(string|number)} key
     */
    ArrayCollection.prototype.removeItem = function(key)
    {
        key = parseInt(key);
        var manager = this.getManager();
        var $this = this;
        var value = false;

        this.eachItem(function(item, index) {
            if (index == key) {
                value = ArrayCollection.$parent.prototype.removeItem.call($this, key);
            }
            if (index > key) {
                var newName = String(index - 1);
                var context = manager.getItems();
                var itemProto = manager.getItemProp(index);

                itemProto.rename(newName, context);
                manager.getItemProps()[newName] = itemProto;
            }
        });

        return value;
    };

    /**
     * @inheritDoc
     */
    ArrayCollection.prototype.issetItem = function(key)
    {
        if (isNaN(parseInt(key))) {
            throw new Error('Array item index must be a number.');
        }
        return !!this.getManager().getItems().hasOwnProperty(String(key));
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
                items[parseInt(itemKey)] = itemValue;
            }
        });

        return items;
    };

    /**
     * Sorts out all collection items using passed callback function
     *
     * @param {boolean} [reverse]
     * @param {Function} callback
     */
    ArrayCollection.prototype.eachItem = function(reverse, callback)
    {
        if (typeof reverse == 'function') {
            callback = reverse;
        }
        if (typeof callback != 'function') {
            throw new Error(
                'Invalid callback argument in method "ArrayCollection#eachItem". ' +
                'It must be a function.'
            );
        }
        if (reverse !== true) {
            reverse = false;
        }

        var items = this.getManager().getItems();
        var keysAll = Object.keys(items);
        var $this = this;
        var keys = [];

        keysAll.map(function(keyName) {
            if (keyName.match(/^[0-9]+$/i)) {
                keys.push(parseInt(keyName));
            }
        });
        keys.sort();

        if (reverse) {
            keys.reverse();
        }

        keys.every(function(key) {
            if (callback.call($this, items[key], key) === false) {
                return false;
            }
            return true;
        });
    };

    /**
     * @inheritDoc
     */
    ArrayCollection.prototype.getLength = function()
    {
        var keys = Object.keys(this.getManager().getItems());
        var numericKeys = [];

        for (var i = 0; i < keys.length; i++) {
            var numKey = parseInt(keys[i]);

            if (!isNaN(numKey)) {
                numericKeys.push(numKey);
            }
        }
        if (!numericKeys.length) {
            return 0;
        }
        numericKeys.sort();

        return numericKeys[numericKeys.length - 1] + 1;
    };

    return ArrayCollection;

})();