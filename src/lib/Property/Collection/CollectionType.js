/**
 * @class
 * @extends {Subclass.PropertyManager.PropertyTypes.PropertyType}
 */
Subclass.PropertyManager.PropertyTypes.CollectionType = (function()
{
    /*************************************************/
    /*        Describing property type "Map"         */
    /*************************************************/

    /**
     * @param {PropertyManager} propertyManager
     * @param {string} propertyName
     * @param {Object} propertyDefinition
     * @extends {PropertyType}
     * @constructor
     */
    function CollectionType(propertyManager, propertyName, propertyDefinition)
    {
        CollectionType.$parent.call(
            this,
            propertyManager,
            propertyName,
            propertyDefinition
        );

        /**
         * @type {boolean}
         * @private
         */
        this._isNull = true;

        /**
         * @type {(Function|null)}
         * @private
         */
        this._collectionConstructor = null;

        /**
         * @type {(Collection|null)}
         * @private
         */
        this._collection = null;

        /**
         * @type {PropertyType}
         * @private
         */
        this._proto = null;
    }

    CollectionType.$parent = Subclass.PropertyManager.PropertyTypes.PropertyType;

    /**
     * Tells is property value null
     *
     * @returns {boolean}
     */
    CollectionType.prototype.isNull = function()
    {
        return this._isNull;
    };

    /**
     * Sets marker that tells that property value is null
     *
     * @param {boolean} isNull
     */
    CollectionType.prototype.setIsNull = function(isNull)
    {
        this._isNull = isNull;
    };

    /**
     * Sets prototype of collection items
     *
     * @param {object} proto
     */
    CollectionType.prototype.setProto = function(proto)
    {
        var propertyDefinition = this.getPropertyDefinition();

        this._proto = this.getPropertyManager().createProperty(
            'collectionItem',
            proto,
            this.getContextClass(),
            this
        );
    };

    /**
     * Returns property definition which every collection element should match
     *
     * @returns {Object}
     */
    CollectionType.prototype.getProto = function()
    {
        return this._proto;
    };

    /**
     * Returns constructor of collection class which will operate with stored collection elements
     *
     * @returns {Function}
     */
    CollectionType.prototype.getCollectionClass = function()
    {
        return Subclass.PropertyManager.PropertyTypes.CollectionType.Collection;
    };

    /**
     * Returns prepared collection constructor
     *
     * @returns {Function}
     */
    CollectionType.prototype.getCollectionConstructor = function()
    {
        if (!this._collectionConstructor) {
            this._collectionConstructor = this.createCollectionConstructor();
        }
        return this._collectionConstructor;
    };

    /**
     * Builds collection class constructor
     *
     * @returns {Function}
     */
    CollectionType.prototype.createCollectionConstructor = function()
    {
        var collectionConstructor = arguments[0];

        if (!arguments[0]) {
            collectionConstructor = this.getCollectionClass();
        }

        if (collectionConstructor.$parent) {
            var parentCollectionConstructor = this.createCollectionConstructor(
                collectionConstructor.$parent,
                false
            );

            var collectionConstructorProto = Object.create(parentCollectionConstructor.prototype);

            collectionConstructorProto = Subclass.Tools.extend(
                collectionConstructorProto,
                collectionConstructor.prototype
            );

            collectionConstructor.prototype = collectionConstructorProto;
            collectionConstructor.prototype.constructor = collectionConstructor;
        }

        return collectionConstructor;
    };

    /**
     * Returns collection instance
     *
     * @returns {Collection}
     */
    CollectionType.prototype.getCollection = function()
    {
        if (!this._collection) {
            var collectionConstructor = this.getCollectionConstructor();

            this._collection = new collectionConstructor(this);

            Object.seal(this._collection);
        }
        return this._collection;
    };

    /**
     * @inheritDoc
     */
    CollectionType.prototype.generateGetter = function()
    {
        var hashedPropName = this.getPropertyNameHashed();
        var $this = this;

        return function() {
            if ($this.isNull()) {
                return null;
            }
            return this[hashedPropName];
        };
    };

    /**
     * @inheritDoc
     */
    CollectionType.prototype.generateSetter = function()
    {
        var hashedPropName = this.getPropertyNameHashed();
        var $this = this;

        return function(value) {
            $this.validate(value);
            $this.setIsModified(true);

            if (value !== null) {
                $this.setIsNull(false);

                for (var childPropName in value) {
                    if (!value.hasOwnProperty(childPropName)) {
                        continue;
                    }
                    this[hashedPropName].setItem(
                        childPropName,
                        value[childPropName]
                    );
                }
            } else {
                $this.setIsNull(true);
                $this._collection.removeItems();
            }
        };
    };

    /**
     * @inheritDoc
     */
    CollectionType.prototype.attachHashedProperty = function(context)
    {
        var hashedPropName = this.getPropertyNameHashed();
        var defaultValue = this.getDefaultValue();

        if (defaultValue !== null) {
            this.setIsNull(false);
        }

        Object.defineProperty(context, hashedPropName, {
            configurable: true,
            enumerable: true,
            writable: true,
            value: this.getCollection()
        });
    };

    return CollectionType;

})();