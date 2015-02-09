/**
 * @class
 * @extends {Subclass.Property.Type.Collection.Collection}
 */
Subclass.Property.Type.Collection.ArrayCollection.ArrayCollection = (function()
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

    ArrayCollection.$parent = Subclass.Property.Type.Collection.Collection;

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
     * @alias Subclass.Property.Type.Collection.ArrayCollection#addItem
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
            Subclass.Error.create('InvalidArgument')
                .argument('the items for array collection in property ' + this.getProperty(), false)
                .received(items)
                .expected('an array')
                .apply()
            ;
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
            Subclass.Error.create('InvalidArgument')
                .argument('the index of array collection item', false)
                .received(key)
                .expected('a number')
                .apply()
            ;
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
            Subclass.Error.create(
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
                var itemProp = manager.getItemProp(index);

                itemProp.rename(newName, context);
                manager.getItemProps()[newName] = itemProp;
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
            Subclass.Error.create('InvalidArgument')
                .argument('the index of array collection item', false)
                .received(key)
                .expected('a number')
                .apply()
            ;
        }
        return !!this.getManager().getItems().hasOwnProperty(String(key));
    };

    /**
     * @inheritDoc
     */
    ArrayCollection.prototype.indexOf = function(value, reverse)
    {
        var key = ArrayCollection.$parent.prototype.indexOf.call(this, value, reverse);

        if (key === false) {
            return key;
        }
        return parseInt(key);
    };

    /**
     * Searches item from the end of collection
     *
     * @param {*} value
     * @returns {(number|boolean)}
     */
    ArrayCollection.prototype.lastIndexOf = function(value)
    {
        this.indexOf(value, true);
    };

    /**
     * Joins the elements of array collection into a string
     *
     * @param {string} separator
     * @returns {(*|string)}
     */
    ArrayCollection.prototype.join = function(separator)
    {
        var items = this.getData();

        return items.join.apply(items, arguments);
    };

    /**
     * Swaps collection items
     *
     * @param {number} index1
     * @param {number} index2
     */
    ArrayCollection.prototype.swapItems = function(index1, index2)
    {
        var extraIndex = this.getLength();
        var manager = this.getManager();
        var items = manager.getItems();
        var itemProps = manager.getItemProps();

        // Renaming item with index1 to extraIndex

        var itemProp1 = manager.getItemProp(index1);
        itemProp1.rename(String(extraIndex), items);
        itemProps[extraIndex] = itemProp1;

        // Renaming item with index2 to index1

        var itemProp2 = manager.getItemProp(index2);
        itemProp2.rename(String(index1), items);
        itemProps[index1] = itemProp2;

        // Renaming item with extraIndex to index2

        var itemPropExtra = manager.getItemProp(extraIndex);
        itemPropExtra.rename(String(index2), items);
        itemProps[index2] = itemPropExtra;

        // Removing collection item with extraIndex

        ArrayCollection.$parent.prototype.removeItem.call(this, extraIndex);
    };

    /**
     * Changes the order of array collection items to opposite
     */
    ArrayCollection.prototype.reverse = function()
    {
        var length = this.getLength();
        var lengthHalf = Math.ceil(length / 2);
        var $this = this;

        this.eachItem(function(item, index) {
            if (index >= lengthHalf) {
                return false;
            }
            var oppositeIndex = length - index - 1;
            $this.swapItems(index, oppositeIndex);
        });
    };

    /**
     * Sorts items
     *
     * @param {Function} compareFn
     */
    ArrayCollection.prototype.sort = function(compareFn)
    {
        var items = [];
        var itemsOrder = [];
        var orderedIndexes = [];

        this.eachItem(function(item, index) {
            items[index] = item;
            itemsOrder[index] = item;
        });

        items.sort.apply(items, arguments);

        for (var i = 0; i < items.length; i++) {
            var newIndex = i;
            var oldIndex = itemsOrder.indexOf(items[i]);

            if (
                orderedIndexes.indexOf(newIndex) >= 0
                || orderedIndexes.indexOf(oldIndex) >= 0
            ) {
                continue;
            }
            orderedIndexes.push(newIndex);
            orderedIndexes.push(oldIndex);
            this.swapItems(newIndex, oldIndex);
        }
    };

    /**
     * Selects a part of an array, and returns the new array
     *
     * @param {number} start
     * @param {number} end
     * @returns {Array}
     */
    ArrayCollection.prototype.slice = function(start, end)
    {
        var items = [];

        this.eachItem(function(item, index) {
            items[index] = item;
        });

        return items.slice.apply(items, arguments);
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
            Subclass.Error.create('InvalidArgument')
                .argument('the testing callback', false)
                .received(testCallback)
                .expected('a function')
                .apply()
            ;
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
            Subclass.Error.create('InvalidArgument')
                .argument('the callback', false)
                .received(callback)
                .expected('a function')
                .apply()
            ;
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