/**
 * @class
 */
Subclass.Property.Collection.Collection = (function()
{
    /**
     * @param {CollectionType} property
     * @param {Object} context
     * @constructor
     */
    function Collection(property, context)
    {
        if (!property) {
            throw new Error('Missed argument "property" in collection constructor.');
        }
        if (!context || typeof context != 'object') {
            throw new Error(
                'Invalid context of collection property ' + property + '. ' +
                'It must be an object.'
            );
        }

        /**
         * Property instance
         *
         * @type {Subclass.Property.Collection.CollectionType}
         * @private
         */
        this._property = property;

        /**
         * Collection property context
         *
         * @type {Object}
         * @private
         */
        this._context = context;

        /**
         * Instance of collection manager
         *
         * @type {Subclass.Property.Collection.CollectionManager}
         * @private
         */
        this._manager = new Subclass.Property.Collection.CollectionManager(this);
    }

    /**
     * Returns collection property instance to which current collection belongs to.
     *
     * @returns {CollectionType|*}
     */
    Collection.prototype.getProperty = function()
    {
        return this._property;
    };

    /**
     * Returns context object
     *
     * @returns {Object}
     */
    Collection.prototype.getContext = function()
    {
        return this._context;
    };

    /**
     * Returns instance of collection manager
     *
     * @returns {Subclass.Property.Collection.CollectionManager}
     */
    Collection.prototype.getManager = function()
    {
        return this._manager;
    };

    /**
     * Returns clear data of collection item
     *
     * @param key
     * @returns {*|PropertyType}
     */
    Collection.prototype.getItemData = function(key)
    {
        var manager = this.getManager();

        return manager.getItemProp(key).getValue(
            manager.getItems(),
            true
        );
    };

    /**
     * Adds new item to collection
     *
     * @param {(string|number)} key
     * @param {*} value
     * @param {boolean} [normalize=true]
     */
    Collection.prototype.addItem = function(key, value, normalize)
    {
        if (this.issetItem(key)) {
            console.warn(
                'Trying to add already existent collection item with key "' + key + '" ' +
                'to property ' + this.getProperty() + '.'
            );
            return;
        }
        if (normalize !== false) {
            normalize = true;
        }
        this.getManager().createItem(key, value);

        if (normalize) {
            this.normalizeItem(key);
        }
    };

    /**
     * Adds new items to collection
     *
     * @param {Object} items
     */
    Collection.prototype.addItems = function(items)
    {
        if (!Subclass.Tools.isPlainObject(items)) {
            throw new Error('Trying to set not object value to property ' + this.getProperty() + '.');
        }
        for (var key in items) {
            if (items.hasOwnProperty(key)) {
                this.addItem(key, items[key], false);
            }
        }
        this.normalizeItems();
    };

    /**
     * Sets collection item. If item with specified key already exists, it will be replaced.
     *
     * @param {(string|number)} key
     * @param {*} value
     * @param {boolean} [normalize=true]
     */
    Collection.prototype.setItem = function(key, value, normalize)
    {
        if (normalize !== false) {
            normalize = true;
        }
        if (this.issetItem(key)) {
            this.getManager().getItems()[key] = value;

        } else {
            this.getManager().createItem(key, value);
        }
        if (normalize) {
            this.normalizeItem(key);
        }
    };

    /**
     * Sets collection items. If items with specified keys already exist, they will be replaced.
     *
     * @param items
     */
    Collection.prototype.setItems = function(items)
    {
        if (!Subclass.Tools.isPlainObject(items)) {
            throw new Error('Trying to set not object value to property ' + this.getProperty() + '.');
        }
        for (var key in items) {
            if (items.hasOwnProperty(key)) {
                this.setItem(key, items[key], false);
            }
        }
        this.normalizeItems();
    };

    /**
     * Returns collection item with specified key
     *
     * @param {(string|number)} key
     * @returns {*}
     */
    Collection.prototype.getItem = function(key)
    {
        if (!this.issetItem(key)) {
            throw new Error(
                'Trying to get non existent collection item with key "' + key + '" ' +
                'in property ' + this.getProperty() + '.'
            );
        }
        return this.getManager().getItems()[key];
    };

    /**
     * Removes item with specified key from collection
     *
     * @param {(string|number)} key
     */
    Collection.prototype.removeItem = function(key)
    {
        var value = this.getItemData(key);
        var manager = this.getManager();

        delete manager.getItems()[key];
        delete manager.getItemProps()[key];

        return value;
    };

    /**
     * Removes all items from collection
     */
    Collection.prototype.removeItems = function()
    {
        var manager = this.getManager();

        manager.setItems(Object.create(Object.getPrototypeOf(manager.getItems())));
        manager.setItemProps(Object.create(Object.getPrototypeOf(manager.getItemProps())));
    };

    /**
     * Checks if item with specified key is existent.
     *
     * @param {(string|number)} key
     * @returns {boolean}
     */
    Collection.prototype.issetItem = function(key)
    {
        return !!this.getManager().getItems().hasOwnProperty(key);
    };

    /**
     * Sorts out all collection items using passed callback function
     *
     * @param callback
     */
    Collection.prototype.eachItem = function(callback)
    {
        if (typeof callback != 'function') {
            throw new Error('Invalid callback argument in method "Collection.eachItem". It must be a function.');
        }
        var items = this.getManager().getItems();

        for (var key in items) {
            if (!items.hasOwnProperty(key) || key.match(/^_(.+)[0-9]+$/i)) {
                continue;
            }
            if (callback(items[key], key) === false) {
                break;
            }
        }
    };

    /**
     * Searches item in collection by the value or by the result of test function
     *
     * @param {(function|*)} value If value will passed then searching
     *      will compare specified value with value of every collection item
     *      until match is not successful.
     *
     *      If function will passed then every collection item value will
     *      tests by this testing function until it not returns true.
     *
     * @returns {boolean}
     */
    Collection.prototype.indexOf = function(value)
    {
        var testCallback = typeof value == 'function' ? value : false;
        var key = false;

        this.eachItem(function(itemValue, itemKey) {
            if ((
                    testCallback
                    && testCallback(itemValue, itemKey) === true
                ) || (
                    !testCallback
                    && value == itemValue
                )
            ) {
                key = itemKey;
                return false;
            }
        });

        return key;
    };

    /**
     * Filters collection using passed callback function
     *
     * @param testCallback
     * @returns {(Array|Object)}
     */
    Collection.prototype.filter = function(testCallback)
    {
        if (!testCallback || typeof testCallback !== 'function') {
            throw new Error('Argument "testCallback" must be a function.');
        }
        var items = Object.create(Object.getPrototypeOf(this.getManager().getItems()));

        this.eachItem(function(itemValue, itemKey) {
            if (testCallback(itemValue, itemKey) === true) {
                items[itemKey] = itemValue;
            }
        });

        return items;
    };

    /**
     * Normalizes collection elements
     */
    Collection.prototype.normalizeItems = function()
    {
        var $this = this;

        this.eachItem(function(item, itemName) {
            $this.normalizeItem(itemName);
        });
    };

    /**
     * Normalizes specified collection item
     *
     * @param itemName
     * @returns {*}
     */
    Collection.prototype.normalizeItem = function(itemName)
    {
        // Do something

        return this.getItem(itemName);
    };

    /**
     * Returns length of collection
     *
     * @returns {Number}
     */
    Collection.prototype.getLength = function()
    {
        return Object.keys(this.getManager().getItems()).length;
    };

    /**
    * Returns collection value
    *
    * @returns {(Object)}
    */
    Collection.prototype.getData = function()
    {
        return this.getProperty().getValue(this.getContext(), true);
    };

    return Collection;

})();