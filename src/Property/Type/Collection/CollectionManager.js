/**
 * @class
 */
Subclass.Property.Type.Collection.CollectionManager = (function()
{
    function CollectionManager(collection)
    {
        if (!collection || !(collection instanceof Subclass.Property.Type.Collection.Collection)) {
            Subclass.Error.create('InvalidArgument')
                .argument('the collection instance', false)
                .received(collection)
                .expected('an instance of "Subclass.Property.Type.Collection.Collection"')
                .apply()
            ;
        }

        /**
         * Instance of collection
         *
         * @type {Subclass.Property.Type.Collection.Collection}
         */
        this._collection = collection;

        /**
         * List of collection item property instances
         *
         * @type {Object}
         * @private
         */
        //this._itemsProto = {};
        this._itemProps = {};

        /**
         * List of collection items
         *
         * @type {Object}
         * @private
         */
        this._items = {};
    }

    /**
     * Returns collection instance
     *
     * @returns {Subclass.Property.Type.Collection.Collection}
     */
    CollectionManager.prototype.getCollection = function()
    {
        return this._collection;
    };

    /**
     * Creates collection item
     *
     * @param {string} key
     * @param {*} value
     * @returns {*}
     */
    CollectionManager.prototype.createItem = function(key, value)
    {
        var collection = this.getCollection();
        var property = collection.getProperty();
        var proto = property.getProto();
        var protoDefinition = Subclass.Tools.copy(proto.getDefinition().getData());
        var itemsProto = this.getItemProps();
        var items = this.getItems();

        itemsProto[key] = property.getPropertyManager().createProperty(
            key, protoDefinition, property.getContextClass(), property
        );
        itemsProto[key].attach(items);

        if (value !== undefined) {
            items[key] = value;
        }

        return items[key];
    };

    /**
     * Sets items
     *
     * @param {Object} items
     */
    CollectionManager.prototype.setItems = function(items)
    {
        this._items = items;
    };

    /**
     * Returns collection items
     *
     * @returns {Object}
     */
    CollectionManager.prototype.getItems = function()
    {
        return this._items;
    };

    /**
     * Sets items properties
     *
     * @param {Object} itemProps
     */
    CollectionManager.prototype.setItemProps = function(itemProps)
    {
        this._itemProps = itemProps;
    };

    /**
     * Returns collection items proto. Each item proto is a PropertyType instance
     *
     * @returns {Object}
     */
    CollectionManager.prototype.getItemProps = function()
    {
        return this._itemProps;
    };

    /**
     * Returns collection item proto
     *
     * @param {string} key
     * @returns {*}
     */
    CollectionManager.prototype.getItemProp = function(key)
    {
        return this.getItemProps()[key];
    };

    return CollectionManager;
})();