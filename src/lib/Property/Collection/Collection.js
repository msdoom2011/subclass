/**
 * @class
 */
Subclass.Property.Collection.Collection = (function()
{
    /**
     * @param {CollectionType} property
     * @constructor
     */
    function Collection(property)
    {
        if (!property) {
            throw new Error('Missed argument "property" in collection constructor.');
        }
        this._property = property;
        this._itemsProto = {};
        this._items = {};
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
     * Creates collection item
     *
     * @param key
     * @param value
     * @returns {*}
     */
    Collection.prototype._createItem = function(key, value)
    {
        var property = this.getProperty();
        var proto = property.getProto();
        var protoDefinition = Subclass.Tools.copy(proto.getDefinition().getData());

        this._itemsProto[key] = this.getProperty().getPropertyManager().createProperty(
            key, protoDefinition, property.getContextClass(), property
        );
        this._itemsProto[key].attach(this._items);
        this._items[key] = value;

        return this._items[key];
    };

    Collection.prototype._getItemValue = function(key)
    {
        if (!this.issetItem(key)) {
            throw new Error(
                'Trying to get non existent collection item with key "' + key + '" ' +
                'in property ' + this.getProperty() + '.'
            );
        }
        var value = this._items[key];

        if (Subclass.Tools.isPlainObject(value)) {
            var valueClear = {};

            for (var propName in value) {
                if (value.hasOwnProperty(propName) && !propName.match(/^_(.+)[0-9]+$/i)) {
                    valueClear[propName] = value[propName];
                }
            }

            return valueClear;
        }
        return value;
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

        this._createItem(key, value);

        //var property = this.getProperty();
        //var proto = property.getProto();
        //var protoDefinition = Subclass.Tools.copy(proto.getDefinition().getData());
        //    protoDefinition.value = value;
        //
        //this._itemsProto[key] = this.getProperty().getPropertyManager().createProperty(
        //    key, protoDefinition, property.getContextClass(), property
        //);
        //this._itemsProto[key].attach(this._items);

        //if (value !== undefined) {
        //    this.validateValue(value);
        //
        //} else {
        //    value = proto.getDefaultValue();
        //}
        //
        //if (proto instanceof Subclass.Property.Collection.CollectionType) {
        //    var protoCollectionClass = proto.getCollectionClass();
        //    var newValue = new protoCollectionClass(proto);
        //
        //    newValue.setItems(value);
        //    value = newValue;
        //}
        //
        //this._items[key] = value;


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
            this._items[key] = value;

        } else {
            this._createItem(key, value);
        }
        //this.validateValue(value);
        //this._items[key] = value;

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
        return this._items[key];
    };

    /**
     * Returns copy of all collection items.
     *
     * @returns {Object|Array}
     */
    Collection.prototype.getItems = function()
    {
        return Subclass.Tools.extend({}, this._items);
    };

    /**
     * Removes item with specified key from collection
     *
     * @param {(string|number)} key
     */
    Collection.prototype.removeItem = function(key)
    {
        delete this._items[key];
        delete this._itemsProto[key];
    };

    /**
     * Removes all items from collection
     */
    Collection.prototype.removeItems = function()
    {
        this._items = Object.create(Object.getPrototypeOf(this._items));
        this._itemsProto = Object.create(Object.getPrototypeOf(this._items));
    };

    /**
     * Checks if item with specified key is existent.
     *
     * @param {(string|number)} key
     * @returns {boolean}
     */
    Collection.prototype.issetItem = function(key)
    {
        return !!this._items.hasOwnProperty(key);
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
        for (var key in this._items) {
            if (!this._items.hasOwnProperty(key) || key.match(/^_(.+)[0-9]+$/i)) {
                continue;
            }
            if (callback(this._items[key], key) === false) {
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
        var items = Object.create(Object.getPrototypeOf(this._items));

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
        return Object.keys(this._items).length;
    };
    //
    ///**
    // * Validates collection item value
    // *
    // * @param {*} value
    // */
    //Collection.prototype.validateValue = function(value)
    //{
    //    this.getProperty().getProto().validateValue(value);
    //};

    /**
     * Returns collection value
     *
     * @returns {Object|Array}
     */
    Collection.prototype.valueOf = function()
    {
        return this.getItems();
    };

    return Collection;

})();