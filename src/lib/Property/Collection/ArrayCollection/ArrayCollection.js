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

        //this._items = [];
    }

    ArrayCollection.$parent = Subclass.Property.Collection.Collection;

    /**
     * @inheritDoc
     * @param {*} value
     */
    ArrayCollection.prototype.addItem = function(value)
    {
        var length = this.getLength();

        ArrayCollection.$parent.prototype.addItem.call(this, String(length), value, false);

        //var proto = this.getProperty().getProto();
        //
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
        //this._items.push(value);
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

        return ArrayCollection.$parent.prototype.addItems.call(this, items);
    };

    ///**
    // * @inheritDoc
    // * @param {number} index
    // * @param {*} value
    // */
    //ArrayCollection.prototype.setItem = function(index, value)
    //{
    //    if (typeof index != 'number') {
    //        throw new Error('Trying to set array element with not valid index "' + index + '" ' +
    //            'in property ' + this.getProperty() + '.');
    //    }
    //    this.validateValue(value);
    //    this._items[index] = value;
    //};

    /**
    * @inheritDoc
    * @param {Array} items
    */
    ArrayCollection.prototype.setItems = ArrayCollection.prototype.addItems;

    //{
    //    if (!Array.isArray(items)) {
    //        throw new Error('Trying to set not array value to property ' + this.getProperty() + '.');
    //    }
    //    var itemsNew = {};
    //
    //    for (var i = 0; i < items.length; i++) {
    //        itemsNew[String(i)] = items[i];
    //    }
    //
    //    ArrayCollection.$parent.prototype.setItems.call(this, items);
    //
    //    //this._items = Object.create(Object.getPrototypeOf(this._items));
    //    //
    //    //for (var i = 0; i < items.length; i++) {
    //    //    this.addItem(items[i]);
    //    //}
    //};

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
    //
    ///**
    // * @inheritDoc
    // * @returns {Array}
    // */
    //ArrayCollection.prototype.getItems = function()
    //{
    //    var items = [];
    //
    //    for (var index = 0; index < this._items.length; index++) {
    //        items[index] = this._items[index];
    //    }
    //
    //    return items;
    //};
    //
    ///**
    // * @inheritDoc
    // * @param {number} index
    // */
    //ArrayCollection.prototype.removeItem = function(index)
    //{
    //    if (typeof index != 'number') {
    //        throw new Error('Trying to remove array element by not numeric index "' + index + '" ' +
    //            'from property ' + this.getProperty() + '.');
    //    }
    //    this._items.splice(index, 1);
    //};
    //
    ///**
    // * @inheritDoc
    // */
    //ArrayCollection.prototype.eachItem = function(callback)
    //{
    //    if (typeof callback != 'function') {
    //        throw new Error('Invalid callback argument in method "Collection.eachItem". It must be a function.');
    //    }
    //    for (var index = 0; index < this._items.length; index++) {
    //        if (callback(this._items[index], index) === false) {
    //            break;
    //        }
    //    }
    //};
    //
    ///**
    // * @inheritDoc
    // */
    //ArrayCollection.prototype.getLength = function()
    //{
    //    return this._items.length;
    //};

    return ArrayCollection;

})();