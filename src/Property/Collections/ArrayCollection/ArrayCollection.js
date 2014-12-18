; ClassManager.PropertyManager.PropertyTypes.ArrayCollection.Collection = (function()
{
    /**
     * @param {CollectionType} property
     * @constructor
     */
    function ArrayCollection(property)
    {
        ArrayCollection.$parent.call(this, property);

        this._items = [];
    }

    ArrayCollection.$parent = ClassManager.PropertyManager.PropertyTypes.CollectionType.Collection;

    /**
     * @inheritDoc
     * @param {*} value
     */
    ArrayCollection.prototype.addItem = function(value)
    {
        this.validate(value);
        this._items.push(value);
    };

    /**
     * @inheritDoc
     * @param {Array} items
     */
    ArrayCollection.prototype.addItems = function(items)
    {
        var $this = this;

        if (!Array.isArray(items)) {
            throw new Error('Trying to set not array value ' +
                'to property "' + this.getProperty().getPropertyNameFull() + '" ' +
                'in class "' + this.getProperty().getContextClass().getClassName() + '".');
        }

        items.forEach(function(element, index) {
            $this.addItem(element);
        });
    };

    /**
     * @inheritDoc
     * @param {number} index
     * @param {*} value
     */
    ArrayCollection.prototype.setItem = function(index, value)
    {
        if (typeof index != 'number') {
            throw new Error('Trying to set array element with not valid index "' + index + '" ' +
                'in property "' + this.getProperty().getPropertyNameFull() + '" ' +
                'in class "' + this.getProperty().getContextClass().getClassName() + '".');
        }
        this.validate(value);
        this._items[index] = value;
    };

    /**
     * @inheritDoc
     * @param {Array} items
     */
    ArrayCollection.prototype.setItems = function(items)
    {
        if (!Array.isArray(items)) {
            throw new Error('Trying to set not array value ' +
                'to property "' + this.getProperty().getPropertyNameFull() + '" ' +
                'in class "' + this.getProperty().getContextClass().getClassName() + '".');
        }
        this._items = Object.create(Object.getPrototypeOf(this._items));

        for (var i = 0; i < items.length; i++) {
            this.addItem(items[i]);
        }
    };

    /**
     * @inheritDoc
     * @param {number} index
     */
    ArrayCollection.prototype.getItem = function(index)
    {
        if (!this.issetItem(index)) {
            throw new Error('Trying to get non existent array element with index "' + index + '" ' +
                'in property "' + this.getProperty().getPropertyNameFull() + '" ' +
                'in class "' + this.getProperty().getContextClass().getClassName() + '".');
        }
        return this._items[index];
    };

    /**
     * @inheritDoc
     * @returns {Array}
     */
    ArrayCollection.prototype.getItems = function()
    {
        var items = [];

        for (var index = 0; index < this._items.length; index++) {
            items[index] = this._items[index];
        }

        return items;
    };

    /**
     * @inheritDoc
     * @param {number} index
     */
    ArrayCollection.prototype.removeItem = function(index)
    {
        if (typeof index != 'number') {
            throw new Error('Trying to remove array element by not numeric index "' + index + '" ' +
                'from property "' + this.getProperty().getPropertyNameFull() + '" ' +
                'in class "' + this.getProperty().getContextClass().getClassName() + '".');
        }
        this._items.splice(index, 1);
    };

    /**
     * @inheritDoc
     */
    ArrayCollection.prototype.eachItem = function(callback)
    {
        if (typeof callback != 'function') {
            throw new Error('Invalid callback argument in method "Collection.eachItem". It must be a function.');
        }
        for (var index = 0; index < this._items.length; index++) {
            if (callback(this._items[index], index) === false) {
                break;
            }
        }
    };

    /**
     * @inheritDoc
     */
    ArrayCollection.prototype.getLength = function()
    {
        return this._items.length;
    };

    return ArrayCollection;

})();